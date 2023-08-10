import json
from neo4j import GraphDatabase

driver = GraphDatabase.driver(
    "bolt://palsson.di.uminho.pt:6091", auth=("neo4j", "1234"), encrypted=False
)
session = driver.session()


def get_some_data():
    query = (
        "match (C:Compound) where id(C) in [43747,10002,240,365792,540868] return C "
    )
    return session.run(query)


def node_to_dict(node):
    # Convert the Node properties to a dictionary
    return dict(node)


def save_to_json(data, file_path):
    with open(file_path, "w") as json_file:
        json.dump(data, json_file, indent=2)


if __name__ == "__main__":
    # Get the data from the Neo4j query
    result = get_some_data()
    # Convert the Neo4j Nodes to dictionaries
    data = [node_to_dict(record["C"]) for record in result]

    # Save the data to a JSON file
    save_to_json(data, "dummy_data.json")
