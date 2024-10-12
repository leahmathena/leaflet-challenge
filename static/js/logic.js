// Create the map and set its view
const map = L.map('map').setView([37.09, -95.71], 4); // Centered over the U.S.

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Function to get the color based on depth
function getColor(depth) {
    return depth > 50 ? '#FF0000' : // Red for deep earthquakes
           depth > 30 ? '#FF7F00' : // Orange for medium depth
           depth > 10 ? '#FFFF00' : // Yellow for shallow depth
                        '#00FF00';  // Green for very shallow
}

// Fetch earthquake data from the USGS API
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    .then(response => response.json())
    .then(data => {
        // Loop through each earthquake feature
        data.features.forEach(quake => {
            const [lon, lat, depth] = quake.geometry.coordinates;
            const magnitude = quake.properties.mag;

            // Create a circle marker for each earthquake
            L.circleMarker([lat, lon], {
                radius: magnitude * 3, // Scale radius based on magnitude
                fillColor: getColor(depth), // Color based on depth
                color: "#000000", // Border color
                weight: 1,
                fillOpacity: 0.7
            }).addTo(map)
              .bindPopup(`Magnitude: ${magnitude}<br>Location: ${quake.properties.place}<br>Depth: ${depth} km`);
        });

        // Create a legend
        const legend = L.control({ position: 'bottomright' });
        legend.onAdd = function () {
            const div = L.DomUtil.create('div', 'info legend');
            const depths = [0, 10, 30, 50];
            const colors = ['#00FF00', '#FFFF00', '#FF7F00', '#FF0000'];

            // Loop through the depth intervals and generate labels
            for (let i = 0; i < depths.length; i++) {
                div.innerHTML +=
                    `<i style="background:${colors[i]}"></i> ${depths[i]}${depths[i + 1] ? ' &ndash; ' + depths[i + 1] + ' km' : '+'}<br>`;
            }
            return div;
        };
        legend.addTo(map);
    })
    .catch(error => console.error('Error fetching earthquake data:', error));
