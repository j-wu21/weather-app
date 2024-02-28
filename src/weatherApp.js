//Declare variables for certain document elements
const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector(".locationButton"),
arrowBack = wrapper.querySelector("header i");

let api;
let apikey = "c613c616f348560b84377a2dfdcf02c0"

//class object with privileged method
class openTheWeatherAPI {
    constructor(apikey){
        this.apikey = apikey       
    }
    requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apikey}`;
    this.getData();  
    }
}

//class prototype to allow for public method
openTheWeatherAPI.prototype.getData = function(){
     infoTxt.innerText = "Preparing weather information...";
     infoTxt.classList.add("loading");
 
    fetch(api).then(response => response.json())
        .then(result => weatherDetails(result))   
        .catch(() =>{
            infoTxt.innerText = "An error has occurred";
            infoTxt.classList.replace("pending", "error");
    });
}
//new class constructor for the weather object
const summonWeather = new openTheWeatherAPI(apikey);

inputField.addEventListener("keyup", e =>{ // event when the ENTER key is pressed while inputField is not blank
    if(e.key == "Enter" && inputField.value != ""){
        summonWeather.requestApi(inputField.value);
    }
});

$(".enterButton").click(function(){
        if(inputField.value != ""){
            summonWeather.requestApi(inputField.value);
        }   
    })
//code to retrieve geolocation and return weather based on browser location
locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){ // if browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser not support geolocation api");
    }
});

function onSuccess(position){
    const {latitude, longitude} = position.coords; // getting lat and lon of the user device from coords obj
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=c613c616f348560b84377a2dfdcf02c0`;
    fetchData();
}

function onError(error){ // error message for location error
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json())
        .then(result => weatherDetails(result))  
        .catch(() =>{
            infoTxt.innerText = "Something went wrong";
            infoTxt.classList.replace("pending", "error");
    });
}

