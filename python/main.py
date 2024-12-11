import requests

# Google Maps API Key (indsæt din egen nøgle her)
API_KEY = "AIzaSyDo5awHrkRMFWHM5P93stcR1TE-lD5gIRc"

# Liste af adresser, der skal geokodes
addresses = [
    "Nørregade 12, 1165 København",
    "Skindergade 33, 1159 København",
    "Frederiksborggade 9, 1360 København",
    "Landemærket 3, 1119 København",
    "Købmagergade 30, 1150 København",
    "Vesterbrogade 2E, 1630 København",
    "Østergade 52, 1118 København",
    "Gammel Mønt 9, 1107 København",
    "Ny Østergade 11, 1105 København",
    "Københavns Hovedbanegård, 1571 København",
    "Sankt Annæ Plads 13, 1250 København",
    "Field's, Arne Jacobsens Allé 12, 2300 København S",
    "Magasin Kongens Nytorv, 1095 København K",
    "Østerbrogade 48, 2100 København Ø",
    "Amager Centret, Amagerbrogade 150, 2300 København S",
    "Kronen Vanløse, Vanløse Torv 1, 2720 Vanløse",
    "Lyngby Storcenter, Lyngby Hovedgade 43, 2800 Kongens Lyngby",
    "Holte Midtpunkt, Holte Midtpunkt 20, 2840 Holte",
    "Waterfront Shopping, Tuborg Havnevej 4-8, 2900 Hellerup",
    "City2, Hveen Boulevard 2, 2630 Taastrup",
    "Hørsholm Midtpunkt 125, 2970 Hørsholm",
    "Gentoftegade 64, 2820 Gentofte",
    "Farum Bytorv 5, 3520 Farum",
    "Østerbrogade 84, 2100 København Ø",
    "Københavnsvej 29-39, 4000 Roskilde",
    "Lyngby Hovedgade 76, 2800 Kongens Lyngby",
    "Ordrupvej 82, 2920 Charlottenlund",
    "Vesterbrogade 3, 1620 København V",
    "Østre Stationsvej 27, 5000 Odense C",
    "Ørbækvej 75, 5220 Odense SØ",
    "Strandbygade 22, 6700 Esbjerg",
    "Søndergade 27, 7100 Vejle",
    "Banegårdspladsen 1, 8000 Aarhus C",
    "Ryesgade 29, 8000 Aarhus C",
    "M.P. Bruunsgade 25, 8000 Aarhus C",
    "Nordre Strandvej 54, 8240 Risskov",
    "Algade 18, 9000 Aalborg",
    "Nytorv 27, 9000 Aalborg"
]


# Funktion til at finde koordinater
def get_coordinates(api_key, address):
    base_url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {"address": address, "key": api_key}
    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data['status'] == "OK":
            location = data["results"][0]["geometry"]["location"]
            return location["lat"], location["lng"]
        else:
            print(f"Geocoding failed for {address}: {data['status']}")
    else:
        print(f"HTTP request failed: {response.status_code}")
    return None, None

# Finder koordinater for hver adresse
locations = []
for address in addresses:
    lat, lng = get_coordinates(API_KEY, address)
    if lat and lng:
        locations.append({"lat": lat, "lng": lng, "address": address})

# Udskriver resultaterne
for location in locations:
    print(location)
