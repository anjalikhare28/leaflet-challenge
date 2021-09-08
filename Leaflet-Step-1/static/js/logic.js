
function createMap(epicenters) {
    
    // Create a layer group made from the bike markers array, pass it into the createMap function
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });
    
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });
    
    
      var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "satellite-v9",
      accessToken: API_KEY
    });
    var outmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "outdoors-v11",
      accessToken: API_KEY
    });

    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap ,
      "Dark Map": darkmap  ,
      
"Satellite Map":satmap,
"Outdoor Map": outmap
    };
  
    // Create an overlayMaps object to hold the earthquakes layer
    var overlayMaps = {
      "Epicenters": epicenters
    };
  
    // Create the map object with options
    var map = L.map("map", {
      center: [37.09, -95.71],
      zoom: 4,
      layers: [lightmap, darkmap,satmap,outmap, epicenters]
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(map);

    // Setting the legend to appear in the bottom right of our chart 
    var legend = L.control({
        position: 'bottomright',
        title:"Test"
    });
    console.log("6");
    // Adding on the legend based off the color scheme we have 
    legend.onAdd = function (color) {
        var div = L.DomUtil.create('div', 'info legend');
        var levels = ['<1', '1-2', '2-3', '3-4', '4-5', '5+'];
        var colors = ['#3c0', '#9f6', '#fc3', '#f93', '#c60', '#c00']
        for (var i = 0; i < levels.length; i++) {
            div.innerHTML += '<i style="background:' + colors[i] + '"></i>' + levels[i] + '<br>';
        }
        return div;
    }   
    legend.addTo(map);  
}

function createMarkers(response) {
    var earthquakes = response.features;
    console.log(earthquakes.length);
    /*Sets up our color scheme for earthquakes */
    var colors = {
        level1: "#3c0",
        level2: "#9f6",
        level3: "#fc3",
        level4: "#f93",
        level5: "#c60",
        level6: "#c00"
    }

    var epicenters = [];

    // Pull the "earthquakes" property off of response.data
    for (var i = 0; i < earthquakes.length; i++) {
        var latitude = earthquakes[i].geometry.coordinates[1];
        var longitude = earthquakes[i].geometry.coordinates[0];
        var magnitude = earthquakes[i].properties.mag;
        var fillColor;
        if (magnitude > 5) {
            fillColor = colors.level6;
        } else if (magnitude > 4) {
            fillColor = colors.level5;
        } else if (magnitude > 3) {
            fillColor = colors.level4;
        } else if (magnitude > 2) {
            fillColor = colors.level3;
        } else if (magnitude > 1) {
            fillColor = colors.level2;
        } else {
            fillColor = colors.level1;
        }
        
        var epicenter = L.circleMarker([latitude, longitude], {
            radius: magnitude ** 2,
            color: "black",
            fillColor: fillColor,
            fillOpacity: 1,
            weight: 1
        })
        epicenter.bindPopup("<h3> " + new Date(earthquakes[i].properties.time) + "</h3><h4>Magnitude: " + magnitude +
        "<br>Location: " + earthquakes[i].properties.place + "</h4><br>");
        
        epicenters.push(epicenter);
    }    
    console.log("5");
    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(epicenters)); 
}
    
  // Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);