from lipid_app.tool.model_annotator import LipidNameAnnotator
import pandas as pd
from cobra.io import read_sbml_model
from lipid_app.tool._utils import transform_boimmg_id_in_annotation_id
import os
from lipid_app.db._utils import read_conf_file


class Tool:
    def create_annotated_file(model_id, annotated_dict):
        path_txt = f"lipid_app/tool/results/{model_id}_annotated.conf"
        conf = open(path_txt, "w")
        for k, v in annotated_dict.items():
            conf.write(k + "=" + str(v) + "\n")

    def create_suggested_annotations_file(model_id, annotated_dict):
        path_txt = f"lipid_app/tool/results/{model_id}_suggested_annotations.conf"
        conf = open(path_txt, "w")
        for k, v in annotated_dict.items():
            conf.write(k + "=" + str(v) + "\n")

    def annotate_model(name):
        """Function that gets all statisticall information from LipidNameAnnotator class relative to lipids class caugth and number of lipids annotated.
        This data is stored in a spreadsheet specific for each model analised.

        :param path: Path to the model to be analised
        :type path: _type_
        """
        path = f"lipid_app/tool/models/{name}"
        model = read_sbml_model(path)
        annotator = LipidNameAnnotator()
        info = annotator.find_model_lipids(model)
        lipids_class = pd.Series(info[0])
        lipids_class = pd.DataFrame(lipids_class)
        original_annotations = pd.Series(info[1])
        original_annotations = pd.DataFrame(original_annotations)
        class_annotated = pd.Series(info[2])
        class_annotated = pd.DataFrame(class_annotated)
        sugested_annotations = info[3]

        ######## Annotations to be curated ########
        sugested_annotations = transform_boimmg_id_in_annotation_id(
            sugested_annotations
        )
        name = name.rsplit(".", 1)
        path_txt = f"lipid_app/tool/results/{name[0]}.txt"
        output = open(path_txt, "w")
        for k, v in sugested_annotations.items():
            output.writelines(f"{k} {v}\n")

        return path_txt

    def get_lipid_suggested_annotations(path, lipidKey):
        path = f"lipid_app/tool/results/{path}_suggested_annotations.conf"
        conf = read_conf_file(path)
        return conf[lipidKey]
