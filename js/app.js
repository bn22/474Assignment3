//Initalizes the map which is centered on the University of Washington campus
var map = L.map('map').setView([47.6550, -122.3080], 11);
mapLink = 
    '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 14,
    //minZoom, 10,
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
var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

//Formats the time given in the json into a month so it can be filtered
var format = d3.time.format("%x %H:%M");
var formatDate = d3.time.format("%m");

//Keeps track of the currently selected months and terms
var currentMonth = null;
var currentTerm = null;
var feature = null;
var collection = null;
var isCollectionNull = true;

function filterByCategoryMonth(filteredMonth, filteredSection) {
	//Empties the previous map created by the user
	svg.selectAll("*").remove();
	svg = d3.select("#map").select("svg");
	g = svg.append("g");

	//Tells d3 to look through the provided json file
	d3.json("SPD.json", function(collection) {
		collection.forEach(function(d) {
			d.month = formatDate(format.parse(d["Event Clearance Date"]));
			d.LatLng = new L.LatLng(d.Latitude, d.Longitude);
		});
         isCollectionNull == false;
        applyFilters(collection,filteredMonth,filteredSection);
    });
}
function applyFilters(collection,filteredMonth,filteredSection){
    //Splits the path based on the user's input
		if (filteredMonth == null && filteredSection == null) {
			 feature = g.selectAll("circle")
				.data(collection)
				.enter()
				.append("circle")
				.style("stroke", "black")  
				.style("opacity", 0.9) 
				.style("fill", function(d) {
					if (d["Event Clearance Group"] == "AUTO THEFTS") {
						return "orange"
					} else if (d["Event Clearance Group"] == "BIKE") {
						return "red"
					} else if (d["Event Clearance Group"] == "OTHER PROPERTY") {
						return "blue"
					}
				})
				.attr("r", 3)
                          .on("mouseover", function(d) {      
            div.transition()        
                .duration(200)      
                .style("opacity", .9);      
            div .html(d["Event Clearance Date"] + "<br/>"  + d["Hundred Block Location"])  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
            })                  
        .on("mouseout", function(d) {       
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
        });  
		} else if (filteredSection != null && filteredMonth == null) {
			 feature = g.selectAll("circle")
				.data(collection)
				.enter()
				.append("circle")
				.filter(function(d) { 
					return d["Event Clearance Group"] == filteredSection  
				})
				.style("stroke", "black")  
				.style("opacity", 0.9) 
				.style("fill", function(d) {
					if (d["Event Clearance Group"] == "AUTO THEFTS") {
						return "orange"
					} else if (d["Event Clearance Group"] == "BIKE") {
						return "red"
					} else if (d["Event Clearance Group"] == "OTHER PROPERTY") {
						return "blue"
					}
				})
				.attr("r", 3)             
                .on("mouseover", function(d) {      
            div.transition()        
                .duration(200)      
                .style("opacity", .9);      
            div .html(d["Event Clearance Date"] + "<br/>"  + d["Hundred Block Location"])  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
            })                  
        .on("mouseout", function(d) {       
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
        });  
		} else if (currentTerm == null && filteredMonth != null) {
            
			 feature = g.selectAll("circle")
				.data(collection)
				.enter()
				.append("circle")
				.filter(function(d) { 
					return formatDate(format.parse(d["Event Clearance Date"])) == filteredMonth 
				})
				.style("stroke", "black")  
				.style("opacity", 0.9) 
				.style("fill", function(d) {
					if (d["Event Clearance Group"] == "AUTO THEFTS") {
						return "orange";
					} else if (d["Event Clearance Group"] == "BIKE") {
						return "red";
					} else if (d["Event Clearance Group"] == "OTHER PROPERTY") {
						return "blue";
					}
				})
				.attr("r", 3)
                          .on("mouseover", function(d) {      
            div.transition()        
                .duration(200)      
                .style("opacity", .9);      
            div .html(d["Event Clearance Date"] + "<br/>"  + d["Hundred Block Location"])  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
            })                  
        .on("mouseout", function(d) {       
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
        });
		} else {
			 feature = g.selectAll("circle")
				.data(collection)
				.enter()
				.append("circle")
				.filter(function(d) { 
					return d["Event Clearance Group"] == currentTerm 
				})
				.filter(function(d) { 
					return formatDate(format.parse(d["Event Clearance Date"])) == filteredMonth 
				})
				.style("stroke", "black")  
				.style("opacity", 0.9) 
                .style("fill", function(d) {
					if (d["Event Clearance Group"] == "AUTO THEFTS") {
						return "orange";
					} else if (d["Event Clearance Group"] == "BIKE") {
						return "red";
					} else if (d["Event Clearance Group"] == "OTHER PROPERTY") {
                        return "blue";
					}
				})
				.attr("r", 3)
             .on("mouseover", function(d) {      
            div.transition()        
                .duration(200)      
                .style("opacity", .9);      
            div .html(d["Event Clearance Date"] + "<br/>"  + d["Hundred Block Location"])  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
            })                  
        .on("mouseout", function(d) {       
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
        }); 
		}

		//Resets the view whenever the user interacts with the map through zooming or panning
		map.on("viewreset", update);
		update();


		
}

function update() {
            console.log(feature);
			feature.attr("transform", function(d) { 
				return "translate("+ 
					map.latLngToLayerPoint(d.LatLng).x +","+ 
					map.latLngToLayerPoint(d.LatLng).y +")";
				}
			)

			if (currentMonth == null) {
				$('#month').html("All of");
			} else {
				$('#month').html(currentMonth + "/");
			}
            $('#numberOfRecord').html(feature[0].length);
		}

filterByCategoryMonth(currentMonth, currentTerm);

//function filtering(){
//  feature[0].forEach(function(d){
//      //console.log(d);
//      if(d.__data__["Event Clearance Group"]=="OTHER PROPERTY"){
//
//
//      }else{
//          d3.select(d).style("opacity", 0)
//      }
//  })  
//};

$('#auto').click(function() {
    currentTerm = "AUTO THEFTS";
    //filtering();
	filterByCategoryMonth(currentMonth, currentTerm);
});

$("#bike").click(function() {
    currentTerm = "BIKE";
        //filtering();

		filterByCategoryMonth(currentMonth, currentTerm);

});

$('#other').click(function() {
       // filtering();

    currentTerm = "OTHER PROPERTY";
		filterByCategoryMonth(currentMonth, currentTerm);

});

$('#all').click(function() {
    currentTerm = null;
		filterByCategoryMonth(currentMonth, currentTerm);

});

$("#monthSilder").slider().on('change',function(){
    currentMonth = $("#monthSilder").slider('getValue');
	if (currentMonth == 13) {
		currentMonth = null;
	}
	filterByCategoryMonth(currentMonth, currentTerm);

});

$("#monthSilder").slider({
    ticks: [01,02,03,04,05,06,07,08,09,10,11,12, 13],
    ticks_labels: ["Jan", "Feb", "Mar", "Apr", "May" , "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "All"],
    ticks_snap_bounds: 1
});

$("#monthSilder").slider("setValue", 13);
