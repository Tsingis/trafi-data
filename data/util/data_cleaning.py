import numpy as np
import pandas as pd


def clean(vehicles: pd.DataFrame, municipalities: dict):
    # Registration year
    vehicles["registration_date"] = pd.to_datetime(
        vehicles["registration_date"],
        format="%Y-%m-%d",
        cache=True,
        exact=True,
        yearfirst=True,
        errors="coerce",
    )

    vehicles["intro_year"] = (
        pd.to_numeric(vehicles["intro_date"].str[:4], errors="coerce")
        .fillna(0)
        .astype("Int16")
    )
    vehicles["registration_year"] = (
        vehicles["registration_date"]
        .dt.year.fillna(vehicles["intro_year"])
        .astype("Int16")
    )

    # Older than 1980 reduced to 1979
    vehicles.loc[vehicles["registration_year"] < 1980, "registration_year"] = 1979

    # Municipalities, map unmatched to 999 Unknown
    municipalities["999"] = "Unknown"
    vehicles["municipality"] = np.where(
        vehicles["municipality"].isin(municipalities.keys()),
        vehicles["municipality"],
        "999",
    )

    # Driving force grouping
    vehicles["is_hybrid"] = vehicles["is_hybrid"] == "true"

    driving_force_map = {
        "01": "1",  # Petrol
        "02": "2",  # Diesel
        "04": "4",  # Electricity
    }

    vehicles["driving_force"] = (
        vehicles["driving_force"].map(driving_force_map).fillna("5")
    )  # Other
    vehicles["driving_force"] = np.where(
        vehicles["is_hybrid"], "3", vehicles["driving_force"]
    )  # Hybrid

    # Color grouping
    color_map = {
        "0": "black",
        "1": "brown",
        "2": "red",
        "5": "green",
        "6": "blue",
        "8": "grey",
        "9": "white",
        "Y": "silver",
    }

    vehicles["color"] = vehicles["color"].map(color_map).fillna("other")

    # Odometer
    vehicles["odometer"] = (
        pd.to_numeric(vehicles["odometer"], errors="coerce").fillna(0).astype("Int32")
    )

    # Makers more unique
    vehicles["maker_text"] = vehicles["maker_text"].fillna("").str.lower()

    # Makers grouping
    maker_map = {
        "alfa": "Alfa Romeo",
        "alfa romeo": "Alfa Romeo",
        "aston martin": "Aston Martin",
        "audi": "Audi",
        "bmw": "BMW",
        "cadillac": "Cadillac",
        "chevrolet": "Chevrolet",
        "chrysler": "Chrysler",
        "citroen": "Citroën",
        "cupra": "Cupra",
        "dacia": "Dacia",
        "datsun": "Datsun",
        "dodge": "Dodge",
        "ferrari": "Ferrari",
        "fiat": "Fiat",
        "ford": "Ford",
        "honda": "Honda",
        "hyundai": "Hyundai",
        "jaguar": "Jaguar",
        "jeep": "Jeep",
        "kia": "Kia",
        "lada": "Lada",
        "lamborghini": "Lamborghini",
        "land rover": "Land Rover",
        "lexus": "Lexus",
        "Maserati": "Maserati",
        "mazda": "Mazda",
        "mercedes": "Mercedes-Benz",
        "mini": "Mini",
        "mitsubishi": "Mitsubishi",
        "nissan": "Nissan",
        "opel": "Opel",
        "peugeot": "Peugeot",
        "porsche": "Porsche",
        "polestar": "Polestar",
        "renault": "Renault",
        "saab": "Saab",
        "seat": "Seat",
        "skoda": "Škoda",
        "smart": "Smart",
        "subaru": "Subaru",
        "suzuki": "Suzuki",
        "tesla": "Tesla",
        "toyota": "Toyota",
        "volkswagen": "Volkswagen",
        "vw": "Volkswagen",
        "volvo": "Volvo",
    }

    def group_maker(maker):
        for prefix, target in maker_map.items():
            if maker.startswith(prefix):
                return target
        return "Other"

    vehicles["maker"] = vehicles["maker_text"].map(group_maker)

    vehicles.drop(
        labels=["registration_date", "intro_date", "intro_year", "is_hybrid"],
        axis=1,
        inplace=True,
    )

    return vehicles, municipalities


