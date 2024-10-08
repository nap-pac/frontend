function loadMap(mapPoints = []) {
  // let mapOptions = {
  //     center:[-32.007, 115.895],
  //     zoom: 18
  // }

  // let pointsArray = [[-32.007286269639884,115.89573190719568],
  //     [-32.00716344863782, 115.89552814967419],
  //     [-32.00690870825708, 115.89550133947397],
  //     [-32.006740397259996, 115.89527077175225],
  //     [-32.006704005652416, 115.89495977342996],
  //     [-32.006740397259996, 115.89464877510767],
  //     [-32.006758593058365, 115.89418763966424],
  //     [-32.00676314200739, 115.89397315806264]]

  let mapOptions = {
    center: [-32.007, 115.895],
    zoom: 18,
  };

  window.map = new L.map("current-device-map", mapOptions);

  let layer = new L.TileLayer(
    "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );
  map.addLayer(layer);

  // let marker = new L.Marker([-32.007, 115.895]);
  // marker.addTo(map);
  // for (let i = 0; i < pointsArray.length; i++) {
  //     let marker = new L.Marker(pointsArray[i]);
  //     marker.addTo(map);
  // }

  map.on("click", (event) => {
    // L.marker([event.latlng.lat , event.latlng.lng]).addTo(map);
    console.log(event.latlng.lat, event.latlng.lng);
  });
}

function replaceMarkers() {
  let map = window.map;
  let newMarkers = window.curMapData;
  console.log(newMarkers);
  // [
  //     "D0:21:F9:93:38:5F",
  //     115.86475,
  //     -32.00183,
  //     4.5,
  //     126.699997,
  //     1683825733
  // ]

  // clear old data
  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });
  if (newMarkers.length != 0) {
    for (let i = 0; i < newMarkers.length; i++) {
      let marker = new L.Marker([newMarkers[i][2], newMarkers[i][1]]);
      marker.addTo(map);
    }

    // set center to first marker
    map.panTo([newMarkers[0][2], newMarkers[0][1]]);
    map.setZoom(18);
  }

  // set #current-device-location-data-points
  let currentDeviceLocationDataPoints = document.getElementById(
    "current-device-location-data-points"
  );
  currentDeviceLocationDataPoints.innerText = `(${newMarkers.length})`;
}

// https://medium.com/@nargessmi87/how-to-customize-the-openstreetmap-marker-icon-and-binding-popup-ab2254bddec2

const hashCode = (s) =>
  s.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

async function loadMapPage(mapData = []) {
  let dataPoints = document.getElementById("full-location-data-points");
  // let mapEl = document.getElementById('full-map');
  dataPoints.innerText = `(${mapData.length})`;

  // let center be average of all points
  let centerLat = 0;
  let centerLng = 0;
  let groupPoints = {};
  for (let i = 0; i < mapData.length; i++) {
    centerLat += mapData[i][2];
    centerLng += mapData[i][1];
    // also group points by name
    if (groupPoints[mapData[i][0]] == undefined) {
      groupPoints[mapData[i][0]] = [];
    }
    groupPoints[mapData[i][0]].push(mapData[i]);
  }
  centerLat /= mapData.length;
  centerLng /= mapData.length;

  // config
  let mapOptions = {
    center: [centerLat, centerLng],
    zoom: 15,
  };
  window.map = new L.map("full-map", mapOptions);

  let layer = new L.TileLayer(
    "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );
  map.addLayer(layer);

  // let marker = new L.Marker([-32.007, 115.895]);
  // marker.addTo(map);

  // add a poly line for each group
  let groupKeys = Object.keys(groupPoints);
  for (let i = 0; i < groupKeys.length; i++) {
    // color based on name
    let groupKey = groupKeys[i];
    if (groupKey == "own") {
      color = "FF0000";
    } else {
      color = (hashCode(groupKey) & 0x00ffffff).toString(16).toUpperCase();
    }
    // extend color to 6 digits
    while (color.length < 6) {
      color = "0" + color;
    }
    color = "#" + color;
    let group = groupPoints[groupKey];
    let latlngs = [];
    for (let j = 0; j < group.length; j++) {
      // add random offset to latlngs
      latlngs.push([group[j][2], group[j][1]]);
      // also draw colored circle
      let circle = L.circle([group[j][2], group[j][1]], {
        color: color,
        fillColor: color,
        opacity: 1,
        radius: 3,
      }).addTo(map);
    }
    console.log(latlngs, color, groupKey);
    let polyline = L.polyline(latlngs, {
      color: color,
      weight: 5,
      opacity: 0.7,
      smoothFactor: 1,
    }).addTo(map);
    // add a popup
    polyline.bindPopup(groupKey);
  }

  map.on("click", (event) => {
    // L.marker([event.latlng.lat , event.latlng.lng]).addTo(map);
    console.log(event.latlng.lat, event.latlng.lng);
    // get address
    getCoordsWrapper(`${event.latlng.lat} ${event.latlng.lng}`)
  });
}

function getCoordinates(address) {
  const url = `https://nominatim.openstreetmap.org/search.php?q=${encodeURIComponent(address)}&format=jsonv2`;
  // const url = `https://nominatim.openstreetmap.org/reverse.php?format=jsonv2&lat=${address.split(" ")[0]}&lon=${address.split(" ")[1]}`;
  // https://nominatim.openstreetmap.org/ui/reverse.html?lat=-32.007129652163464&lon=115.89592818576988&zoom=15
  // -32.007129652163464 115.89592818576988 - 314 CURTIN

  return fetch(url, {
    // ignore cors
    mode: "cors",
  })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        if (data.length > 0) {
            const location = data[0];
            const lat = parseFloat(location.lat);
            const lon = parseFloat(location.lon);
            const boundingBox = location.boundingbox.map((x) => parseFloat(x));
            return { lat, lon, boundingBox };
        } else {
            throw new Error("No results found for the address.");
        }
    });
}

function getCoordsWrapper(address) {
    getCoordinates(address)
    .then((coordinates) => {
        console.log(`Latitude: ${coordinates.lat}, Longitude: ${coordinates.lon}`);
        // add marker on map and center map
        let map = window.map;
        let marker = new L.Marker([coordinates.lat, coordinates.lon]);
        marker.addTo(map);
        // draw bounding box
        let boundingBox = coordinates.boundingBox;
        let rectangle = L.rectangle([
            [boundingBox[0], boundingBox[2]],
            [boundingBox[1], boundingBox[3]]
        ], {color: "#ff7800", weight: 1}).addTo(map);

        // map.panTo([coordinates.lat, coordinates.lon]);
        // map.setZoom(18);

    })
    .catch((error) => {
        console.error("Error:", error.message);
    });
}


