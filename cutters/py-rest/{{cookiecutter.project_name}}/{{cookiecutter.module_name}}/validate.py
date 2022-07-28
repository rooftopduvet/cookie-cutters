"""Utils for validating args to endpoints"""
import uuid


def validate_uuid(id: str, exception_cls: Exception = Exception):
    try:
        uuid.UUID(id)
    except ValueError:
        raise exception_cls(
            'ID length should be between 32 and 36 chars')
