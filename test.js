function init() {

	var cat='pha';
	var pha_overnight=false;
	var pha_gesy=false;
	var rmarkers=[];
	var zoom_level=10;
	var pos_global= {lat:35.080232, lng:33.362082};

	//set up the map
	 var mapDiv = document.getElementById('map');
	 var myOptions = {
		zoom:zoom_level,
	  	center:{lat:35.080232, lng:33.362082},
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

	//Get Location
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {lat: position.coords.latitude, lng: position.coords.longitude};
			pos_global=pos;
			new google.maps.Marker({position:pos,map:map,animation:google.maps.Animation.BOUNCE});//location marker
			map.panTo(pos);//recenter
			map.setZoom(zoom_level=14);//increase zoom
		});
	} else {
		pos_global= {lat:35.080232, lng:33.362082};
		new google.maps.Marker({position:pos_global,map:map,animation:google.maps.Animation.BOUNCE});
}
  
	//Get current date
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	today = dd + '/' + mm + '/' + yyyy;
	
	//Get the data from Excel for overnight pha
	async function getData(){
		const pha_over = await fetch('pha_overnight.csv');
	  	const data_over = await pha_over.text();
	  	const rows = data_over.split('\n').slice(1);
		const id=[],lat=[],lng=[],iconImage=[], content=[];		  
	  	
		rows.forEach(row => {
			const cols = row.split('~');			  
			if (cols[0]==today && cat=="pha") {
				id.push(cols[1]);
				lat.push(parseFloat(cols[2]));
				lng.push(parseFloat(cols[3]));
				content.push(String(cols[4]));
				iconImage.push("https://lh3.googleusercontent.com/fife/ABSRlIoUEJ4cBd7A8nr08mmOQGHMaglshJm8jf8Lxo8jQDLCxAIk9-DOzoxycu_SZiM6qsaPa07fdGDQsQXVWYpe6YZOi_qH3v4wwKPiQhmvQH2Ia7o9gz7KIeO_LxL5V3-yKMm0vt9qlDFyO-iNNC05amze6H2FlwCLv1zUr2ARjgB8xDltzA3NitjuA2gIuezgFMiM1ygyoqv9na2J9cDv5GaB7anNRp_F9wdrD7AGqMwaeGobf98ABHsEN745t56HUChR2T5QUHmkgcLJvBwTmY_WK54TwTt8c80dWl_FSj8U7hE2KNmNKXL_UdJJoFRM7-7vfDbNC8_g2ofBqLmFcTitwoQ0cMM-AKgLP5BH3w7naMU_5Is63VW6kJk28TgRSweBiMCqJkMeYi4335IvfQN7NWKfG8b3ZDYfGb820b-NtqQ-OKAoBT_VDuOo2ftLdgdpeaIkpfM4g_owIxTckFfn2FzwNpHeGUwO_Xq0JDN_de5eTrwRhKFrd3gOhsmhvCgUrNXFOR8NqyJxiB-9f1FuL_ADmkD-CaSFazkb39Uhc0qMpGO8n9KiLk8S5ar68iQIS2QcYjGe4C4SvIE6-scmUrvHEHtL4BzTp-ReFHa5EU-SNSsh_OjUa6k9x103nioH8qRKfaDXIeps1VtN3nJ9bym0kpF_wK-dZJFcn87AeqAIgVa06b2c5VbJoLo16u0H9LM84CK0PtJekJ5bMyRBAP1S02qGDUQ=w1920-h938-ft")
			};
	  	});

		if (pha_overnight==false) {
			const pha_list = await fetch('pha_list.csv');
	  		const data_list = await pha_list.text();
	  		const rows = data_list.split('\n').slice(1);
		  	rows.forEach(row => {
				const cols = row.split('~');			  
				if (id.includes(cols[0])==false && cols[1]==cat){
					id.push(cols[0]);
					lat.push(parseFloat(cols[2]));
					lng.push(parseFloat(cols[3]));
					iconImage.push(String(cols[4]))
					content.push(String(cols[5]));
					//iconImage.push("https://lh3.googleusercontent.com/fife/ABSRlIo6VGNVPRKeBPys4j8q9nmpCC74N09tts2EEDHeIVfgIyRJGMKdJlDgpVGj3k3aaooxkK5_iChWy108VDBEHaURGcy8A6GO74QP8DrHMRcYUeaG41psVzTZT8v4P68Vwx48zSmd9WLQh8hEaIC4BSAipezE5vqUrx3OnsJH0Zl4tUBgAwj6p9yXN0FbmiGJqFodtqzw8IpYunTRBqLwQQrXe_FYwrcMpqk-4EwqHLe7Ny9O1P3bBJjxl9YcLtTsYhD5FcbHcRgsPOnC5X8pMLHlXu_QAW4fPAVR0tHXy3RC9OX5tbdvTRYuVG7NaqdPeCglt244ShSKQPMjj0ITWHpJWgooZlsLbUQh7HlQLkWzP8i4UjEuFZ_dZ_RyOweYCqKjs_ryctEL-xd9RZf5hr32izQQsd0_iD_P1OpBfXgEETpjg1y57_RZ8j9holVuQyD53XrzzXHePdqARg2G69R6rtXNBPEPUyEU7GBTzNeesK6RerHVZksc5ovyxnSSK-_2aDxrwbzOLWXseXPl1Wo3kDdC-AYm3tXr_40vm23zsoYav7_pQLnw1yh-iQslutvGG39kTx8B8lbiz2UOmt4RAaOcx68c8DDDxIIqN2DA4vOX-5pWXupuQ4tON0ltHsnrlBTN2u_ZWokf0OwYXYfVgm0fdbHWw_OqnPrI5FYS98k9dHP7VHi9mab_cMpN4imhGRdlCcb-ML0F-RUAr4vvcP90P7mac8Y=w1920-h938-ft")
				} 	  
			});
		};
		//pha_gesy    
	  	return {id, lat, lng, iconImage, content};
	}
	
	//Marker data
    window.addEventListener('load', setup);
    var markers=[];
    async function setup() {
      const data = await getData();
      for (var i=0;i<data.id.length;i++){
        markers[i]={
        coords:{lat:data.lat[i],lng:data.lng[i]},
        iconImage:data.iconImage[i],
        content:'<h1>Choose map:<br><a '+data.content[i]+'</a></h1>'};  
        addMarker(markers[i]); 
      }
    }

	//Add Marker Function
	function addMarker(props){
	  	var marker = new google.maps.Marker({position:props.coords, map:map,});//create markers  
	  	marker.setIcon(props.iconImage);//marker custom icon
		if(props.content){//Add marker content
			var infoWindow = new google.maps.InfoWindow({content:props.content});
			marker.addListener('click', function(){new google.maps.InfoWindow({content:props.content}).open(map, marker);});//Marker popup
	  	}
		  rmarkers.push(marker);
		  //mapMarkers[i] = marker;
	}
		
	// Deletes all markers in the array by removing references to them.
	function deleteMarkers() {
		for (var i = 0; i < rmarkers.length; i++) {rmarkers[i].setMap(null);}
			rmarkers = [];
	}	
	

	//Additional Buttons//

	//Re-locate Button
	const locationButton = document.createElement("button");
	locationButton.textContent = "Find Me";
	locationButton.classList.add("location_button");
	//locationButton.classList.add("gradient-border");
	map.controls[google.maps.ControlPosition.RIGHT_TOP].push(locationButton);
	locationButton.addEventListener("click", () => {
			map.panTo(pos_global);//recenter
			map.setZoom(zoom_level);//increase zoom
	});

	google.maps.event.addListener(map, "center_changed", function() {
		var center = this.getCenter();
		var latitude = center.lat();
		var longitude = center.lng();
		if (latitude>35.8251643850095 || latitude<34.19204129855151 || longitude<31.871409222240132 || longitude>34.777689305367682){
			map.panTo(pos_global);//recenter
		}
	});

	google.maps.event.addListener(map, 'zoom_changed', function() {
		if (this.getZoom()<10){this.setZoom(10)};//increase zoom}
	});

	//Custom drop down
	var divOptions = {
		gmap: map,
		name: 'Pharmacies',
		title: "Pharmacies",
		id: "pha",
		action: function(){
			cat=divOptions.id;
			deleteMarkers();
			setup();
		}
	}	
	var optionDiv1 = new optionDiv(divOptions);
		  
	var divOptions2 = {
		gmap: map,
		name: 'Rapid Test',
		title: "Rapid Test",
		id: "rtest",
		action: function(){
			cat=divOptions2.id;
			deleteMarkers();
			setup();
		}
	}
	var optionDiv2 = new optionDiv(divOptions2);

	//create the check box items
	var checkOptions = {
		gmap: map,
		title: "Only Overnight",
		id: "only_overnight",
		label: "Only Overnight",				
		//action: function(){alert('you clicked check 1');}        		        		
		action: function(){
			if (pha_overnight==true) {pha_overnight=false} else {pha_overnight=true};
			deleteMarkers();
			setup();}	        		
	}
	var check1 = new checkBox(checkOptions);

	var checkOptions2 = {
		gmap: map,
		title: "Only GESY",
		id: "only_gesy",
		label: "Only GESY",
		action: function(){alert('you clicked check 2');}        		        		
	}
	var check2 = new checkBox(checkOptions2);

	//create the input box items
		  
	//possibly add a separator between controls        
	var sep = new separator();
		  
	//put them all together to create the drop down       
	var ddDivOptions = {
		items: [optionDiv1, optionDiv2, sep, check1, check2],
		id: "myddOptsDiv"        		
	}
	//alert(ddDivOptions.items[1]);
	var dropDownDiv = new dropDownOptionsDiv(ddDivOptions);               
				  
	var dropDownOptions = {
		gmap: map,
		name: 'Categories',
		id: 'ddControl',
		title: 'Categories',
		position: google.maps.ControlPosition.TOP_CENTER,
		dropDown: dropDownDiv 
	}
		  
		  var dropDown1 = new dropDownControl(dropDownOptions);        
		  	  
		}
  
		google.maps.event.addDomListener(window, 'load', initialize);

	/************
	 Classes to set up the drop-down control
	 ************/
          
    function optionDiv(options){
   	  var control = document.createElement('DIV');
   	  control.className = "dropDownItemDiv";
   	  control.title = options.title;
   	  control.id = options.id;
   	  control.innerHTML = options.name;
   	  google.maps.event.addDomListener(control,'click',options.action);
   	  return control;
     }
     
     function checkBox(options){
     	//first make the outer container
     	var container = document.createElement('DIV');
   	  	container.className = "checkboxContainer";
   	  	container.title = options.title;
   	  	
     	var span = document.createElement('SPAN');
     	span.role = "checkbox";
     	span.className = "checkboxSpan";
     	        	        	
     	var bDiv = document.createElement('DIV');
   	  	bDiv.className = "blankDiv";      	  	
   	  	bDiv.id = options.id;
   	  	
   	  	var image = document.createElement('IMG');
   	  	image.className = "blankImg";
   	  	image.src = "http://maps.gstatic.com/mapfiles/mv/imgs8.png";
   	  	
   	  	var label = document.createElement('LABEL');
   	  	label.className = "checkboxLabel";
   	  	label.innerHTML = options.label;
   	  	
   	  	bDiv.appendChild(image);
   	  	span.appendChild(bDiv);
   	  	container.appendChild(span);
   	  	container.appendChild(label);
   	  	
   	  	google.maps.event.addDomListener(container,'click',function(){
   	  		(document.getElementById(bDiv.id).style.display == 'block') ? document.getElementById(bDiv.id).style.display = 'none' : document.getElementById(bDiv.id).style.display = 'block';
   	  		options.action(); 
   	  	})
   	  	return container;
     }
     function separator(){
     		var sep = document.createElement('DIV');
     		sep.className = "separatorDiv";
     		return sep;      		
     }
     
     function dropDownOptionsDiv(options){
    	//alert(options.items[1]);
      	var container = document.createElement('DIV');
      	container.className = "dropDownOptionsDiv";
      	container.id = options.id;
      	
      	
      	for(i=0; i<options.items.length; i++){
      		//alert(options.items[i]);
      		container.appendChild(options.items[i]);
      	}
      	
      	//for(item in options.items){
      		//container.appendChild(item);
      		//alert(item);
      	//}        
 		return container;        	
      }
     
     function dropDownControl(options){
    	  var container = document.createElement('DIV');
    	  container.className = 'container';
    	  
    	  var control = document.createElement('DIV');
    	  control.className = 'dropDownControl gradient-border';
    	  control.innerHTML = options.name;
    	  control.id = options.name;
    	  var arrow = document.createElement('IMG');
    	  arrow.src = "http://maps.gstatic.com/mapfiles/arrow-down.png";
    	  arrow.className = 'dropDownArrow';
    	  control.appendChild(arrow);	      		
    	  container.appendChild(control);    
    	  container.appendChild(options.dropDown);
    	  
    	  options.gmap.controls[options.position].push(container);
    	  google.maps.event.addDomListener(container,'click',function(){
    		(document.getElementById('myddOptsDiv').style.display == 'block') ? document.getElementById('myddOptsDiv').style.display = 'none' : document.getElementById('myddOptsDiv').style.display = 'block';
    		/*setTimeout( function(){
    			document.getElementById('myddOptsDiv').style.display = 'none';
    		}, 10000);*/
    	  })      	  
      }
     
     function buttonControl(options) {
         var control = document.createElement('DIV');
         control.innerHTML = options.name;
         control.className = 'button';
         control.index = 1;

         // Add the control to the map
         options.gmap.controls[options.position].push(control);

         // When the button is clicked pan to sydney
         google.maps.event.addDomListener(control, 'click', options.action);
         return control;
		 
     }
