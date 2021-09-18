function init() {

	var cat='';
	var rmarkers=[];
	var zoom_level=10;
	var pos_global= {lat:35.080232, lng:33.362082};
	
	//set up the map
	 var mapDiv = document.getElementById('map');
	 var myOptions = {
		zoom:zoom_level,
	  	center:pos_global,
	  	mapTypeControlOptions: {mapTypeIds: []},
	  	disableDefaultUI: true,
	  	scaleControl: true,
	  	zoomControl: true,
	  	zoomControlOptions: {style: google.maps.ZoomControlStyle.HORIZONTAL_BAR, position: google.maps.ControlPosition.TOP_RIGHT, style: google.maps.ZoomControlStyle.LARGE},
	  	mapTypeId: google.maps.MapTypeId.ROADMAP,
		  styles: [
		  {featureType: "all",elementType: "geometry",stylers: [{saturation: -100}]},
		  {"elementType": "labels",stylers: [{saturation: -100}]},
		  {featureType: "road.arterial",elementType: "geometry",stylers:[{ color: "#ADD8E6"/*"#FFFEC9"*/}]},
		  {featureType: "road.highway",elementType: "geometry",stylers:[{ color: "#68C7E6"/*"#f2f088"*/}]},		  
		  {featureType: "water",elementType: "geometry",stylers: [{ color: "#dce5f2" }]}
	  ]
	};

	var map = new google.maps.Map(mapDiv, myOptions);

	/**Get Location**/
	(function location() {
			navigator.geolocation.getCurrentPosition(function(position) {
				pos_global = {lat: position.coords.latitude, lng: position.coords.longitude};
				new google.maps.Marker({position:pos_global,map:map,animation:google.maps.Animation.BOUNCE});//location marker
				map.panTo(pos_global);//recenter
				map.setZoom(zoom_level=14);//increase zoom
			});
	})()

	/**Map Limits**/
	google.maps.event.addListener(map, "center_changed", function() {
		if (this.getCenter().lat()>35.8251643850095 || this.getCenter().lat()<34.19204129855151 
		|| this.getCenter().lng()<31.871409222240132 || this.getCenter().lng()>34.777689305367682){
			map.panTo(pos_global);
		}
	});

	google.maps.event.addListener(map, 'zoom_changed', function() {
		if (this.getZoom()<10){this.setZoom(10)};//increase zoom}		
	});

	/**Additional Buttons**/
	//Re-locate Button
	const locationButton = document.createElement("button");
	locationButton.textContent = "Find Me";
	locationButton.classList.add("location_button");
	//locationButton.classList.add("gradient-border");
	map.controls[google.maps.ControlPosition.RIGHT_TOP].push(locationButton);
	locationButton.addEventListener("click", () => {
		if (pos_global=={lat:35.080232, lng:33.362082}){
			location();
		}else{
			map.panTo(pos_global);//recenter
			map.setZoom(zoom_level);//increase zoom
		}
	});


}
  
		google.maps.event.addDomListener(window, 'load', initialize);
