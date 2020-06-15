/** Creates a map and adds it to the page. Adds markers to maps with COVID 
* test sites for CT. 
*/
function createMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 41.05, 
      lng: -73.53
    }, 
    zoom: 8
  });
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  let state = "new-york";
  // gets user's current location to center map and decide what state to load
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + ",";
      url += position.coords.longitude + "&key=AIzaSyCsIDmQAVTMjvXr6NZBm1O8b9Ve9EWREwk";

      // gets state from coordiates
      fetch(url).then(response => response.json()).then(result => {
        const addressLength = result.results[7].address_components.length;
        state = result.results[7].address_components[addressLength - 2].long_name;
        state = state.toLowerCase();
        
        // call API to return testing site locations for variable state 
        fetch("https://covid-19-testing.github.io/locations/" + state + "/complete.json", requestOptions)
        .then(response => response.json())
        .then(result => {
          for (let i = 0; i < result.length; i++) {
          console.log(result[i]);
          if (!result[i].physical_address[0]) {
            continue;
          }
          let street = result[i].physical_address[0].address_1;
          street = street.replace(" ", "+");
          let city = result[i].physical_address[0].city;
          city = city.replace(" ", "+");
          const state = result[i].physical_address[0].state_province; 

          let url = "https://maps.googleapis.com/maps/api/geocode/json?address=";
          url += street + ",+";
          url += city + ",+";
          url += state + "&key=AIzaSyCsIDmQAVTMjvXr6NZBm1O8b9Ve9EWREwk";
      
          // fetch coordinates from current address
          fetch(url).then(response => response.json()).then((coords) => {
            const latitude = coords.results[0].geometry.location.lat;
            const longitude = coords.results[0].geometry.location.lng;
            const markerLocation = {lat: latitude, lng: longitude};
            const marker = new google.maps.Marker({position: markerLocation, map: map});

            // get information to make info window
            const locationName = result[i].name;
            const description = result[i].description; 
            let phoneNum = "";
            if (result[i].phones[0]) {
              phoneNum = result[i].phones[0].number; 
            } 
            
            const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            let scheduleString = "";
            if (result[i].regular_schedule) {
              for (let j = 0; j < result[i].regular_schedule.length; j++) {
                scheduleString += daysOfWeek[j] + ": " + result[i].regular_schedule[j].opens_at + " - ";
                scheduleString += result[i].regular_schedule[j].closes_at + "<br>";
              }
            }
            
            // format info window message
            const contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">' + locationName + '</h1>'+
            '<div id="bodyContent">'+
            '<p>' + description + '</p>'+
            '<p> Phone Number: ' + phoneNum + '</p>'+
            '<p> Hours </p>' +
            '<p>' + scheduleString + '</p>' +
            '</div>'+
            '</div>';
            
            // create and add info window to marker
            const infowindow = new google.maps.InfoWindow({
              content: contentString
            });
            marker.addListener('click', function() {
              infowindow.open(map, marker);
            });

          });

          }  
        })
        .catch(error => console.log('error', error));
      }); 
 
      // center map on curr position
      initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map.setCenter(initialLocation);
    });
  }

}
