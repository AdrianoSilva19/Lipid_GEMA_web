import os


def read_conf_file(path):
    """
    reading the configuration file
    It must be assembled in the following manner: key = configuration value
    It will return a dictionary in the following format: {workers : 3, limit : 100}
    """
    res = {}

    with open(path) as file:
        lines = file.readlines()
        for line in lines:
            if "=" in line:
                prop = line.replace(" ", "").replace("\n", "")
                l_str = prop.split("=")
                res[l_str[0]] = l_str[1]

    return res
