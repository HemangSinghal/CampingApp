
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10,
    style: 'mapbox://styles/mapbox/streets-v12'

    // starting zoom
});
map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
new mapboxgl.Marker().setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${campground.title}</h3>`)
    ).addTo(map)
