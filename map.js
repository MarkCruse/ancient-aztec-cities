
        L.mapbox.accessToken =
            'pk.eyJ1IjoibWRjcnVzZSIsImEiOiJjanZvN25kaHQxdzAxNDhwZjM4NDNvMXV4In0.s4GSawMNB7Jo4Vf7LXKEew';

        var options = {
            center: [18.9063, -94.2792],
            zoom: 6,
            minZoom: 5,
            maxZoom: 8
        }
        var map = L.map('map', options);

        // set the max bounds
        map.setMaxBounds(map.getBounds())

        // Add tiles from the Mapbox Static Tiles API
        // (https://docs.mapbox.com/api/maps/#static-tiles)
        // Tiles are 512x512 pixels and are offset by 1 zoom level
        L.tileLayer(
            'https://api.mapbox.com/styles/v1/mdcruse/cl6sio9ip00c815qjuxyded6b/tiles/{z}/{x}/{y}?access_token=' +
            L.mapbox.accessToken, {
                tileSize: 512,
                zoomOffset: -1,
                attribution: '© <a href="https://www.mapbox.com/contribute/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

        var altIcon_black = L.icon({
            iconUrl: 'leaflet_circle_marker_black.png',
            iconSize: [10, 10], // size of the icon
            opacity: .2
        });
        var altIcon_red = L.icon({
            iconUrl: 'leaflet_circle_marker_red.png',
            iconSize: [10, 10], // size of the icon
            opacity: .2
        });

        const api = 'aztec_cities.geojson';

        async function fetchData(url) {
            try {
                const response = await fetch(url, {
                    cache: "force-cache"
                });
                const data = await response.json();
                return data;
            } catch (err) {
                console.error(err);
            }

        };
        fetchData(api)
            .then(data => {
                var marker = L.geoJson(data, {
                    pointToLayer: function (geoJsonPoint, latlng) {
                        return L.marker(latlng, {
                            icon: altIcon_black,
                        });
                    },
                    onEachFeature(feature, layer) {
                        layer.bindTooltip("<div style=padding:1px 3px 1px 3px'><b>" + feature.properties
                            .city + "</b>", {
                                permanent: true,
                                className: "my-labels",
                                opacity: 0.7
                            }).openTooltip();

                        const markerHoverTextEl = document.getElementById("marker-hover-text");
                        var options = {
                            units: 'miles'
                        };
                        // Create Leaflet event listener to add text to specified HTML element on mouseover/hover and mouseout
                        layer.on({
                            mouseover: function (e) {
                                markerHoverTextEl.innerHTML = "<h4>" + feature.properties
                                    .city + "</h4>" +
                                    feature.properties.description
                            },
                            mouseout: function (e) {
                                markerHoverTextEl.innerText = ""
                                e.target.setIcon(altIcon_black)
                            },

                            mousemove: function (e) {
                                e.target.setIcon(altIcon_red)
                            }
                        });
                    }


                }).addTo(map);

                map.fitBounds(marker.getBounds(), {
                    padding: [10, 10]
                });

            });