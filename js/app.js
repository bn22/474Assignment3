
var map = L.map('map').setView([47.6550, -122.3080], 11);
mapLink = 
    '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 12,
    id: 'vipermk2.p5pi633n',
    accessToken: 'pk.eyJ1IjoidmlwZXJtazIiLCJhIjoiY2lrcDMzMGNxMHpxMHZ0a21lemVwODcxZyJ9.LseNs-vCbU8I8IVOxja5wA'
    }).addTo(map);

//Diasables the zoom function from the map but still allows the user to pan the camera
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
map.boxZoom.disable();
//document.getElementsByClassName("leaflet-control-zoom")[0].style.display = "none"

/* Initialize the SVG layer */
map._initPathRoot()    

/* We simply pick up the SVG from the map object */
var svg = d3.select("#map").select("svg"),
g = svg.append("g");

d3.json("SPD.json", function(collection) {
/* Add a LatLng object to each item in the dataset */
	collection.forEach(function(d) {
		console.log(d);
		d.LatLng = new L.LatLng(d.Latitude, d.Longitude)
	})

	var feature = g.selectAll("circle")
		.data(collection)
		.enter()
		.append("circle")
		.style("stroke", "black")  
		.style("opacity", 0.4) 
		.style("fill", "red")
		.attr("width", 5)
		.attr("height", 5)
		.attr("r", 2);  

	map.on("viewreset", update);
	update();

	function update() {
		feature.attr("transform", function(d) { 
			return "translate("+ 
				map.latLngToLayerPoint(d.LatLng).x +","+ 
				map.latLngToLayerPoint(d.LatLng).y +")";
			}
		)
	}
})			 