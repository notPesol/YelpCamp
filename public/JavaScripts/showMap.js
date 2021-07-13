// const camp = JSON.parse(jsonCamp);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map-detail', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: camp.geometry.coordinates, // starting position [lng, lat]
    zoom: 8 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h3>${camp.title}</h3><p>${camp.location}</p>`);

new mapboxgl.Marker({ color: 'red', scale: 0.8})
    .setLngLat(camp.geometry.coordinates)
    .setPopup(popup)
    .addTo(map)