(function () {

    const DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
    const DARKSKY_API_KEY = '7e9faa5870c437ef4a3b480e94a2245d';
    const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

    const GOOGLE_MAPS_API_KEY = 'AIzaSyCtG8PgzAlIL0AbJvHpilPQV0QiWTaYKdU';
    const GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

    document.getElementById('icon').style.visibility = "hidden";

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
    var cityPrecipitation = app.querySelector('.city-precipitation');
    var weeklyForecast = app.querySelector('.weekly-forecast');

    // array for storing daily weather
    var days = ['Sun - ', 'Mon - ', 'Tue - ', 'Wed - ', 'Thu - ', 'Fri - ', 'Sat - '];

    // autocomplete search bar 
    var input = document.getElementById('autocomplete');
    var autocomplete = new google.maps.places.Autocomplete(input, { types: ['(cities)'] });

    $("#load").hide();

    cityForm.addEventListener('submit', function (event) {
        document.getElementById('icon').style.visibility = "hidden";
        // prevent the form from submitting
        event.preventDefault(); 

        // hiding temp, humidity, precipitation while searching
        cityWeather.innerText = '';
        cityHumidity.innerText = '';
        cityPrecipitation.innerText = '';

        var city = cityInput.value;

        getCoordinatesForCity(city)
            .then(getCurrentWeather)
            .then(function (weather) {
                $("#load").hide();
                // display temp, humidity, precipitation in the center of screen 
                cityWeather.innerText = 'Current temperature: ' + weather.currently.temperature + ' °F';
                cityHumidity.innerText = 'Current humidity: ' + weather.currently.humidity;
                cityPrecipitation.innerText = 'Chance of rain: ' + weather.currently.precipProbability;

                // if statements to display icons depending on "icon" field from currently data
                var icons = new Skycons({ "color": "#f1bb4e" });
                if (weather.currently.icon == "clear-day") {
                    icons.set('icon1', Skycons.CLEAR_DAY);
                }
                if (weather.currently.icon == "clear-night") {
                    icons.set('icon1', Skycons.CLEAR_NIGHT);
                }
                if (weather.currently.icon == "partly-cloudy-day") {
                    icons.set("icon1", Skycons.PARTLY_CLOUDY_DAY);
                }
                if (weather.currently.icon == "partly-cloudy-night") {
                    icons.set("icon1", Skycons.PARTLY_CLOUDY_NIGHT);
                }
                if (weather.currently.icon == "cloudy") {
                    icons.set("icon1", Skycons.CLOUDY);
                }
                if (weather.currently.icon == "rain") {
                    icons.set("icon1", Skycons.RAIN);
                }
                if (weather.currently.icon == "sleet") {
                    icons.set("icon1", Skycons.SLEET);
                }
                if (weather.currently.icon == "snow") {
                    icons.set("icon1", Skycons.SNOW);
                }
                if (weather.currently.icon == "wind") {
                    icons.set("icon1", Skycons.WIND);
                }
                if (weather.currently.icon == "fog") {
                    icons.set("icon1", Skycons.FOG);
                }

                icons.play();
                // hide previous icon when searching for new icon 
                document.getElementById('icon').style.visibility = "visible";
                // weekly forecast for loop 
                for (var i = 1; i < 7; i++) {
                    var d = new Date();
                    var n = d.getDay();
     
                    var high = weather.daily.data[i].temperatureHigh;
                    var low = weather.daily.data[i].temperatureLow;
                    cityHumidity.innerHTML += "<div class='weekly-forecast'>" + days[n + i % 6] + '    High: ' + high + ' °F / Low: ' + low + ' °F' + '</div>';
                }
            })
    });
})();