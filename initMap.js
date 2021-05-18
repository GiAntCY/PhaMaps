function initMap(){//Initiate Map

  //Map settings
 var options = {
    zoom:10,
    center:{lat:35.080232, lng:33.362082},
    mapTypeControlOptions: {mapTypeIds: []},
    disableDefaultUI: true,
    scaleControl: true,
    zoomControl: true,
    zoomControlOptions: {style: google.maps.ZoomControlStyle.LARGE},
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [
              {"stylers": [{"saturation": -100}]},
              //{"featureType": "road.arterial","elementType": "geometry","stylers":[{ "color": "#ADD8E6"}]},
              //{"featureType": "road:highway","elementType": "geometry","stylers":[{ "color": "#ADD8E6"}]},
              {"featureType": "landscape","elementType": "labels","stylers": [{"visibility": "off" }]}
            ]
  };

  //Create map
  var map = new google.maps.Map(document.getElementById('map'), options);

  //Get Location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {lat: position.coords.latitude, lng: position.coords.longitude};   
      new google.maps.Marker({position:pos,map:map});//location marker
      map.panTo(pos);//recenter
      map.setZoom(14);//increase zoom
    });
  }

  //Get the data from Excel
  async function getData() {
    const response = await fetch('markers_list.csv');
    const data = await response.text();
    const id=[],lat=[],lng=[],iconImage=[], content=[];
    const rows = data.split('\n').slice(1);
    rows.forEach(row => {
      const cols = row.split('~');
      id.push(cols[0]);
      lat.push(parseFloat(cols[1]));
      lng.push(parseFloat(cols[2]));
      iconImage.push(String(cols[3]));
      content.push(String(cols[4]));
    });
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
  }

}
