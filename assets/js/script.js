function showCityWeather(city, save) {
    // Fade out old info first while we get it
    $('#mainContent').fadeOut(200);

    // First get the basic info from openweathermap
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather",
        method: "GET",
        data: {
            q: city,
            appid: "03371f914e3ad0de37ba33cc7c2ef586",
            units: "metric"
        }
    }).done(function(response) {
        console.log("Found city info")
        console.log(response);

        // Don't save on the first page load
        if (save === true) {
            // Save city in history
            storeSearch(city)

            // Update list display
            showPreviousSearches()
        }

        // Show city info.
        $("#cityName").text(response.name + ", " + response.sys.country)
        $("#weatherText").html(`The current temperature is ${response.main.temp}&deg; C, but it feels like ${response.main.feels_like}&deg; C.`)

        // Got basic city forecast info, now get the 5 day forecast from dark sky.
        $.ajax({
            url: "https://api.darksky.net/forecast/b05444da8cca41be05ba60aa30699c1a/" + response.coord.lat + "," + response.coord.lon,
            method: "GET",
            dataType: "jsonp",
            data: {
                units: "si"
            }
        }).done(function(response2) {
            console.log("Got dark sky forecast")
            console.log(response2)
            
            // Build 5 day forecast cards
            var forecasts = []
            forecasts.push('<h4>5 Day Forecast</h4>')
            for (var i = 1; i <= 5; i++) {
                var dayData = response2.daily.data[i]
                var date = moment.unix(dayData.time)
                forecasts.push(`
                <div class="card text-dark bg-light mb-3 float-left" style="max-width: 9rem;">
                    <div class="card-header">${date.format("ddd M/D")}</div>
                    <div class="card-body">
                        <img class="img-fluid rounded" src="assets/images/${dayData.icon}.png" />
                        <p class="card-text"><strong>H:</strong> ${dayData.temperatureHigh}&deg; C<br />
                        <strong>L:</strong> ${dayData.temperatureLow}&deg; C</p>
                    </div>
                </div>`)
            }
            $("#fiveday").html(forecasts.join(""))

            // Now, try to look up a photo for the background.
            $.ajax({
                url: "https://api.unsplash.com/search/photos",
                method: "GET",
                data: {
                    query: response.name,
                    client_id: "e3f2c6e8a148cc093339412d982b351c5490a63b0d132f8be347a2b1f75c5f88"
                }
            }).done(function(bgresponse){
                console.log("Got background results")
                console.log(bgresponse)
                if (bgresponse.results.length > 0) {
                    $('#citybg').css('background-image', 'url("' + bgresponse.results[0].urls.full + '")');
                } else {
                    $('#citybg').css('background-image', 'none');
                }
                $('#mainContent').fadeIn(200);
            }).fail(function(fail){
                $('#citybg').css('background-image', 'none');
                $('#mainContent').fadeIn(200);
            })
        }).fail(function(fail) {
            // Failed to get 5 day forecast. Show the rest.
            $("#fiveday").empty()
            $('#citybg').css('background-image', 'none');
            $("#fiveday").text("Five day forecast failed to load.")
            $('#mainContent').fadeIn(200);
        })
    }).fail(function(response) {
        // Usually means the city doesn't exist
        $("#cityName").text("Sorry")
        $('#citybg').css('background-image', 'none');
        $("#fiveday").empty()
        $("#weatherText").text(`The city "${city}" could not be found.`)
        $('#mainContent').fadeIn(200);
    })
}

function getSearches() {
    // Get stored searches from local storage
    var searches = window.localStorage.getItem("searches")

    // If it's the first time here, this will be null. If it is, return an empty array
    if (searches === null) {
        return []
    } else {
        return JSON.parse(searches)
    }
}

function storeSearch(city) {
    // First, get current history
    var cities = getSearches()

    // Add the current city to front
    cities.unshift(city)

    // Only store last 5, remove last
    if (cities.length > 5) {
        cities.pop()
    }

    // Save it.
    window.localStorage.setItem("searches", JSON.stringify(cities))

    // Also save the most recent looked up city
    window.localStorage.setItem("mostRecent", city)
}

function showPreviousSearches() {
    var searches = getSearches()
    var list = $("#previousSearches")

    // clear current list
    list.empty()

    searches.forEach(function (search) {
        var item = document.createElement("a")
        item.classList.add("list-group-item", "list-group-item-action")
        item.href = "javascript:void(0)"
        item.onclick = function() {
            showCityWeather(search, true)
        }
        item.innerText = search
        list.append(item)
    })

}

$("#citysearch").on("submit", function(e){
    // Don't actually send a form anywhere
    e.preventDefault();

    console.log("on submit works");
    
    var input = $("#city").val()
    showCityWeather(input, true)
})

// Load list of old searches first
showPreviousSearches()

// If we've been here before, show last successful search.
var recent = window.localStorage.getItem("mostRecent")
if (recent !== null) {
    showCityWeather(recent, false)
}