def generate(df: pd.DataFrame, municipalities: dict, date: str) -> dict:
    # Groupings
    grouped_driving = (
        df.groupby(["driving_force", "municipality"]).size().reset_index(name="count")
    )
    grouped_color = (
        df.groupby(["color", "municipality"]).size().reset_index(name="count")
    )
    grouped_maker = (
        df.groupby(["maker", "municipality"]).size().reset_index(name="count")
    )
    grouped_year = (
        df.groupby(["registration_year", "municipality"])
        .size()
        .reset_index(name="count")
    )

    # Counts for municipalities
    driving_forces = set(grouped_driving["driving_force"])
    colors = set(grouped_color["color"])
    years = set(grouped_year["registration_year"])
    makers = set(grouped_maker["maker"])

    final = []
    for municipality_code, group in grouped_driving.groupby("municipality"):
        # Driving forces
        driving_force_counts = dict(zip(group["driving_force"], group["count"]))
        for driving_force in driving_forces:
            if driving_force not in driving_force_counts:
                driving_force_counts[driving_force] = 0

        # Colors
        color_group = grouped_color[grouped_color["municipality"] == municipality_code]
        color_counts = dict(zip(color_group["color"], color_group["count"]))
        for color in colors:
            if color not in color_counts:
                color_counts[color] = 0

        # Registration years
        year_group = grouped_year[grouped_year["municipality"] == municipality_code]
        year_counts = dict(zip(year_group["registration_year"], year_group["count"]))
        year_counts_str = {str(year): count for year, count in year_counts.items()}

        # Makers
        maker_group = grouped_maker[grouped_maker["municipality"] == municipality_code]
        maker_counts = dict(zip(maker_group["maker"], maker_group["count"]))

        final.append(
            {
                "code": municipality_code,
                "name": municipalities[municipality_code],
                "countByDrivingForce": driving_force_counts,
                "countByColor": color_counts,
                "countByRegistrationYear": year_counts_str,
                "countByMaker": maker_counts,
            }
        )

    # Totals
    total_driving_force_counts = {driving_force: 0 for driving_force in driving_forces}
    total_color_counts = {color: 0 for color in colors}
    total_year_counts = {str(year): 0 for year in years}
    total_maker_counts = {maker: 0 for maker in makers}

    for municipality in final:
        for driving_force, count in municipality["countByDrivingForce"].items():
            total_driving_force_counts[driving_force] += count

        for color, count in municipality["countByColor"].items():
            total_color_counts[color] += count

        for year, count in municipality["countByRegistrationYear"].items():
            total_year_counts[year] += count

        for maker, count in municipality["countByMaker"].items():
            total_maker_counts[maker] += count

    final.append(
        {
            "code": "000",
            "name": "Finland",
            "countByDrivingForce": total_driving_force_counts,
            "countByColor": total_color_counts,
            "countByRegistrationYear": total_year_counts,
            "countByMaker": total_maker_counts,
        }
    )

    for municipality in final:
        municipality["countByDrivingForce"] = dict(
            sorted(municipality["countByDrivingForce"].items())
        )
        municipality["countByColor"] = dict(
            sorted(municipality["countByColor"].items())
        )
        municipality["countByRegistrationYear"] = dict(
            sorted(municipality["countByRegistrationYear"].items())
        )
        municipality["countByMaker"] = dict(
            sorted(municipality["countByMaker"].items())
        )

    final.sort(key=lambda x: x["name"])

    return {"date": date, "municipalities": final}
