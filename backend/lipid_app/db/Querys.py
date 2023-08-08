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
        uri = "bolt://palsson.di.uminho.pt:6094"
        driver = GraphDatabase.driver(
            uri,
            auth=("neo4j", "bucket-folio-truck-supreme-venus-2823"),
            encrypted=False,
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
                node_id = data.get("id")

                other_aliases = self.get_all_aliases(node_id)
                node = CompoundNode(node_id, node_properties, other_aliases)
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