function weatherDetails(info){
    console.log(info);
    if(info.cod == "404"){ // error message if input for city is invalid
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    }else{ //retrieve weather information properties
        
        wrapper.classList.add('animate__animated', 'animate__fadeInRight');//using animate css library to add css animation to the element
        //object literal to store the retrieved API data
        const infoStuff = {
        city: info.name,
        country: info.sys.country,
        description: info.weather[0].description,
        temp: info.main.temp,
        feels_like: info.main.feels_like,
        humidity: info.main.humidity,  
        wind: info.wind.speed,
        windDir: info.wind.deg,
        timezone: info.timezone
        }

        const id = info.weather[0].id;
        const deg = infoStuff.windDir;
        
        //select weather icon based on the API data to display on app
        if(id == 800){
            $('section.weather-part img').attr('src', 'icons/clear.svg');    
        }else if(id >= 200 && id <= 232){
            $('section.weather-part img').attr('src', 'icons/storm.svg');          
        }else if(id >= 600 && id <= 622){
            $('section.weather-part img').attr('src', 'icons/snow.svg');
        }else if(id >= 701 && id <= 781){
            $('section.weather-part img').attr('src', 'icons/haze.svg');
        }else if(id >= 801 && id <= 804){
            $('section.weather-part img').attr('src', 'icons/cloud.svg');
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            $('section.weather-part img').attr('src', 'icons/rain.svg');
        }
      
 //Determine wind direction based on API data and display information in app
        let textWinD = $(".winddirection span");  

        if(deg > 11.25 && deg <33.75){
            $(".winddirection span").text("NNE Wind");
        }else if(deg > 33.75 && deg <56.25){
            $(".winddirection span").text("NE Wind")
        }else if(deg > 56.25 && deg <78.75){
            $(".winddirection span").text("ENE Wind")
        }else if(deg > 78.75 && deg <101.25){
            $(".winddirection span").text("East Wind")
        }else if(deg > 101.25 && deg <123.75){
            $(".winddirection span").text("ESE Wind")
        }else if(deg > 123.75 && deg <146.25){
            $(".winddirection span").text("SE Wind")
        }else if(deg > 146.25 && deg <168.75){
            textWinD.text("SSE Wind")
        }else if(deg > 168.75 && deg <191.25){
            textWinD.text("South Wind")
        }else if(deg > 191.25 && deg <213.75){
            textWinD.text("SSW Wind")
        }else if(deg > 213.75 && deg <236.25){
            textWinD.text("SW Wind")
        }else if(deg > 236.25 && deg <258.75){
            textWinD.text("WSW Wind")
        }else if(deg > 258.75 && deg <281.25){
            textWinD.text("West Wind")
        }else if(deg > 281.25 && deg <303.75){
            $(".winddirection span").text("WNW Wind")
        }else if(deg > 303.75 && deg <326.25){
            $(".winddirection span").text("NW Wind")
        }else if(deg > 326.25 && deg <348.75){
            $(".winddirection span").text("NNW Wind")
        }else{
            textWinD.text("North Wind")
        }
        
      //Display information into text on the app
        $(".temp .numb").text(Math.floor(infoStuff['temp']));
        $(".weather").text(infoStuff['description']);
        $(".location span").text(`${infoStuff['city']}, ${infoStuff['country']}`);
        $(".temp .numb-2").text(Math.floor(infoStuff['feels_like']));
        $(".humidity span").text(`${infoStuff['humidity']}%`);
        $(".wind .details .speed").text(`${Math.round(infoStuff['wind'])}`);
    
        //Convert returned API time code to change the date displayed to the local time
        const dateToday = new Date();

        todayDate = new Date()
        localTime = todayDate.getTime()
        localOffset = todayDate.getTimezoneOffset() * 60000
        utc = localTime + localOffset
        var cityTime = utc + (1000 * infoStuff.timezone)
        newLocalTime = new Date(cityTime)
        shortenedTime = newLocalTime.toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
        $("#datenow").text(shortenedTime);
        
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
        
       //select a background image based on the weather description returned by API
        let weatherForecast = $(".weather").text();

        if(weatherForecast == "broken clouds"){ 
            $("body").css("background-image", "url('img/clouds.png')");
        }else if(weatherForecast == "overcast clouds"){         
           $("body").css("background-image", "url('img/overcast.png')");
        }else if(weatherForecast == "light rain" || weatherForecast == "light intensity drizzle"){        
            $("body").css("background-image", "url('img/Capture.png')");
        }else if(weatherForecast == "scattered clouds" || weatherForecast == "few clouds"){         
            $("body").css("background-image", "url('img/clearsky.png')");
        }else if(weatherForecast == "light snow" || weatherForecast == "snowstorm"){
            $("body").css("background-image", "url('img/lightsnow.png')");
        }else if(weatherForecast == "heavy snow" || weatherForecast == "snow" || weatherForecast == "Shower snow"){
            $("body").css("background-image", "url('img/whitesnow.png')");
        }else if(weatherForecast == "thunderstorm" || weatherForecast == "rain"){
            $("body").css("background-image", "url('img/storm.png')");
        }else if(weatherForecast == "mist" || weatherForecast == "haze" || weatherForecast == "fog"){
            $("body").css("background-image", "url('img/mist.png')");
        }else if(weatherForecast == "moderate rain" || weatherForecast == "heavy intensity rain"){
            $("body").css("background-image", "url('img/downpour.png')");
        }else if(weatherForecast == "very heavy rain" || weatherForecast == "extreme rain" || weatherForecast == "shower rain"){
            $("body").css("background-image", "url('img/heavyrain.png')");
        }else if(weatherForecast.indexOf("sky") >= 0 ){
            $("body").css("background-image", "url('img/noclouds.png')");
        }else if(weatherForecast.indexOf("shower rain") >= 0 ){
            $("body").css("background-image", "url('img/downpour.png')");
        }else{
            $("body").css("background-image", "url('img/forest.png')");
        }     
        //$(".wrapper").css("opacity", "0.85");
        setTimeout(function() {
           wrapper.classList.remove('animate__animated', 'animate__fadeInRight'); 
        }, 1100);
        
            //$(wrapper).fadeTo(1000, 0.85);
    
}}

 // code to call the switch units function as well as UI enhancements. JQuery allows for multiple event listeners on the same element.
  $(".temp .numb")
        .click(function(){       
        switchUnits();
        $('#changeUnit').hide();    
    })
    .mouseenter(function(){
        $(".temp .numb").css("color", "grey");
        $(".temp .numb").css("font-weight", "500");
        $(".temp .numb").css("font-size", "74px");
        if($(".temp .CorF").text()==="F"){
            $('#changeUnit').text("Change units to Metric");
        }else{
            $('#changeUnit').text("Change units to Imperial");
        }     
        $('#changeUnit').show();
    })
    .mouseout(function(){
        $(".temp .numb").css("color", "black");
        $(".temp .numb").css("font-weight", "450");
        $(".temp .numb").css("font-size", "72px");
        $('#changeUnit').hide();      
    })
//function to calculate and switch the measurement from imperial to metric and vice versa
let switchUnits = () =>{
    if($(".temp .CorF").text()==="F"){
        let celcius = (($(".temp .numb").text()-32)*.555);
        let kmph = (($(".wind .details .speed").text()*1.60934));

        $(".temp .numb").text(celcius.toFixed(0));
        $(".temp .numb-2").text(celcius.toFixed(0));
        $(".wind .details .speed").text(kmph.toFixed(0));
        $(".temp .CorF").text("C")
        $(".temp .CorF-2").text("C")
        $(".wind .details #speedunit").text("km/h")
    }else if($(".temp .CorF").text()==="C"){       
        let fahrenheit = (( $(".temp .numb").text()*1.8)+32);
        let mph = (($(".wind .details .speed").text()*0.621371));

        $(".temp .numb").text(fahrenheit.toFixed(0));
        $(".temp .numb-2").text(fahrenheit.toFixed(0));
        $(".wind .details .speed").text(mph.toFixed(0));
        $(".temp .CorF").text("F")
        $(".temp .CorF-2").text("F")
        $(".wind .details #speedunit").text("mph")
    }
}
//resets the app and units
    $("header i")
    .click(function(){
        wrapper.classList.remove("active");
        $(".temp .CorF").text("F");
        $(".temp .CorF-2").text("F");
        $(".wind .details #speedunit").text("mph");
    })
    .mouseenter(function(){        
        $("header i").css("color", "grey");
        $("header").css("color", "red");
        $("header").css("fontSize", "25px");
    })
    .mouseout(function(){       
        $("header i").css("color", "blue");
        $("header").css("color", "teal");
        $("header").animate({
            fontSize: "21px",
        },200)
    })

    console.log("loaded")
    