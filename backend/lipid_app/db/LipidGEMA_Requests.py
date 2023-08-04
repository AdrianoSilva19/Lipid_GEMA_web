import os
import json
from neo4j import GraphDatabase
from _utils import read_conf_file
from CompoundNode import CompoundNode
from DatabasesBabel import AliasesTransformer


class LipidGEMA:
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

    def get_all_hierarchies(self):
        glycerolipid_id = int(self.conf.get("glycerolipids"))
        glycerophospholipid_id = int(self.conf.get("glycerophospholipids"))
        sphingolipids_id = int(self.conf.get("sphingolipids"))
        fatty_acids_id = int(self.conf.get("fatty_acids"))
        prenol_lipids_id = int(self.conf.get("prenol_lipids"))

        hierarchies = {}

        glycerolipid_hierarchy = self.get_hierarchy(glycerolipid_id)
        print("glycerolipids done")
        glycerophospholipid_hierarchy = self.get_hierarchy(glycerophospholipid_id)
        print("glycerophospholipid done")
        sphingolipids_hierarchy = self.get_hierarchy(sphingolipids_id)
        print("sphingolipids done")
        fatty_acids_hierarchy = self.get_hierarchy(fatty_acids_id)
        print("fatty_acids done")
        prenol_lipids_hierarchy = self.get_hierarchy(prenol_lipids_id)
        print("prenol_lipids done")

        hierarchies["glycerolipids"] = glycerolipid_hierarchy
        hierarchies["glycerophospholipids"] = glycerophospholipid_hierarchy
        hierarchies["sphingolipids"] = sphingolipids_hierarchy
        hierarchies["fatty_acids"] = fatty_acids_hierarchy
        hierarchies["prenol_lipids"] = prenol_lipids_hierarchy
        print(hierarchies)
        return hierarchies

    def get_hierarchy(self, id):
        hierarchy = self._get_hierarchy(id)

        res = {}

        for pre in hierarchy:
            res1 = {}

            res[pre] = {}
            res[pre]["id"] = hierarchy[pre]["id"]
            for pre2 in hierarchy[pre]["children"]:
                res1[pre2] = {}
                res1[pre2]["id"] = hierarchy[pre]["children"][pre2]["id"]

                res2 = {}

                for pre3 in hierarchy[pre]["children"][pre2]["children"]:
                    res2[pre3] = {}
                    res2[pre3]["id"] = hierarchy[pre]["children"][pre2]["children"][
                        pre3
                    ]["id"]

                    res3 = self.__get_generic_leaves(
                        hierarchy[pre]["children"][pre2]["children"][pre3]["children"]
                    )

                    res2[pre3]["children"] = res3

                res1[pre2]["children"] = res2

            res[pre]["children"] = res1

        return res

    def __get_generic_leaves(self, dict3):
        res3 = {}

        for pre4 in dict3:
            not_last_stop = dict3[pre4]["children"]
            if not_last_stop:
                stack = []

                for key in not_last_stop:
                    stack.append(not_last_stop[key]["children"])

                while stack:
                    new_dict = stack.pop()

                    for key in new_dict:
                        if new_dict[key]["children"]:
                            stack.append(new_dict[key])

                        else:
                            res3[key] = {}
                            res3[key]["children"] = {}
                            res3[key]["id"] = new_dict[key]["id"]

            else:
                res3[pre4] = {}
                res3[pre4]["children"] = not_last_stop
                res3[pre4]["id"] = dict3[pre4]["id"]

        return res3

    def _get_hierarchy(self, id):
        predecessors = self.get_predecessors_by_ont_id_rel_type(id, "is_a")

        res = {}

        if predecessors:
            node_container = self.get_node_by_ont_id(predecessors[0])
            if not node_container.generic:
                return {}

            i = 0
            for pre in predecessors:
                i += 1
                new_dict = self._get_hierarchy(pre)
                pre_node_container = self.get_node_by_ont_id(pre)
                res[pre_node_container.name] = {}
                res[pre_node_container.name]["children"] = new_dict
                res[pre_node_container.name]["id"] = pre

            return res

        else:
            return {}

    def get_predecessors_by_ont_id_rel_type(
        self, ont_id: int, relationship_type: str
    ) -> list:
        """Get predecessors using as parameter the database identifier and the relationship type"""
        self.login()
        predecessors = []
        with self.tx.session() as session:
            result = session.run(
                "MATCH (c:Compound)<-[r]-(p:Compound) "
                "WHERE c.boimmg_id = $ont_id AND TYPE(r) = $rel_type "
                "RETURN p.boimmg_id as id "
                "order by p.annotated",
                ont_id=ont_id,
                rel_type=relationship_type,
            )

            data = result.data()
            if data:
                for node in data:
                    node_id = node.get("id")
                    predecessors.append(node_id)

        return predecessors

    def get_node_by_ont_id(self, ont_id: int) -> CompoundNode:
        """Get node container by ontology identifier"""
        self.login()
        with self.tx.session() as session:
            result = session.run(
                "MATCH (c:Compound) "
                "WHERE c.boimmg_id = $ont_id "
                "RETURN c, c.boimmg_id as id",
                ont_id=ont_id,
            )

            data = result.single()

            if data:
                node_properties = data.get("c")
                node_id = data.get("id")

                other_aliases = self.get_all_aliases(node_id)
                node = CompoundNode(node_id, node_properties, other_aliases)
                return node

            return None

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

            return res


if __name__ == "__main__":
    db = LipidGEMA()
    hierarchy = db.get_all_hierarchies()
    with open("lipid_hierarchy.json", "w") as f:
        json.dump(hierarchy, f)
