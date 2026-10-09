
/* OpenLayers map */

const olMap = new ol.Map({
    target: "ol-map",
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([32.8597, 39.9334]),
        zoom: 6,
        minZoom: 2,
        maxZoom: 18,
        extent: ol.proj.transformExtent(
            [-180, -85, 180, 85],
            "EPSG:4326",
            "EPSG:3857"
        ),
        multiWorld: false
    })
});

const locations = [
    { name: "Ankara", coordinates: [32.8597, 39.9334] },
    { name: "Istanbul", coordinates: [28.9784, 41.0082] },
    { name: "Izmir", coordinates: [27.1428, 38.4237] },
    { name: "Antalya", coordinates: [30.7133, 36.8969] }
];

const markers = locations.map(location =>
    new ol.Feature({
        geometry: new ol.geom.Point(
            ol.proj.fromLonLat(location.coordinates)
        ),
        name: location.name
    })
);

const markerLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: markers
    }),
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({ color: "#e05252" }),
            stroke: new ol.style.Stroke({
                color: "#ffffff",
                width: 2
            })
        }),
        text: new ol.style.Text({
            text: "",
            offsetY: -15,
            fill: new ol.style.Fill({ color: "#172b4d" })
        })
    }),
    minZoom: 10
});

olMap.addLayer(markerLayer);


/* Leaflet map */

const leafletMap = L.map("leaflet-map", {
    worldCopyJump: false,
    minZoom: 2,
    maxZoom: 18,
    maxBounds: [[-85, -180], [85, 180]],
    maxBoundsViscosity: 1.0
}).setView([39.9334, 32.8597], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors',
    noWrap: true,
    bounds: [[-85, -180], [85, 180]]
}).addTo(leafletMap);

const leafletMarkers = L.layerGroup([
    L.marker([39.9334, 32.8597]).bindPopup("Ankara"),
    L.marker([41.0082, 28.9784]).bindPopup("Istanbul"),
    L.marker([38.4237, 27.1428]).bindPopup("Izmir"),
    L.marker([36.8969, 30.7133]).bindPopup("Antalya")
]);

function updateLeafletMarkers() {
    if (leafletMap.getZoom() >= 10) {
        if (!leafletMap.hasLayer(leafletMarkers)) {
            leafletMarkers.addTo(leafletMap);
        }
    } else {
        if (leafletMap.hasLayer(leafletMarkers)) {
            leafletMap.removeLayer(leafletMarkers);
        }
    }
}

leafletMap.on("zoomend", updateLeafletMarkers);
updateLeafletMarkers();
