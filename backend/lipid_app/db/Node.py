import abc

class OntologyNode(metaclass=abc.ABCMeta):

    @classmethod
    def __subclasshook__(cls, subclass):
        return (hasattr(subclass, 'extract_node_properties') and
                callable(subclass.extract_node_properties)
                or
                NotImplemented)

    @abc.abstractmethod
    def extract_node_properties(self,node_properties: dict,other_aliases: dict):
        raise NotImplementedError