(function() {


    var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
    var DARKSKY_API_KEY = '7e9faa5870c437ef4a3b480e94a2245d';
    var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
  
    var GOOGLE_MAPS_API_KEY = 'AIzaSyCtG8PgzAlIL0AbJvHpilPQV0QiWTaYKdU';
    var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

    // =================================================
// Skycons
// =================================================

    // function skycons() {
    //     var i,
    //             icons = new Skycons({
    //                 "color" : "#FFFFFF",
    //                 "resizeClear": true // nasty android hack
    //             }),
    //             list  = [ // listing of all possible icons
    //                 "clear-day",
    //                 "clear-night",
    //                 "partly-cloudy-day",
    //                 "partly-cloudy-night",
    //                 "cloudy",
    //                 "rain",
    //                 "sleet",
    //                 "snow",
    //                 "wind",
    //                 "fog"
    //             ];

	// // loop thru icon list array
	// for(i = list.length; i--;) {
	// 	var weatherType = list[i], // select each icon from list array
	// 			// icons will have the name in the array above attached to the
	// 			// canvas element as a class so let's hook into them.
	// 			elements    = document.getElementsByClassName( weatherType );

	// 	// loop thru the elements now and set them up
	// 	for (e = elements.length; e--;) {
	// 		icons.set(elements[e], weatherType);
	// 	}
	// }

	// // animate the icons
	// icons.play();
  
    function getCurrentWeather(coords) {
        
        var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}`;

        //loader shown while coordinates are being found 
        $("#load").show();

        return (
        fetch(url)
        .then(response => response.json())
        .then(data => data)
        );
    }

    function getCoordinatesForCity(cityName) {
      var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;
  
      return (
        fetch(url)
        .then(response => response.json())
        .then(data => data.results[0].geometry.location)
      );
    }
  
    var app = document.querySelector('#app');
    var cityForm = app.querySelector('.city-form');
    var cityInput = cityForm.querySelector('.city-input');
    var getWeatherButton = cityForm.querySelector('.get-weather-button');
    var cityWeather = app.querySelector('.city-weather');
    var cityHumidity = app.querySelector('.city-humidity');
    var weeklyForecast = app.querySelector('.weekly-forecast');

    var input = document.getElementById('autocomplete');
    var autocomplete = new google.maps.places.Autocomplete(input,{types: ['(cities)']});
    // google.maps.event.addListener(autocomplete, 'place_changed', function(){
    //    var place = autocomplete.getPlace();
    // })

    $("#load").hide();

    cityForm.addEventListener('submit', function(event) {
        event.preventDefault(); // prevent the form from submitting
        cityWeather.innerText = '';
        var city = cityInput.value;
  
        getCoordinatesForCity(city)
        .then(getCurrentWeather)
        .then(function(weather) {
        $("#load").hide(); 
        cityWeather.innerText = 'Current temperature: ' + weather.currently.temperature + ' °F';
        cityHumidity.innerText = 'Current humidity: ' + weather.currently.humidity;

        var forecast = document.createElement("div");
        for(var i = 1; i<7; i++){
            var day = document.createElement("div");
            var high = weather.daily.data[i].temperatureHigh;

            day.innerText = high;
            forecast.append(day);
            //console.log(array);
        }
        weeklyForecast.append(forecast);
      })
    });
  })();