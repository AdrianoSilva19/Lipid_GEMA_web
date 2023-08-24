from lipid_app.db.CompoundNode import CompoundNode
from neo4j import GraphDatabase
from lipid_app.db._utils import read_conf_file
import os


class Querys:
    def __init__(self):
        self.conf = read_conf_file(os.path.dirname(__file__) + "\config\config.conf")
        self.uri = self.conf["uri"]
        self.user = self.conf["user"]
        self.password = self.conf["password"]

    def login(self):
        driver = GraphDatabase.driver(
            self.uri, auth=(self.user, self.password), encrypted=False
        )
        self.tx = driver

    @property
    def tx(self):
        return self._tx

    @tx.setter
    def tx(self, tx):
        self._tx = tx

    def get_all_aliases(self, node_id):
        self.login()
        with self.tx.session() as session:
            result = session.run(
                "MATCH (c)-[:is_db_link_of]->(d:Compound) "
                "WHERE d.boimmg_id = $node_id "
                "RETURN c",
                node_id=node_id,
            )

            data = result.data()
            res = []
            if data:
                for node in data:
                    node_properties = node.get("c")
                    res.append(node_properties)

    def get_node_from_swiss_lipids_id(self, slm_id: str) -> CompoundNode:
        self.login()
        with self.tx.session() as session:
            result = session.run(
                "MATCH (c:Compound) "
                "WHERE c.swiss_lipids_id = $slm_id "
                "RETURN c, c.boimmg_id as id",
                slm_id=slm_id,
            )

            data = result.single()
            if data:
                node_properties = data.get("c")
                node_id = data.get("id")
                other_aliases = self.get_all_aliases(node_id)
                node = CompoundNode(node_id, node_properties, other_aliases)

                return node_properties

            else:
                return None

    def get_node_by_ont_id(self, ont_id: int) -> CompoundNode:
        """Get node container by ontology identifier"""
        self.login()
        with self.tx.session() as session:
            result = session.run(
                "MATCH (c:Compound) "
                "WHERE id(c) = $ont_id "
                "RETURN c, c.boimmg_id as id",
                ont_id=ont_id,
            )

            data = result.single()
            if data:
                node_properties = data.get("c")
                return node_properties

            return None

    def get_node_from_lipid_maps_id(self, lipid_maps_id: str) -> CompoundNode:
        self.login()
        with self.tx.session() as session:
            result = session.run(
                "MATCH (c:Compound) "
                "WHERE c.lipidmaps_id = $lipid_maps_id "
                "RETURN c, c.boimmg_id as id",
                lipid_maps_id=lipid_maps_id,
            )

            data = result.single()
            if data:
                node_properties = data.get("c")
                node_id = data.get("id")
                other_aliases = self.get_all_aliases(node_id)
                node = CompoundNode(node_id, node_properties, other_aliases)

                return node_properties

            else:
                return None

    def get_components_by_ont_id_rel_type(self, ont_id: int) -> list:
        """Get predecessors using as parameter the database identifier and the relationship type"""
        self.login()
        components = []
        relationship_type = "component_of"
        with self.tx.session() as session:
            result = session.run(
                "MATCH (c:Compound)<-[r]-(p:Compound) "
                "WHERE c.boimmg_id = $ont_id AND TYPE(r) = $rel_type "
                "RETURN p.boimmg_id as id, p.formula as formula, p.name as name,p.smiles as smiles ",
                ont_id=ont_id,
                rel_type=relationship_type,
            )

            data = result.data()
            if data:
                for node in data:
                    name = node.get("name")
                    formula = node.get("formula")
                    node_id = node.get("id")
                    smiles = node.get("smiles")
                    components.append(
                        {
                            "boimmg_id": str(node_id),
                            "name": name,
                            "formula": formula,
                            "smiles": smiles,
                        }
                    )

        return components

    def get_parents(self, ont_id: int) -> dict:
        """Get predecessors using as parameter the database identifier and the relationship type"""
        self.login()
        parents = []
        relationship_type = "is_a"
        with self.tx.session() as session:
            result = session.run(
                "MATCH (c:Compound)-[r]->(p:Compound) "
                "WHERE c.boimmg_id = $ont_id AND TYPE(r) = $rel_type "
                "RETURN distinct(p.boimmg_id) as id, p.formula as formula, p.name as name, p.smiles as smiles ",
                ont_id=ont_id,
                rel_type=relationship_type,
            )

            data = result.data()
            if data:
                for node in data:
                    name = node.get("name")
                    formula = node.get("formula")
                    node_id = node.get("id")
                    smiles = node.get("smiles")
                    parents.append(
                        {
                            "boimmg_id": str(node_id),
                            "name": name,
                            "formula": formula,
                            "smiles": smiles,
                        }
                    )

        return parents

    def get_children_by_id(self, ont_id, generic):
        self.login()
        children = []
        relationship_type = "is_a"
        with self.tx.session() as session:
            result = session.run(
                "MATCH (c:Compound)-[r]->(d:Compound) "
                "WHERE d.boimmg_id = $ont_id AND TYPE(r) = $rel_type and c.generic = $generic "
                "RETURN distinct(c.boimmg_id) as id, c.formula as formula, c.name as name, c.smiles as smiles ",
                ont_id=ont_id,
                generic=generic,
                rel_type=relationship_type,
            )

            data = result.data()
            if data:
                for node in data:
                    name = node.get("name")
                    formula = node.get("formula")
                    node_id = node.get("id")
                    smiles = node.get("smiles")
                    children.append(
                        {
                            "boimmg_id": str(node_id),
                            "name": name,
                            "formula": formula,
                            "smiles": smiles,
                        }
                    )

        return children

    def get_lipid_gema_ID(self, annotations_list):
        for key, value in annotations_list.items():
            lm_annotation = value[0]
            sl_annotation = value[1]

            new_values = []  # Create a new list for the added values

            if lm_annotation is not None:
                for _id in lm_annotation:
                    lg_id = self.get_node_from_lipid_maps_id(_id)
                    new_values.append(lg_id.id)
            else:
                for _id in sl_annotation:
                    lg_id = self.get_node_from_swiss_lipids_id(_id)
                    new_values.append(lg_id.id)

            # Extend the existing value list with the new_values list
            value.extend(new_values)
        return annotations_list
