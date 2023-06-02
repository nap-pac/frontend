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
        center:[-32.007, 115.895],
        zoom: 18
    }

    window.map = new L.map('current-device-map' , mapOptions);

    let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    map.addLayer(layer);

    // let marker = new L.Marker([-32.007, 115.895]);
    // marker.addTo(map);
    // for (let i = 0; i < pointsArray.length; i++) {
    //     let marker = new L.Marker(pointsArray[i]);
    //     marker.addTo(map);
    // }

    map.on('click', (event)=> {
        // L.marker([event.latlng.lat , event.latlng.lng]).addTo(map);
        console.log(event.latlng.lat , event.latlng.lng);
    })
}

function replaceMarkers() {
    let map = window.map;
    let newMarkers = window.curMapData;
    console.log(newMarkers)
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
    if (newMarkers.length != 0 ) {   
        for (let i = 0; i < newMarkers.length; i++) {
            let marker = new L.Marker([newMarkers[i][2], newMarkers[i][1]]);
            marker.addTo(map);
        }

        // set center to first marker
        map.panTo([newMarkers[0][2], newMarkers[0][1]]);
        map.setZoom(18);
    }

    // set #current-device-location-data-points
    let currentDeviceLocationDataPoints = document.getElementById('current-device-location-data-points');
    currentDeviceLocationDataPoints.innerText = `(${newMarkers.length})`;
}

// https://medium.com/@nargessmi87/how-to-customize-the-openstreetmap-marker-icon-and-binding-popup-ab2254bddec2

