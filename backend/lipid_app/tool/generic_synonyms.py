from lipid_app.tool._utils import read_conf_file
import os
from neo4j import GraphDatabase


def set_compound_synonyms():
    """
    Insert synonyms in the generic compounds to allow the proper work of the annotator class
    """
    conf = read_conf_file(os.path.dirname(__file__) + "\config\config.conf")
    uri = conf["uri"]
    user = conf["user"]
    password = conf["password"]
    driver = GraphDatabase.driver(uri, auth=(user, password), encrypted=False)
    synonym_list = [
        "triacylglycerol",
        "1,2-diacyl-sn-glycerol",
        "1-phosphatidyl-1d-myo-inositol3-phosphate",
        "1-phosphatidyl-1d-myo-inositol4-phosphate",
        "1,2-diacyl-3-o-galactosyl-sn-glycerol",
        "digalactosyl-diacylglycerol",
        "monogalactosyldiacylglycerol",
        "digalactosyldiacylglycerol",
        "phosphatidyl-n-dimethylethanolamine",
        "1-phosphatidyl-n-methylethanolamine",
        "1-phosphatidyl-choline",
        "1-monoacylglycerol",
    ]
    compound_list = [
        "triacyl-sn-glycerol",
        "1,2-diacyl-sn-glycerol",
        "1,2-diacyl-sn-glycero-3-phospho-1D-myo-inositol-3-phosphate",
        "1,2-diacyl-sn-glycero-3-phospho-1D-myo-inositol-4-phosphate",
        "1,2-diacyl-3-beta-D-galactosyl-sn-glycerol",
        "1,2-diacyl-3-O-[alpha-D-galactosyl-(1->6)-beta-D-galactosyl]-sn-glycerol",
        "1,2-diacyl-3-beta-D-galactosyl-sn-glycerol",
        "1,2-diacyl-3-O-[alpha-D-galactosyl-(1->6)-beta-D-galactosyl]-sn-glycerol",
        "1,2-diacyl-sn-glycero-3-phospho-N,N-dimethylethanolamine",
        "1,2-diacyl-sn-glycero-3-phospho-N-acylethanolamine",
        "1,2-diacyl-sn-glycero-3-phosphocholine",
        "Monoacylglycerol",
    ]
    with driver.session() as session1:
        for i in range(len(synonym_list)):
            lipid_compound = compound_list[i]
            synonym = synonym_list[i]
            session1.run('MERGE (s: Synonym {synonym:"%s"})' % str(synonym))
            session1.run(
                "match (l:Compound),(s:Synonym) where l.name=$sl_id and "
                "s.synonym=$synonym merge (s)-[:is_synonym_of]->(l)",
                synonym=synonym,
                sl_id=lipid_compound,
            )


def set_components_synonyms():
    conf = read_conf_file(os.path.dirname(__file__) + "\config\config.conf")
    uri = conf["uri"]
    user = conf["user"]
    password = conf["password"]
    driver = GraphDatabase.driver(uri, auth=(user, password), encrypted=False)
    synonym_list = ["16:3(7z,10z,13z)"]
    compound_list = [2896856]
    with driver.session() as session1:
        for i in range(len(synonym_list)):
            lipid_compound = compound_list[i]
            synonym = synonym_list[i]
            session1.run('MERGE (s: Synonym {synonym:"%s"})' % str(synonym))
            session1.run(
                "match (l:SwissLipidsCompound),(s:Synonym) where id(l)=$sl_id and "
                "s.synonym=$synonym merge (s)-[:is_synonym_of]->(l)",
                synonym=synonym,
                sl_id=lipid_compound,
            )


if __name__ == "__main__":
    set_compound_synonyms()
    set_components_synonyms()
