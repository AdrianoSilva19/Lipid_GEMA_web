from django.shortcuts import render
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .dummy_data import generics
from .db.Querys import Querys
from .tool.statistic_info import Tool
from cobra.io import read_sbml_model
from django.http import HttpResponse
from rest_framework import status
import mimetypes
import json
import ast
import os

# Create your views here.


@api_view(["GET"])
def getRoutes(request):
    routes = ["/api/generics/", "/api/generics/<id>/", "/api/lipid/<str:pk>"]
    return Response(routes)


@api_view(["GET"])
def getGenerics(request):
    return Response(generics)


@api_view(["GET"])
def getGeneric(request, pk):
    generic = None
    for i in generics:
        if i["boimmg_id"] == pk:
            generic = i
            break
    return Response(generic)


@api_view(["GET"])
def getLipid_by_SwissLipidsID(request, pk):
    query = Querys()
    sl_id = query.get_node_from_swiss_lipids_id(pk)

    return Response(sl_id)


@api_view(["GET"])
def getLipid_by_Id(request, pk):
    query = Querys()
    l_id = query.get_node_by_ont_id(pk)
    l_id = dict(l_id)
    components = query.get_components_by_ont_id_rel_type(pk)
    parents = query.get_parents(pk)
    l_id["parents"] = parents
    l_id["components"] = components
    l_id["generic"] = eval(l_id["generic"])
    if l_id["generic"]:
        l_id["children"] = query.get_children_by_id(pk, "False")
        l_id["children_species"] = query.get_children_by_id(pk, "True")
    return Response(l_id)


@api_view(["GET"])
def getLipid_by_LipidMapsID(request, pk):
    query = Querys()
    lm_id = query.get_node_from_lipid_maps_id(pk)

    return Response(lm_id)


@api_view(["POST"])
def upload_gsm_model(request):
    tool = Tool()
    if request.method == "POST" and request.FILES.get("gsmModel"):
        uploaded_file = request.FILES["gsmModel"]

        file_path = f"lipid_app/tool/models/{uploaded_file.name}"
        with open(file_path, "wb+") as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        tool.annotate_model(uploaded_file.name)

        return JsonResponse({"message": "Sucessfully Annotated"})


@api_view(["GET"])
def getAnnotations(request, pk):
    tool = Tool()
    query = Querys()
    path = f"lipid_app/tool/models/{pk}.xml"
    model = read_sbml_model(path)
    annotations_path = f"lipid_app/tool/results/{pk}.txt"
    with open(annotations_path, "r") as results_file:
        results_data = results_file.readlines()

    results_dict = {}
    for item in results_data:
        key, values = item.strip().split(" ", 1)
        values = values.replace("'", '"')
        results_dict[key] = json.loads(values)

    annotations_dict = {"annotated": {}, "suggested_annotation": {}}

    for key, value in results_dict.items():
        if len(value[0]) <= 1 and len(value[1]) <= 1:
            annotations_dict["annotated"][key] = value
        else:
            annotations_dict["suggested_annotation"][key] = value

    if annotations_dict["annotated"]:
        annotations_dict["annotated"] = query.get_lipid_gema_ID(
            annotations_dict["annotated"]
        )
    tool.create_annotated_file(
        model_id=pk, annotated_dict=annotations_dict["annotated"]
    )
    tool.create_suggested_annotations_file(
        model_id=pk, annotated_dict=annotations_dict["suggested_annotation"]
    )

    tool.set_lipid_metabolite_annotation(model, annotations_dict["annotated"], pk)

    return Response(annotations_dict)


@api_view(["GET"])
def getSuggestedAnnotation(request, pk, sk):
    tool = Tool()
    annotations_path = f"lipid_app/tool/results/{pk}_suggested_annotations.conf"

    lipid_annotations_list = tool.get_lipid_suggested_annotations(pk, sk)
    values = ast.literal_eval(lipid_annotations_list)

    return Response(values)


@api_view(["POST"])
def set_model_annotations(request):
    lipid_key = request.data.get("lipidKey")
    model_id = request.data.get("model_id")
    lipid = request.data.get("lipid")
    tool = Tool()
    annotations = {}

    if "swiss_lipids_id" in lipid:
        annotations["swiss_lipids_id"] = lipid["swiss_lipids_id"]

    if "lipidmaps_id" in lipid:
        annotations["lipid_maps_id"] = lipid["lipidmaps_id"]

    tool.set_sugested_lipid_metabolite_annotation(annotations, model_id, lipid_key)

    return JsonResponse({"message": "Successfully Annotated"})


@api_view(["GET"])
def getDownloadModel(request, pk):
    model_path = f"lipid_app/tool/results/{pk}_annotated.xml"

    # fill these variables with real values
    fl_path = f"lipid_app/tool/results/{pk}_annotated.xml"
    filename = f"{pk}_annotated.xml"

    fl = open(fl_path, "r")
    mime_type, _ = mimetypes.guess_type(fl_path)
    response = HttpResponse(fl, content_type=mime_type)
    response["Content-Disposition"] = "attachment; filename=%s" % filename
    deleteFiles(pk)
    return response


def deleteFiles(pk):
    file_paths = [
        f"lipid_app/tool/results/{pk}_annotated.xml",
        f"lipid_app/tool/results/{pk}.txt",
        f"lipid_app/tool/results/{pk}_suggested_annotations.conf",
        f"lipid_app/tool/results/{pk}_annotated.conf",
        f"lipid_app/tool/models/{pk}.xml",
    ]

    for file_path in file_paths:
        try:
            os.remove(file_path)
            print(f"File {file_path} deleted successfully.")
        except OSError as e:
            print(f"Error deleting {file_path}: {e}")
