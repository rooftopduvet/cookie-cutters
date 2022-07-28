from sanic.exceptions import SanicException


class CustomException(SanicException):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)


class DBException(CustomException):
    """Use to forward errors from the database.

    Original errors should be logged, and this exception
    then used to communicate a sanitised response to the requestor.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs, status_code=500)
        self.title = 'Database Error'


class QueryException(CustomException):
    """Use to explain bad query arguments to the requestor."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs, status_code=400)
        self.title = 'Invalid Query Argument'


class URLException(CustomException):
    """Use to explain bad url arguments to the requestor."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs, status_code=400)
        self.title = 'Invalid URL Argument'


class BodyException(CustomException):
    """Use to explain bad body arguments to the requestor.

    For example, in POST JSON data.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs, status_code=400)
        self.title = 'Invalid Body Argument'
