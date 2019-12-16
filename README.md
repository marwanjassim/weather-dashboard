# weather-dashboard
My weather dashboard has mostly everything the assignment needed 
# images
![Main Page](assets.images.Untiteled.png)

# Built With
Bootstrap 
Java 
HTML
Github pages

# Authors
Marwan Jassim

# License
This project is licensed under the MIT License
https://github.com/marwanjassim/password-generator.git
https://www.linkedin.com/in/marwan-jassim-b3001878/

# snipets
// Got basic city forecast info, now get the 5 day forecast from dark sky.
        $.ajax({
            url: "https://api.darksky.net/forecast/b05444da8cca41be05ba60aa30699c1a/" + response.coord.lat + "," + response.coord.lon,
            method: "GET",
            dataType: "jsonp",
            data: {
                units: "si"
            }