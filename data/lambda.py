import boto3
import json
import logging
import os
from pydantic import ValidationError
from util.data_import import get_municipalities, get_vehicles
from util.data_cleaning import clean, generate
from util.data_validation import validate

BUCKET = os.getenv("BUCKET")
FILENAME = os.getenv("FILENAME", "data.json")

logger = logging.getLogger()
if logger.handlers:
    for handler in logger.handlers:
        logger.removeHandler(handler)

logFormat = "%(asctime)s %(name)s %(levelname)s: %(message)s"
logging.basicConfig(level=logging.WARNING, format=logFormat)


def handler(event: dict, context: dict):
    try:
        municipalities = get_municipalities()
        vehicles = get_vehicles()
        (vehicles, municipalities) = clean(vehicles, municipalities)
        data = generate(
            vehicles, municipalities, date="2024-03-31"
        )  # TODO: dynamic date
        valid = validate(data, municipalities)
        if valid:
            s3 = boto3.client("s3")
            s3.put_object(
                Bucket=BUCKET,
                Key=FILENAME,
                Body=json.dumps(data, indent=0, ensure_ascii=False),
            )
            tags = [{"Key": "AllowExpiration", "Value": "false"}]
            s3.put_object_tagging(Bucket=BUCKET, Key=FILENAME, Tagging={"TagSet": tags})
    except ValidationError:
        logger.exception("Invalid data")
    except Exception:
        logger.exception("Error processing data")
