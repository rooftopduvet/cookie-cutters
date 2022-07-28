"""Configuration and base models for openapi docs."""


class ListLinks:
    self: str
    prev: str
    next: str
    first: str
    last: str


class ItemLinks:
    self: str


class AttributesModel:
    created_at: str
    modified_at: str


class JSONAPIError:
    status: int
    title: str
    detail: str


class JSONAPIErrorResponse:
    errors: list[JSONAPIError]


def jsonapi_data(attributes_cls):
    """Decorator to turn an openapi response model into
    jsonapi format. (But just the data field).
    """
    class _AttributesModel(attributes_cls):
        created_at: str
        modified_at: str

    class _DataModel:
        id: str
        type: str
        attributes: _AttributesModel

    return _DataModel


def jsonapi_item(attributes_cls):
    """Decorator to turn an openapi response model for a single
    item into jsonapi format.
    """
    _DataModel = jsonapi_data(attributes_cls)

    class _JSONPIItemModel:
        data: _DataModel
        links: ItemLinks

    return _JSONPIItemModel


def jsonapi_list(attributes_cls):
    """Decorator to turn an openapi response model for a list of
    items into jsonapi format.
    """
    _ItemModel = jsonapi_item(attributes_cls)

    class _JSONPIItemModel:
        data: list[_ItemModel]
        links: ListLinks

    return _JSONPIItemModel
