// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Load the earthquake data from the JSON file
d3.json(queryUrl).then(function(data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
      // Calculate marker size based on magnitude
      var markerSize = feature.properties.mag * 5;
  
      // Calculate marker color based on depth
      var depth = feature.geometry.coordinates[2];
      var color = getColor(depth);
  
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}<br>Depth: ${depth} km</p>`);
  
      // Create the circle marker with adjusted size and color
      L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        radius: markerSize,
        fillColor: color,
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(myMap);
    }
  
    // Create a GeoJSON layer with markers for each earthquake
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });
  
    // Send the earthquakes layer to the createMap function
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {
    // Base layers good 
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Base maps object good
    var baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Overlay object with earthquakes layer good
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create the map with street map and earthquakes layers good
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [street, earthquakes]
    });
  
    // Create a layer control good
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
    // Create a legend good
    var legend = L.control({ position: 'bottomright' });
  
    legend.onAdd = function(map) {
      var div = L.DomUtil.create('div', 'info legend');
      var magnitude = [-10, 10, 30, 50, 70, 90]; //grades
      var colors = ['#2c7bb6', '#abd9e9', '#ffffbf', '#fdae61', '#d7191c', '#67001f'];
      var labels = [];
      // different other are consts and add legend info, div.innterHTMl=legendInfo
      
      function getColor(depth) {
        var colors = ['#2c7bb6', '#abd9e9', '#ffffbf', '#fdae61', '#d7191c', '#67001f'];
        var magnitude = [-10, 10, 30, 50, 70, 90]; //threshold
        for (var i = 0; i < magnitude.length; i++) {
            if (depth < magnitude[i]) {
                return colors[i];
            }
        }
    
        // If the depth is greater than the last threshold, return the color corresponding to the last threshold
        return colors[colors.length - 1];
    }
  
      // Loop through depth intervals and generate a label with a colored square for each interval
      for (var i = 0; i < magnitude.length; i++) {
        div.innerHTML +=
          '<i style="background:' + colors[i] + '"></i> ' +
          magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + ' km<br>' : '+ km');
      }
  
      return div;
    };
  
    legend.addTo(myMap);
  }
  
  
