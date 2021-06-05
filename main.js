function init() {

	var cat='pha';
	var rmarkers=[];

	//set up the map
	 var mapDiv = document.getElementById('map');
	 var myOptions = {
		zoom:10,
	  	center:{lat:35.080232, lng:33.362082},
	  	mapTypeControlOptions: {mapTypeIds: []},
	  	disableDefaultUI: true,
	  	scaleControl: true,
	  	zoomControl: true,
	  	zoomControlOptions: {style: google.maps.ZoomControlStyle.HORIZONTAL_BAR, position: google.maps.ControlPosition.TOP_RIGHT, style: google.maps.ZoomControlStyle.LARGE},
	  	mapTypeId: google.maps.MapTypeId.ROADMAP,
	  	styles: [{"stylers": [{"saturation": -100}]},
			{"featureType": "road.arterial","elementType": "geometry","stylers":[{ "color": "#ADD8E6"}]},
			//{"featureType": "road:highway","elementType": "geometry","stylers":[{ "color": "#ADD8E6"}]},
			{"featureType": "landscape","elementType": "labels","stylers": [{"visibility": "off" }]}]
	};
  
	var map = new google.maps.Map(mapDiv, myOptions);
	//Get Location
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {lat: position.coords.latitude, lng: position.coords.longitude};
			new google.maps.Marker({position:pos,map:map,animation:google.maps.Animation.BOUNCE});//location marker
			map.panTo(pos);//recenter
			map.setZoom(14);//increase zoom
	  });
	}
  
	//Get current date
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	today = dd + '/' + mm + '/' + yyyy;
	
	//Get the data from Excel
	async function getData(){
		//console.log(cat);
		const response = await fetch('places_list.csv');
	  	const data = await response.text();
	  	const id=[],date=[],lat=[],lng=[],iconImage=[], content=[];
	  	const rows = data.split('\n').slice(1);
	  	rows.forEach(row => {
			const cols = row.split('~');			  
			if (cols[1]==cat){
				id.push(cols[2]);
				lat.push(parseFloat(cols[3]));
				lng.push(parseFloat(cols[4]));
				if (cols[1]=="pha" && cols[2]==today) {iconImage.push("https://lh3.googleusercontent.com/fife/ABSRlIoUEJ4cBd7A8nr08mmOQGHMaglshJm8jf8Lxo8jQDLCxAIk9-DOzoxycu_SZiM6qsaPa07fdGDQsQXVWYpe6YZOi_qH3v4wwKPiQhmvQH2Ia7o9gz7KIeO_LxL5V3-yKMm0vt9qlDFyO-iNNC05amze6H2FlwCLv1zUr2ARjgB8xDltzA3NitjuA2gIuezgFMiM1ygyoqv9na2J9cDv5GaB7anNRp_F9wdrD7AGqMwaeGobf98ABHsEN745t56HUChR2T5QUHmkgcLJvBwTmY_WK54TwTt8c80dWl_FSj8U7hE2KNmNKXL_UdJJoFRM7-7vfDbNC8_g2ofBqLmFcTitwoQ0cMM-AKgLP5BH3w7naMU_5Is63VW6kJk28TgRSweBiMCqJkMeYi4335IvfQN7NWKfG8b3ZDYfGb820b-NtqQ-OKAoBT_VDuOo2ftLdgdpeaIkpfM4g_owIxTckFfn2FzwNpHeGUwO_Xq0JDN_de5eTrwRhKFrd3gOhsmhvCgUrNXFOR8NqyJxiB-9f1FuL_ADmkD-CaSFazkb39Uhc0qMpGO8n9KiLk8S5ar68iQIS2QcYjGe4C4SvIE6-scmUrvHEHtL4BzTp-ReFHa5EU-SNSsh_OjUa6k9x103nioH8qRKfaDXIeps1VtN3nJ9bym0kpF_wK-dZJFcn87AeqAIgVa06b2c5VbJoLo16u0H9LM84CK0PtJekJ5bMyRBAP1S02qGDUQ=w1920-h938-ft")} 
					else {iconImage.push(String(cols[5]))};
				content.push(String(cols[6]));
			}
	  	});
		  console.log(cat);
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
	
		  //start process to set up custom drop down
		  //create the options that respond to click
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
					//alert('Rapid Test');
					cat=divOptions2.id;
					deleteMarkers();
					setup();
				  }
			}
		 
		  var optionDiv2 = new optionDiv(divOptions2);
		  
		  //create the check box items
		  var checkOptions = {
				  gmap: map,
				  title: "This allows for multiple selection/toggling on/off",
				  id: "terrainCheck",
				  label: "On/Off",				
				  action: function(){
					  alert('you clicked check 1');
				  }        		        		
		  }
		  var check1 = new checkBox(checkOptions);
		  
		  var checkOptions2 = {
				  gmap: map,
				  title: "This allows for multiple selection/toggling on/off",
				  id: "myCheck",
				  label: "my On/Off",
				  action: function(){
					  alert('you clicked check 2');
				  }        		        		
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
