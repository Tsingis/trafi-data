import io
import pandas as pd
import requests
import zipfile


def get_vehicles():
    url = "https://opendata.traficom.fi/Content/Ajoneuvorekisteri.zip"
    response = requests.get(url)
    response.raise_for_status()
    zip_bytes = io.BytesIO(response.content)
    with zipfile.ZipFile(zip_bytes) as z:
        csv_file = next((f for f in z.namelist() if f.endswith(".csv")), None)

        if not csv_file:
            raise FileNotFoundError("No CSV file found")

        with z.open(csv_file) as f:
            csv_content = f.read()

    csv_string_io = io.StringIO(csv_content.decode("latin1"))
    column_map = {
        "ensirekisterointipvm": "registration_date",
        "kayttoonottopvm": "intro_date",
        "ajoneuvoluokka": "classification",
        "vari": "color",
        "kayttovoima": "driving_force",
        "sahkohybridi": "is_hybrid",
        "merkkiSelvakielinen": "maker",
        "kunta": "municipality",
        "matkamittarilukema": "odometer",
    }

    df = pd.read_csv(
        csv_string_io,
        sep=";",
        quotechar="'",
        encoding="latin",
        low_memory=False,
        memory_map=False,
        usecols=column_map.keys(),
        dtype={
            "vari": str,
            "kayttovoima": str,
            "kunta": str,
            "sahkohybridi": str,
            "merkkiSelvakielinen": str,
        },
    )

    df.rename(mapper=column_map, axis=1, inplace=True)

    # Filter to only passenger vehicle classes
    df = df[df["classification"].isin(["M1", "M1G"])]
    df.drop(labels="classification", axis=1, inplace=True)

    df.reset_index(inplace=True, drop=True)
    return df


def get_municipalities():
    url = (
        "https://data.stat.fi/api/classifications/v2/"
        "classifications/kunta_1_20240101/"
        "classificationItems?content=data&meta=max&lang=en&format=json"
    )
    response = requests.get(url)
    response.raise_for_status()
    municipalities = {
        item["code"]: item["classificationItemNames"][0]["name"]
        for item in response.json()
    }
    return municipalities
