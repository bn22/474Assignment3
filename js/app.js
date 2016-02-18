//Initalizes the map which is centered on the University of Washington campus
var map = L.map('map').setView([47.6550, -122.3080], 13);
mapLink = 
    '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 14,
    id: 'vipermk2.p5pi633n',
    accessToken: 'pk.eyJ1IjoidmlwZXJtazIiLCJhIjoiY2lrcDMzMGNxMHpxMHZ0a21lemVwODcxZyJ9.LseNs-vCbU8I8IVOxja5wA'
    }).addTo(map);

//Diasables the zoom function from the map but still allows the user to pan the camera
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
map.boxZoom.disable();
//document.getElementsByClassName("leaflet-control-zoom")[0].style.display = "none"

//Connects the map from Leaflet to d3.js
map._initPathRoot()    

//Tells d3 to use the Map div created from Leaflet
var svg = d3.select("#map").select("svg");
var g = svg.append("g");

//Formats the time given in the json into a month so it can be filtered
var format = d3.time.format("%x %H:%M");
var formatDate = d3.time.format("%B");

//Keeps track of the currently selected months and terms
var currentMonth;
var currentTerm;

function filterByCategoryMonth(term, month) {
	//Empties the previous map created by the user
	svg.selectAll("*").remove();
	svg = d3.select("#map").select("svg");
	g = svg.append("g");

	//Tells d3 to look through the provided json file
	d3.json("SPD.json", function(collection) {
		collection.forEach(function(d) {
			d.month = formatDate(format.parse(d["Event Clearance Date"]));
			d.LatLng = new L.LatLng(d.Latitude, d.Longitude);
		})

		//Looks at the user's input
		var filteredSection = term;
		var filteredMonth = month;

		//Splits the path based on the user's input
		if (filteredMonth == null && filteredSection == null) {
			var feature = g.selectAll("circle")
				.data(collection)
				.enter()
				.append("circle")
				.style("stroke", "black")  
				.style("opacity", 0.8) 
				.style("fill", "red")
				.attr("r", 2);  
		} else if (filteredSection != null && filteredMonth == null) {
			var feature = g.selectAll("circle")
				.data(collection)
				.enter()
				.append("circle")
				.filter(function(d) { 
					return d["Event Clearance Group"] == filteredSection  
				})
				.style("stroke", "black")  
				.style("opacity", 0.8) 
				.style("fill", function(d) {
					if (d["Event Clearance Group"] == "AUTO THEFTS") {
						return "red"
					} else if (d["Event Clearance Group"] == "BIKE") {
						return "orange"
					} else if (d["Event Clearance Group"] == "OTHER PROPERTY") {
						return "blue"
					}
				})
				.attr("r", 2);  
		} else if (filteredSection == null && filteredMonth != null) {
			var feature = g.selectAll("circle")
				.data(collection)
				.enter()
				.append("circle")
				.filter(function(d) { 
					return formatDate(format.parse(d["Event Clearance Date"])) == filteredMonth 
				})
				.style("stroke", "black")  
				.style("opacity", 0.8) 
				.style("fill", function(d) {
					if (d["Event Clearance Group"] == "AUTO THEFTS") {
						return "red";
					} else if (d["Event Clearance Group"] == "BIKE") {
						return "orange";
					} else if (d["Event Clearance Group"] == "OTHER PROPERTY") {
						return "blue";
					}
				})
				.attr("r", 2);  
		} else {
			var feature = g.selectAll("circle")
				.data(collection)
				.enter()
				.append("circle")
				.filter(function(d) { 
					return d["Event Clearance Group"] == filteredSection 
				})
				.filter(function(d) { 
					return formatDate(format.parse(d["Event Clearance Date"])) == filteredMonth 
				})
				.style("stroke", "black")  
				.style("opacity", 0.8) 
				.style("fill", "red")
				.attr("r", 2);  
		}

		//Resets the view whenever the user interacts with the map through zooming or panning
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
}

filterByCategoryMonth(null, null);

$('#auto').click(function() {
	filterByCategoryMonth("AUTO THEFTS", "September");
});

$("#bike").click(function() {
	filterByCategoryMonth("BIKE", "December");
});

$('#other').click(function() {
	filterByCategoryMonth("OTHER PROPERTY", "May");
});