from django.shortcuts import render
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .dummy_data import generics
from .db.Querys import Querys
from .tool.statistic_info import Tool
import json
from cobra.io import read_sbml_model, write_sbml_model

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

        results_path = Tool.annotate_model(file_path)

        return JsonResponse({"message": "Sucessfully Annotated"})


@api_view(["GET"])
def getAnnotations(request, pk):
    query = Querys()
    model_path = f"lipid_app/tool/models/{pk}.xml"
    model = read_sbml_model(model_path)
    model_id = model.id
    if model_id == "":
        model_id = "unidentified"
    annotations_path = f"lipid_app/tool/results/{model_id}.txt"
    with open(annotations_path, "r") as results_file:
        results_data = results_file.readlines()

    results_dict = {}
    for item in results_data:
        key, values = item.strip().split(" ", 1)
        values = values.replace("'", '"')
        results_dict[key] = json.loads(values)

    annotations_dict = {"annotated": {}, "suggested": {}}

    for key, value in results_dict.items():
        if len(value[0]) <= 1 and len(value[1]) <= 1:
            annotations_dict["annotated"][key] = value
        else:
            annotations_dict["suggested"][key] = value

    if annotations_dict["annotated"]:
        annotations_dict["annotated"] = query.get_lipid_gema_ID(
            annotations_dict["annotated"]
        )

    return Response(annotations_dict)
