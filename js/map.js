
function initializePropertyMap(placeType, placeName) {

	var latlng = new google.maps.LatLng(51.2354, -0.334022);
    var marker;
    var i;

	var myOptions = {
		zoom: 13,
		center: latlng,
		scrollwheel: false
    };
	map = new google.maps.Map(document.getElementById('map'), myOptions);
	infowindow = new google.maps.InfoWindow();

	marker = new google.maps.Marker({
        position: latlng,
		animation: google.maps.Animation.DROP,
		map: map
	});

    //If no place type is passed, use school as the default
	if(placeType) {
		var place = placeType;
	} else {
		var place = 'school';
	}

	//Google Places
	var request = {
		location: latlng,
		radius: 3218,
		types: [place]
	};
	var service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, callback);

	function callback(results, status) {
	    if(status == google.maps.places.PlacesServiceStatus.OK) {

	        for(var i = 0; i < results.length; i ++) {

		        //Create a count for places which are present in the 'get details' Google service only, to give an accurate 'total amount' figure
	            var count = 0;

		        //Pass each place to the 'get details' Google service (so you can get address, phone etc of each place) and then create a marker
	            service.getDetails(results[i], function(place, status) {

		            //If the place is present in the 'get details' Google service, add it to the map
	                if(status == google.maps.places.PlacesServiceStatus.OK) {

	                    var marker = new google.maps.Marker({
	                        map: map,
	                        position: place.geometry.location
	                    });

	                    //On click of place marker, open the info window
	                    google.maps.event.addListener(marker, 'click', function() {

		                    //Build up tooltip content
		                    var tooltipContent = '<div class="tooltip">';
			                    tooltipContent += '<strong>' + place.name + '</strong><br />';
			                    tooltipContent += place.formatted_address.replace(/,/g, '<br />') + '<br /><br />';
			                    if(place.formatted_phone_number) {
				                    tooltipContent += 'Tel: ' + place.formatted_phone_number + '<br />';
			                    }
			                    if(place.website) {
				                   tooltipContent += '<a href="' + place.website + '" target="_blank">' + place.website.replace('http://', '').replace(/\/$/, '') + '</a>';
			                    }
		                    tooltipContent += '</div>';

	                        infowindow.setContent(tooltipContent);
	                        infowindow.open(map, this);
	                    });
						count ++;
	                }
	            });
	        }
	    }
	}

	//Change map center on window size change
	var center;

	function calculateCenter() {
		center = map.getCenter();
	}
	google.maps.event.addDomListener(map, 'idle', function() {
		calculateCenter();
	});
	google.maps.event.addDomListener(window, 'resize', function() {
		map.setCenter(center);
	});
}

google.maps.event.addDomListener(window, 'load', initializePropertyMap());
