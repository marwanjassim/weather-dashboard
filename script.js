
$(searchBtn).on("click", function(){
    console.log("on submit works");
    
    $.ajax({
        url: "api.openweathermap.org/data/2.5/weather?q="+input+"&appid=03371f914e3ad0de37ba33cc7c2ef586",
        method: "GET"
      }).then(function(response) {
        console.log(response);