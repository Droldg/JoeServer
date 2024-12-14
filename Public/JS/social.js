function initMap() {
  const copenhagen = { lat: 55.6830, lng: 12.5705 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: copenhagen,
  });

  const locations = [
    { lat: 55.6804, lng: 12.5713, address: "Nørregade 12, 1165 København", link: "../HTML/social-feed.html" },
    { lat: 55.6800, lng: 12.5700, address: "Skindergade 33, 1159 København", link: "../HTML/social-feed2.html" },
    { lat: 55.6830, lng: 12.5705, address: "Frederiksborggade 9, 1360 København", link: "../HTML/social-feed3.html" },
    { lat: 55.6825, lng: 12.5750, address: "Landemærket 3, 1119 København" },
    { lat: 55.6810, lng: 12.5755, address: "Købmagergade 30, 1150 København" },
    { lat: 55.6750, lng: 12.5650, address: "Vesterbrogade 2E, 1630 København" },
    { lat: 55.6780, lng: 12.5800, address: "Østergade 52, 1118 København" },
    { lat: 55.6790, lng: 12.5780, address: "Gammel Mønt 9, 1107 København" },
    { lat: 55.6800, lng: 12.5770, address: "Ny Østergade 11, 1105 København" },
    { lat: 55.6730, lng: 12.5680, address: "Københavns Hovedbanegård, 1571 København" },
    { lat: 55.6710, lng: 12.5650, address: "Sankt Annæ Plads 13, 1250 København" },
    { lat: 55.6580, lng: 12.5900, address: "Field's, Arne Jacobsens Allé 12, 2300 København S" },
    { lat: 55.6750, lng: 12.5680, address: "Magasin Kongens Nytorv, 1095 København K" },
    { lat: 55.6910, lng: 12.5830, address: "Østerbrogade 48, 2100 København Ø" },
    { lat: 55.6620, lng: 12.6000, address: "Amager Centret, Amagerbrogade 150, 2300 København S" },
    { lat: 55.6836, lng: 12.4860, address: "Kronen Vanløse, Vanløse" },
    { lat: 55.7704, lng: 12.5116, address: "Lyngby Storcenter, Lyngby" },
    { lat: 55.8180, lng: 12.4730, address: "Holte Midtpunkt, Holte" },
    { lat: 55.7308, lng: 12.5779, address: "Waterfront Shopping, Hellerup" },
    { lat: 55.6508, lng: 12.3605, address: "City2, Høje Taastrup" },
  ];

  const iconUrl = "../PNG/joeLogo.svg";

  locations.forEach((location) => {
    const marker = new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: map,
      title: location.address,
      icon: {
        url: iconUrl,
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(15, 15),
      },
    });

    const infowindow = new google.maps.InfoWindow({
      content: `
        <div style="font-size: 14px; font-family: Arial, sans-serif; color: #000; padding: 5px;">
          <strong>Address:</strong><br>${location.address}
          ${location.link ? `<br><button style="
              margin-top: 5px;
              padding: 8px 12px;
              font-size: 12px;
              font-weight: bold;
              background-color: #007BFF;
              color: #fff;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            " onclick="window.location.href='${location.link}'">Go to Social Feed</button>` : ""}
        </div>
      `,
    });

    marker.addListener("click", () => {
      infowindow.open(map, marker);
    });
  });
}
