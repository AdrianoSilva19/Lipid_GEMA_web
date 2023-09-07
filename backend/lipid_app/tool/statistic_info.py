import os
from lipid_app.tool.model_annotator import LipidNameAnnotator
import pandas as pd
from cobra.io import read_sbml_model, write_sbml_model
from lipid_app.tool._utils import transform_boimmg_id_in_annotation_id
from lipid_app.db._utils import read_conf_file
from neo4j import GraphDatabase
from cobra import Model


class Tool:
    """Tool class that will perform the annotations and handle annotation files"""

    def create_annotated_file(self, model_id: str, annotated_dict: dict):
        """
        Method to create a config file with the annotated lipid entities from a given <model_id> named model.

        annotated_dict = {lipid_key:[[LM_annotation],[SL_annotation],lipid_GEMA_ID]}

        :param model_id: Model name
        :type model_id: str
        :param annotated_dict: Dictionary with annotated lipid entities
        :type annotated_dict: dict
        """
        path_txt = f"lipid_app/tool/results/{model_id}_annotated.conf"
        conf = open(path_txt, "w")
        for k, v in annotated_dict.items():
            conf.write(k + "=" + str(v) + "\n")

    def create_suggested_annotations_file(self, model_id: str, annotated_dict: dict):
        """
        Method to create a config file with the suggested lipid entities from a given <model_id> named model.

        suggested_dict = {lipid_key:[[LM_annotation],[SL_annotation]]}

        :param model_id: Model name
        :type model_id: str
        :param annotated_dict: Dictionary with suggested lipid entities
        :type annotated_dict: dict
        """

        path_txt = f"lipid_app/tool/results/{model_id}_suggested_annotations.conf"
        conf = open(path_txt, "w")
        for k, v in annotated_dict.items():
            conf.write(k + "=" + str(v) + "\n")

    def annotate_model(self, name: str):
        """
        Method that implements the tool workflow to annotate the model. This model gathers important statistical information regarding the model annotaion.
        -Lipid class presented in the Model
        -Original annotation presented in the model
        -Classes that have suggested annotations
        -Suggested annotations to be setted
        The suggested annotations are stored in a TXT file

        :param name: Model name
        :type name: str
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

    def get_lipid_suggested_annotations(self, model_id: str, lipidKey: str) -> str:
        """
        Method that with a given model name and a given lipidKey gets the suggested annotations conf file and returns the annotations for the given lipidKey.

        :param model_id: model name
        :type model_id: str
        :param lipidKey: given lipidKey from the model
        :type lipidKey: str
        :return: stringuified list with the suggested annotaions
        :rtype: str
        """
        path = f"lipid_app/tool/results/{model_id}_suggested_annotations.conf"
        conf = read_conf_file(path)
        return conf[lipidKey]

    def set_lipid_metabolite_annotation(self, model, annotation_dict, model_id):
        path = f"lipid_app/tool/results/{model_id}_annotated.xml"
        session = self.login()
        model_final = self.set_metabolite_annotation_in_model(
            session, annotation_dict, model
        )
        write_sbml_model(model_final, path)

    def login(self) -> GraphDatabase.driver:
        """
        Method to create the connection to the database

        :return: session linkage to remote database
        :rtype:
        """
        conf = read_conf_file(os.path.dirname(__file__) + "/config/config.conf")
        uri = conf["uri"]
        user = conf["user"]
        password = conf["password"]
        driver = GraphDatabase.driver(uri, auth=(user, password), encrypted=False)
        session = driver.session()
        return session

    def set_metabolite_annotation_in_model(self, session, dictionary_results, model):
        """Function to anotate lipid metabolites in a user chossen model

        :param session: driver linkage to database
        :type session: GraphDatabase.driver
        :param dictionary_results: Python Dictionary with Lipid metabolites IDs from the BOIMMG the database
        :type dictionary_results: Dict
        :param model: GSM model to be annotated
        :type model: Model
        :return: Gsm model with defined Lipids annotated
        :rtype: Model
        """
        for metabolite_ids, annotaions_list in dictionary_results.items():
            lipid_maps_ids = annotaions_list[0]
            swiss_lipids_ids = annotaions_list[1]
            for metabolite in model.metabolites:
                if metabolite.id == metabolite_ids:
                    if len(lipid_maps_ids) != 0:
                        for values in lipid_maps_ids:
                            metabolite.annotation["lipidmaps"] = values
                    if len(swiss_lipids_ids) != 0:
                        for values in swiss_lipids_ids:
                            metabolite.annotation["slm"] = values

        return model

    def set_sugested_lipid_metabolite_annotation(self, annotations, model_id, lipidKey):
        path = f"lipid_app/tool/results/{model_id}_annotated.xml"
        model = read_sbml_model(path)
        model_final = self._set_sugested_lipid_metabolite_annotation(
            model, annotations, lipidKey
        )
        write_sbml_model(model_final, path)

    def _set_sugested_lipid_metabolite_annotation(
        self, model: Model, annotations: dict, lipidKey: str
    ) -> Model:
        """Function to anotate lipid metabolites in a user chossen model

        :param model: model to perform the annotation
        :type model: Model
        :param annotations: annotations to a given lipidkey
        :type annotations: dict
        :param lipidKey: lipid in the model to be annotated
        :type lipidKey: str
        :return: Annotated model
        :rtype: Model
        """
        final_model = model.copy()  # Copy the model to avoid modifying the original

        for metabolite in final_model.metabolites:
            if (
                lipidKey == metabolite.id
            ):  # Replace "lipidKey" with the appropriate key/id
                if "lipid_maps_id" in annotations:
                    metabolite.annotation["lipidmaps"] = annotations["lipid_maps_id"]
                if "swiss_lipids_id" in annotations:
                    metabolite.annotation["slm"] = annotations["swiss_lipids_id"]

        return final_model

    def get_annotated_dict(self, path_annotated_conf: str) -> dict:
        """
        Method to get the annotated conf file content

        :param path_annotated_conf: path to the actuall annotated conf file
        :type path_annotated_conf: str
        :return: Dictionary with the contend of the configuration file
        :rtype: dict
        """
        conf_content = read_conf_file(path_annotated_conf)
        return conf_content
