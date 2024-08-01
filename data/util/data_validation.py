import re
from pydantic import BaseModel, field_validator, model_validator, ValidationError


class Municipality(BaseModel):
    code: str
    name: str
    countByDrivingForce: dict[str, int]
    countByColor: dict[str, int]
    countByRegistrationYear: dict[str, int]
    countByMaker: dict[str, int]

    @field_validator("countByDrivingForce", mode="before")
    def check_keys_in_countByDrivingForce(cls, value):
        required_keys = {"1", "2", "3", "4", "5"}
        if not required_keys.issubset(value.keys()):
            missing_keys = required_keys - set(value.keys())
            raise ValueError(f"Missing keys in 'countByDrivingForce': {missing_keys}")
        return value

    @field_validator("countByColor", mode="before")
    def check_keys_in_countByColor(cls, value):
        required_keys = {
            "black",
            "blue",
            "brown",
            "green",
            "grey",
            "red",
            "silver",
            "white",
            "other",
        }
        if not required_keys.issubset(value.keys()):
            missing_keys = required_keys - set(value.keys())
            raise ValueError(f"Missing keys in 'countByColor': {missing_keys}")
        return value

    @field_validator("countByRegistrationYear", mode="before")
    def check_keys_are_years(cls, value):
        if not all(key.isdigit() and len(key) == 4 for key in value.keys()):
            raise ValueError(
                "All keys in 'countByRegistrationYear' must be four-digit years"
            )
        return value

    @field_validator("countByMaker", mode="before")
    def check_keys_are_strings(cls, value):
        if not all(isinstance(key, str) for key in value.keys()):
            raise ValueError("All keys in 'countByMaker' must be strings")
        return value


class DataModel(BaseModel):
    date: str
    municipalities: list[Municipality]

    @field_validator("date")
    def validate_date_format(cls, value):
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", value):
            raise ValueError("The 'date' field must be in 'YYYY-MM-DD' format")
        return value

    @model_validator(mode="before")
    def check_municipalities_length(cls, values):
        municipalities = values["municipalities"]
        expected_length = getattr(cls, "expected_length")
        if len(municipalities) != expected_length:
            raise ValueError(
                f"'municipalities' list must contain exactly {expected_length} items"
            )
        return values

    @classmethod
    def create_with_expected_length(cls, data: dict, expected_length: int):
        cls.expected_length = expected_length
        return cls(**data)


def validate(data: dict, municipalities: dict):
    try:
        expected_length = len(municipalities.keys()) + 1
        DataModel.create_with_expected_length(data, expected_length)
        return True
    except ValidationError as ex:
        print(ex)
        return False
