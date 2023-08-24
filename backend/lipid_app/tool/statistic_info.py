from lipid_app.tool.model_annotator import LipidNameAnnotator
import pandas as pd
from cobra.io import read_sbml_model, write_sbml_model
from lipid_app.tool._utils import transform_boimmg_id_in_annotation_id


class Tool:
    def annotate_model(path):
        """Function that gets all statisticall information from LipidNameAnnotator class relative to lipids class caugth and number of lipids annotated.
        This data is stored in a spreadsheet specific for each model analised.

        :param path: Path to the model to be analised
        :type path: _type_
        """
        model = read_sbml_model(path)
        annotator = LipidNameAnnotator()
        info = annotator.find_model_lipids(model)
        model_id = model.id
        if model_id == "":
            model_id = "unidentified"
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
        path_txt = f"lipid_app/tool/results/{model_id}.txt"
        output = open(path_txt, "w")
        for k, v in sugested_annotations.items():
            output.writelines(f"{k} {v}\n")

        return path_txt
