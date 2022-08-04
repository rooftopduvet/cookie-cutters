import pytest
import uuid
from {{cookiecutter.module_name}} import validate

"""Tests to ensure correct id lengths."""


@pytest.mark.parametrize('id, should_fail', [
    (31, True),
    ('abc', True),
    (str(uuid.uuid4()), False),
])
def test_uuids(id, should_fail):
    if should_fail:
        with pytest.raises(Exception):
            validate.validate_uuid(id, Exception)
    else:
        validate.validate_uuid(id)
