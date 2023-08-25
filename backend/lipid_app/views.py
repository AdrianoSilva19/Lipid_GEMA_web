from django.shortcuts import render
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .dummy_data import generics
from .db.Querys import Querys
from .tool.statistic_info import Tool
import json
import ast

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
    if request.method == "POST" and request.FILES.get("gsmModel"):
        uploaded_file = request.FILES["gsmModel"]

        file_path = f"lipid_app/tool/models/{uploaded_file.name}"
        with open(file_path, "wb+") as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        Tool.annotate_model(uploaded_file.name)

        return JsonResponse({"message": "Sucessfully Annotated"})


@api_view(["GET"])
def getAnnotations(request, pk):
    query = Querys()
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
    Tool.create_annotated_file(
        model_id=pk, annotated_dict=annotations_dict["annotated"]
    )
    Tool.create_suggested_annotations_file(
        model_id=pk, annotated_dict=annotations_dict["suggested_annotation"]
    )

    return Response(annotations_dict)


@api_view(["GET"])
def getSuggestedAnnotation(request, pk, sk):
    annotations_path = f"lipid_app/tool/results/{pk}_suggested_annotations.conf"

    lipid_annotations_list = Tool.get_lipid_suggested_annotations(pk, sk)
    values = ast.literal_eval(lipid_annotations_list)
    for value in values:
        print(value)

    return Response(values)
