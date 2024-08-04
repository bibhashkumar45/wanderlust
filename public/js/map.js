mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
  container: "map",
  //       style: 'mapbox://styles/mapbox/dark-v11',
  projection: "globe", // Display the map as a globe, since satellite-v9 defaults to Mercator
  zoom: 9,
  center: listing.geometry.coordinates,
});

//   marker on map

console.log(listing.geometry.coordinates);

const marker = new mapboxgl.Marker({ color: "Red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h5>${listing.location}</h5><p>Exact location will be provided after booking</p>`
    )
  )
  .addTo(map);
