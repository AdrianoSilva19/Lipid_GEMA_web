from django.urls import path
from . import views

urlpatterns = [
    path("", views.getRoutes, name="routes"),
    path("generics/", views.getGenerics, name="generics"),
    path("generics/<int:pk>/", views.getGeneric, name="generic"),
    path("lipid/SL_ID/<str:pk>/", views.getLipid_by_SwissLipidsID, name="sl_id"),
    path("lipid/L_ID/<int:pk>/", views.getLipid_by_Id, name="l_id"),
    path("lipid/LM_ID/<pk>/", views.getLipid_by_LipidMapsID, name="lm_id"),
    path("upload/", views.upload_gsm_model, name="upload_gsm_model"),
    path("model/<pk>", views.getAnnotations, name="annotations"),
    path("model/<pk>/<sk>", views.getSuggestedAnnotation, name="suggested_annotation"),
    path(
        "set_model_annotations/",
        views.set_model_annotations,
        name="set_model_annotations",
    ),
    path("download/model/<pk>", views.getDownloadModel, name="Download"),
    path(
        "download/model/annotations/<pk>",
        views.getDownloadAnnotations,
        name="Download_Annotations",
    ),
]
