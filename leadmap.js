mapboxgl.accessToken = 'pk.eyJ1IjoiY2Fsdmx1IiwiYSI6ImNramk1ZWY4NzFuZDEyeXFwOWwyMWo5aWwifQ.hC7XWRkw4mr3Ql7Et7XQxQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/calvlu/ckji3aeky0aix19o7j0x1sapt',
  center: [-96, 37.8],
  zoom: 4
});

map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: false,
    flyTo: {
      zoom: 9
    }
  })
);

map.on('load', function() {

  // Change the cursor style as a UI indicator.
  map.getCanvas().style.cursor = 'pointer';

  // legend
  const legend = document.getElementById('legend');
  const legendColors = document.getElementById('legend-colors');
  const legendValues = document.getElementById('legend-values');
  const legValues = [0, 2, 5, 10, 15, '20+'];
  const legColors = ['#002aa8', '#086afd', '#87b3ff', '#f2ab61', '#d47841', '#aa4d2b'];
  legend.classList.add('block-ml');
  legValues.forEach((stop, idx) => {
    const key = `<div class='col h12' style='background-color:${legColors[idx]}'></div>`;
    const value = `<div class='col align-center'>${stop}</div>`;
    legendColors.innerHTML += key;
    legendValues.innerHTML += value;
  });
  // Create a popup, but don't add it to the map yet.
  var popup = new mapboxgl.Popup({
    offset: 12,
    closeButton: false
  });

  map.on('mousemove', function(e) {
    var features = map.queryRenderedFeatures(e.point, {
      layers: ['leadcounties']
    });

    if (features.length > 0) {

      var coordinates = features[0].geometry.coordinates.slice();
      var description = '<h3>' + features[0].properties.county + ', ' + features[0].properties.state + '</h3>' +
        '<p>Avg. Lead Level: <b>' + features[0].properties.sample_ppb + ' ppb</b><br> (parts per billion)</p>' +
        '<p></p>Asian: ' + (features[0].properties.perc_asian * 100).toFixed() + '%<br>' +
        'Black: ' + (features[0].properties.perc_black * 100).toFixed() + '%<br>' +
        'Hispanic: ' + (features[0].properties.perc_hisp * 100).toFixed() + '%<br>' +
        'Native: ' + (features[0].properties.perc_native * 100).toFixed() + '%<br>' +
        'White: ' + (features[0].properties.perc_white * 100).toFixed() + '%<br>' +
        '<p>Poverty Rate: ' + (features[0].properties.pov_rate * 100).toFixed() + '%</p>';

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup.setLngLat(e.lngLat).setHTML(description).addTo(map);
    } else {
      map.getCanvas().style.cursor = '';
      popup.remove();
    }
  });


});