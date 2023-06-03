function initialize() {
  var mapOptions,
    map,
    marker,
    searchBox,
    city,
    infoWindow = "",
    addressEl = document.querySelector("#map-search"), 
    latEl = document.querySelector(".latitude"),
    longEl = document.querySelector(".longitude"),
    element = document.getElementById("map-canvas");
  city = document.querySelector(".reg-input-city");

  mapOptions = {
    zoom: 15,
    center: new google.maps.LatLng(13.719839, 100.601465),
    disableDefaultUI: false,
    scrollWheel: true,
    draggable: true,
  };

  map = new google.maps.Map(element, mapOptions);

  marker = new google.maps.Marker({
    position: mapOptions.center,
    map: map,
    draggable: true,
  });

  searchBox = new google.maps.places.SearchBox(addressEl);

  google.maps.event.addListener(searchBox, "places_changed", function () {
    var places = searchBox.getPlaces(),
      bounds = new google.maps.LatLngBounds(),
      i,
      place,
      lat,
      long,
      resultArray,
      addresss = places[0].formatted_address;

    for (i = 0; (place = places[i]); i++) {
      bounds.extend(place.geometry.location);
      marker.setPosition(place.geometry.location);
    }

    map.fitBounds(bounds);
    map.setZoom(15);

    lat = marker.getPosition().lat();
    long = marker.getPosition().lng();
    longEl.innerHTML = long;

    resultArray = places[0].address_components;

    for (var i = 0; i < resultArray.length; i++) {
      if (
        resultArray[i].types[0] &&
        "administrative_area_level_2" === resultArray[i].types[0]
      ) {
        citi = resultArray[i].long_name;
        city.value = citi;
      }
    }

    if (infoWindow) {
      infoWindow.close();
    }

    infoWindow = new google.maps.InfoWindow({
      content: addresss,
    });

    infoWindow.open(map, marker);

    calculateDistance(lat, long);
  });

  google.maps.event.addListener(marker, "dragend", function (event) {
    var lat, long, address, resultArray, citi;

    lat = marker.getPosition().lat();
    long = marker.getPosition().lng();

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      {
        latLng: marker.getPosition(),
      },
      function (result, status) {
        if ("OK" === status) {
          address = result[0].formatted_address;
          resultArray = result[0].address_components;

          for (var i = 0; i < resultArray.length; i++) {
            if (
              resultArray[i].types[0] &&
              "administrative_area_level_2" === resultArray[i].types[0]
            ) {
              citi = resultArray[i].long_name;
              city.value = citi;
            }
          }
          addressEl.value = address;
          latEl.value = lat;
          longEl.value = long;
        } else {
          console.log(
            "Geocode was not successful for the following reason: " + status
          );
        }

        if (infoWindow) {
          infoWindow.close();
        }

        infoWindow = new google.maps.InfoWindow({
          content: address,
        });

        infoWindow.open(map, marker);

        calculateDistance(lat, long);
      }
    );
  });

  function calculateDistance(lat, long) {
    var directionsService = new google.maps.DirectionsService();
    var origin = new google.maps.LatLng(lat, long);
    var destination = new google.maps.LatLng(13.719839, 100.601465);
    var request = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, function (result, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        var distanceInMeters = result.routes[0].legs[0].distance.value;
        var distanceInKilometers = distanceInMeters / 1000;
        var formattedDistance = distanceInKilometers.toFixed(2); // Round to 2 decimal places

        if (formattedDistance < 10) {
          document.querySelector(
            ".distance"
          ).innerHTML = `Status: <i class="fa fa-check" aria-hidden="true" style="color: green"></i>
		  <span style="color: green">Supporting the current location! (${formattedDistance} km)</span> `;
		  document.getElementById("liveAlertPlaceholder").style.display = 'none';
		  document.getElementById("liveAlertBtn").type = "submit";
			
        } else {
          document.querySelector(
            ".distance"
          ).innerHTML = `Status: <i class="fa fa-times" aria-hidden="true" style="color: red"></i>
		  <span style="color: red">Not supported in this location. (${formattedDistance} km)</span>`;
		  document.getElementById("liveAlertPlaceholder").style.display = 'block';
		  document.getElementById("liveAlertBtn").type = "button";

        }
      } else {
        console.log("Error calculating distance: " + status);
      }
    });
  }
}
const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
const appendAlert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}

const alertTrigger = document.getElementById('liveAlertBtn')
if (alertTrigger) {
  alertTrigger.addEventListener('click', () => {
    appendAlert('Not supported in this location.', 'danger')
  })
}