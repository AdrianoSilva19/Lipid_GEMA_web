from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .dummy_data import generics
from .db.Querys import Querys
from .tool.statistic_info import Tool
from cobra.io import read_sbml_model
from django.http import HttpResponse
from django.http import JsonResponse
import boto3
from io import BytesIO
from django.shortcuts import redirect
from wsgiref.util import FileWrapper

import mimetypes
import json
import ast
import os
import pandas as pd

# Create your views here.

s3 = boto3.client(
    "s3",
    aws_access_key_id="AKIAWKPDRVDI6IEX6X6M",
    aws_secret_access_key="TXPMes9zKyo+az+T4H8Uw/3RWr4XYmlX8NL8XcX8",
)


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

        if uploaded_file.size <= 100 * 1024 * 1024:  # Check file size limit (100 MB)
            file_path = f"lipid_app/tool/models/{uploaded_file.name}"
            with open(file_path, "wb+") as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)

            tool.annotate_model(uploaded_file.name)

            return JsonResponse({"message": "Successfully Annotated"})
        else:
            return JsonResponse(
                {"error": "File size exceeds the limit of 100 MB."}, status=400
            )


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
    annotations_list = []
    annotations_swisslipids_list = []
    annotations_lipidmaps_list = []
    annotations = {}

    if "swiss_lipids_id" in lipid:
        annotations["swiss_lipids_id"] = lipid["swiss_lipids_id"]
        annotations_swisslipids_list.append(lipid["swiss_lipids_id"])

    if "lipidmaps_id" in lipid:
        annotations["lipid_maps_id"] = lipid["lipidmaps_id"]
        annotations_lipidmaps_list.append(lipid["lipidmaps_id"])

    annotations_list.append(annotations_lipidmaps_list)
    annotations_list.append(annotations_swisslipids_list)
    annotations_list.append(True)
    tool.set_sugested_lipid_metabolite_annotation(annotations, model_id, lipid_key)
    path_txt = f"lipid_app/tool/results/{model_id}_suggested_annotations.conf"

    # Read the existing annotations from the file
    with open(path_txt, "r") as conf_file:
        existing_annotations = conf_file.readlines()

    # Update the specific annotation and write the entire updated content back to the file
    with open(path_txt, "w") as conf_file:
        for line in existing_annotations:
            key, value = line.strip().split("=")
            if key == lipid_key:
                conf_file.write(f"{key}={str(annotations_list)}\n")
            else:
                conf_file.write(line)

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
        f"lipid_app/tool/models/{pk}.xml",
    ]

    for file_path in file_paths:
        try:
            os.remove(file_path)
            print(f"File {file_path} deleted successfully.")
        except OSError as e:
            print(f"Error deleting {file_path}: {e}")


@api_view(["GET"])
def getDownloadAnnotations(request, pk):
    s3_url = createXlsFile(pk)
    file_name = s3_url.split("/")[-1]

    # Create an HTTP response with the file as an attachment
    response = HttpResponse(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = f'attachment; filename="{file_name}"'

    # Use open_excel_from_s3 to get the BytesIO buffer
    file = open_excel_from_s3(s3_url, pk)

    # Write the content of the BytesIO buffer directly to the response
    response.write(file.getvalue())

    # Delete the file from S3 after it has been downloaded
    deleteXLFiles(pk)
    delete_file_from_s3(pk)

    return response


def open_excel_from_s3(s3_url, pk):
    # Download the file from S3
    excel_buffer = BytesIO()
    s3.download_fileobj("lipidgema", f"results/{pk}.xlsx", excel_buffer)

    # Set the buffer position to the beginning of the file
    excel_buffer.seek(0)
    print(excel_buffer)
    return excel_buffer


def createXlsFile(pk):
    tool = Tool()
    path_suggested_conf = f"lipid_app/tool/results/{pk}_suggested_annotations.conf"
    path_annotated_conf = f"lipid_app/tool/results/{pk}_annotated.conf"

    ## transform conf files into dictionaries to be easely handle ##

    annotated_dict = tool.get_annotated_dict(path_annotated_conf)
    parsed_annotated_dict = {}
    for key, value in annotated_dict.items():
        parsed_value = ast.literal_eval(value)
        parsed_value.pop()
        parsed_annotated_dict[key] = parsed_value

    suggested_dict = tool.get_annotated_dict(path_suggested_conf)
    parsed_suggested_dict = {}
    for key, value in suggested_dict.items():
        parsed_value = ast.literal_eval(value)
        parsed_suggested_dict[key] = parsed_value

    # From the suggested Lipid annotations select those who were annotated
    # from a given user and those who were not annotated

    suggested_annotated = {}
    suggested = {}

    for key, value in parsed_suggested_dict.items():
        if isinstance(value, list) and True in value:
            value.pop()
            suggested_annotated[key] = value
        else:
            suggested[key] = value

    merged_annotated_dicts = parsed_annotated_dict.copy()
    merged_annotated_dicts.update(suggested_annotated)
    annotations_data = {
        "LM_annotations": [
            item[0][0] if len(item[0]) > 0 else "NaN"
            for item in merged_annotated_dicts.values()
        ],
        "SL_annotations": [
            item[1][0] if len(item[1]) > 0 else "NaN"
            for item in merged_annotated_dicts.values()
        ],
    }
    class_annotated = pd.DataFrame(
        annotations_data, index=merged_annotated_dicts.keys()
    )
    class_annotated.index.name = "Annotated Entities"

    suggested_annotations_data = {
        "LM_annotations": [
            item[0] if len(item[0]) > 0 else "NaN" for item in suggested.values()
        ],
        "SL_annotations": [
            item[1] if len(item[1]) > 0 else "NaN" for item in suggested.values()
        ],
    }
    class_suggested = pd.DataFrame(suggested_annotations_data, index=suggested.keys())
    class_suggested.index.name = "Suggested Entities"

    rows = []
    for index, row in class_suggested.iterrows():
        for lm, sl in zip(row["LM_annotations"], row["SL_annotations"]):
            rows.append([index, lm, sl])

    new_columns = ["Suggested Entities", "LM_annotations", "SL_annotations"]
    new_class_suggested = pd.DataFrame(rows, columns=new_columns)

    excel_buffer = BytesIO()
    with pd.ExcelWriter(excel_buffer, engine="xlsxwriter") as writer:
        class_annotated.to_excel(
            writer, sheet_name=str(pk), index=True, startrow=0, startcol=0
        )
        new_class_suggested.to_excel(
            writer, sheet_name=str(pk), index=False, startrow=0, startcol=5
        )

    # Upload the XLSX file to AWS S3
    bucket_name = "lipidgema"
    s3_object_key = f"results/{pk}.xlsx"

    excel_buffer.seek(0)
    s3.upload_fileobj(excel_buffer, bucket_name, s3_object_key)

    # Return the S3 URL of the uploaded file
    s3_url = f"https://{bucket_name}.s3.amazonaws.com/{s3_object_key}"
    return s3_url


def delete_file_from_s3(pk):
    # Specify the S3 object key to be deleted
    s3_object_key = f"results/{pk}.xlsx"

    # Delete the object from the S3 bucket
    s3.delete_object(Bucket="lipidgema", Key=s3_object_key)


def deleteXLFiles(pk):
    file_paths = [
        f"lipid_app/tool/results/{pk}_annotated.conf",
        f"lipid_app/tool/results/{pk}_suggested_annotations.conf",
    ]

    for file_path in file_paths:
        try:
            os.remove(file_path)
            print(f"File {file_path} deleted successfully.")
        except OSError as e:
            print(f"Error deleting {file_path}: {e}")
