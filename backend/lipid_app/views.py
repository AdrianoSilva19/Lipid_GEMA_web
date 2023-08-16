from django.shortcuts import render
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .dummy_data import generics
from .db.Querys import Querys

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
    l_id["components"] = components
    return Response(l_id)


@api_view(["GET"])
def getLipid_by_LipidMapsID(request, pk):
    query = Querys()
    lm_id = query.get_node_from_lipid_maps_id(pk)

    return Response(lm_id)
