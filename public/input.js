// used as an way to request the entry.js / our server file to 
// run the set and get function for our db 
async function start() {
  try {
    const response = await fetch('/start', { method: 'POST' });
    const data = await response.json();
    console.log(data.location);

    var tempLoc = data.location["city"] + " " + data.location["region"];
    $('#main-location-input').val(tempLoc);

    // Handle form submission for the first page
  $('#main-location-form').submit(function (event) {
    event.preventDefault();
    var location = $('#main-location-input').val();
    getCoordinates(location, function (latitude, longitude, name) {
      $('#main-location-input').val(name);
      getWeatherData(latitude, longitude);
    });
  });

  // Navigate to weather.html with location as query parameter
  $('#main-location-form').submit(function (event) {
    event.preventDefault();
    var location = $('#main-location-input').val();
    getCoordinates(location, function (latitude, longitude, name) {
      $('#main-location-input').val(name);
      localStorage.setItem('location', name);
      localStorage.setItem('latitude', latitude);
      localStorage.setItem('longitude', longitude);
      window.location.href = 'weather.html';
    });
  });

  // Get location data from localStorage and fetch weather data on page load
  if (localStorage.getItem('location')) {
    var name = localStorage.getItem('location');
    var latitude = localStorage.getItem('latitude');
    var longitude = localStorage.getItem('longitude');
    $('#main-location-input').val(name);
    getWeatherData(latitude, longitude);
    localStorage.clear();
  } 

  } catch (err) {
    console.error('An error occurred:', err);
  }
}

// simple clock function for main page
function updateClock() {
  var now = new Date();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  if (second < 10) {
    second = "0" + second;
  }
  var clock = document.getElementById("clock");
  clock.textContent = hour + ":" + minute + ":" + second;
}

// gets weather icons for each of the forcasts
function getWeatherIcon(id, weatherCode) {

  // Clear Weather 
  if (weatherCode == 0) {

    // $(id).attr("src", "icons/clear-day.png");
    document.getElementById(id).src = "icons/clear-day.png";
  }
  //Cloud Development done  
  else if (weatherCode >= 1 && weatherCode <= 3) {

    // $(id).attr("src", "icons/cloudy.png"); 
    document.getElementById(id).src = "icons/cloudy.png";
  }
  //Visibility Reduction done  
  else if (weatherCode >= 4 && weatherCode <= 6) {

    // $(id).attr("src", "icons/overcast.png");
    document.getElementById(id).src = "icons/overcast.png";
  }
  //Fog/Ice Fog done 
  else if ([10, 11, 12, 28, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49].includes(weatherCode)) {

    // $(id).attr("src", "icons/fog.png");
    document.getElementById(id).src = "icons/fog.png";
  }
  //Thunderstorm done 
  else if ([13, 17, 29, 91, 92, 93, 94, 95, 96, 97, 98, 99].includes(weatherCode)) {


    // $(id).attr("src", "icons/thunderstorm-showers.png");
    document.getElementById(id).src = "icons/thunderstorm-showers.png";
  }
  //drizzle done
  else if (weatherCode >= 50 && weatherCode <= 59) {

    // $(id).attr("src", "icons/showers.png");
    document.getElementById(id).src = "icons/showers.png";
  }
  //rain done 
  else if (weatherCode >= 60 && weatherCode <= 69) {

    // $(id).attr("src", "icons/showers.png");
    document.getElementById(id).src = "icons/showers.png";
  }
  //Precipitation done 
  else if ([14, 15, 16, 20, 21, 22, 23, 24, 25, 26, 27, 80, 81, 82, 83, 84].includes(weatherCode)) {

    // $(id).attr("src", "icons/snow.png");
    document.getElementById(id).src = "icons/showers.png";
  }

  //Light Snow done
  else if ([36, 85].includes(weatherCode)) {

    // $(id).attr("src", "icons/snow.png");
    document.getElementById(id).src = "icons/snow.png";
  }
  //Moderate Snow done 
  else if ([37, 38, 39, 70, 71, 72, 73, 74, 75, 76, 77, 78, 86, 87, 88].includes(weatherCode)) {

    // $(id).attr("src", "icons/snow.png");
    document.getElementById(id).src = "icons/snow.png";
  }
  //Snow Pellets/Small Hail done
  else if ([27, 79, 89, 90].includes(weatherCode)) {

    // $(id).attr("src", "icons/snow.png");
    document.getElementById(id).src = "icons/snow.png";
  }

}

// converts dates to day of the week
function date_to_day(date) {
  const date2 = new Date(date);
  const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
  const dayIndex = date2.getUTCDay();
  const dayOfWeek = days[dayIndex];
  return dayOfWeek;
}

// updates the d3 chart
function updateChart(time_arr, temp_arr) {
  const parseTime = d3.timeParse("%-I %p");
  const timeData = time_arr.map(d => parseTime(d));

  const margin = { top: 60, right: 60, bottom: 60, left: 60 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const xScale = d3.scaleTime()
    .domain(d3.extent(timeData))
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([d3.min(temp_arr), d3.max(temp_arr)])
    .range([height, 0]);

  const line = d3.line()
    .x((_, i) => xScale(timeData[i]))
    .y(d => yScale(d))
    .curve(d3.curveMonotoneX);

  const svg = d3.select("#hourly-weather_graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("rect")
    .attr("width", 800)
    .attr("height", 600)
    .attr("x", -60)
    .attr("y", -45)
    .attr("fill", "rgba(0, 0, 0, 0.5)");
  const chart = svg.append("g");

  const xAxis = d3.axisBottom(xScale);

  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", 35)
    .attr("fill", "white")
    .style("text-anchor", "middle")
    .text("Time");

  const yAxis = d3.axisLeft(yScale);

  chart.append("g")
    .call(yAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -50)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("fill", "white")
    .text("Temperature");

  chart.append("path")
    .datum(temp_arr)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .attr("d", line);

  svg.append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .attr("fill", "white")
    .style("text-anchor", "middle")
    .text("Hourly Temperature");
}


// Fetch latitude and longitude coordinates for a location using OpenCage Geocoder API
function getCoordinates(location, callback) {
  var url = 'https://api.opencagedata.com/geocode/v1/json?q=' + encodeURIComponent(location) + '&key=d549f36f94cd4af2aa26cd33beaaf9f0';

  $.getJSON(url, function (data) {
    if (data.results.length > 0) {
      var latitude = data.results[0].geometry.lat;
      var longitude = data.results[0].geometry.lng;
      console.log(data);
      console.log(data.results[0].formatted);

      
      const myArray = data.results[0].formatted.split(",");
      let loc = myArray[0];

      global_loc = loc;

      $("#location").text(global_loc);
      // console.log(latitude, longitude)
      callback(latitude, longitude, global_loc);
    } else {
      alert('Unable to find coordinates for location');
    }
  });
}

// gets all the data from weather, and sets backgrounds, and fills in charts
function getWeatherData(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,apparent_temperature,precipitation,rain,showers,snowfall,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,windspeed_10m_max&current_weather=true&timezone=auto`;

  $.ajax({
    url: url,
    method: "GET",
    success: function (data) {

      console.log(data);
      weatherCode = data.current_weather["weathercode"];

      // Set the background based on the weather code 
      //clear done 
      if (weatherCode == 0) {

        $("body").css("background-image", "url(./background/clear.gif)");
      }
      //Cloud Development done  
      else if (weatherCode >= 1 && weatherCode <= 3) {

        $("body").css("background-image", "url(background/cloudy.gif)");
      }
      //Visibility Reduction done  
      else if (weatherCode >= 4 && weatherCode <= 6) {

        $("body").css("background-image", "url(background/low_vis.gif)");
      }
      //Fog/Ice Fog done 
      else if ([10, 11, 12, 28, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49].includes(weatherCode)) {

        $("body").css("background-image", "url(background/fog.gif)");
      }
      //Thunderstorm done 
      else if ([13, 17, 29, 91, 92, 93, 94, 95, 96, 97, 98, 99].includes(weatherCode)) {


        $("body").css("background-image", "url(background/thunderstorm.gif)");
      }
      //drizzle done
      else if (weatherCode >= 50 && weatherCode <= 59) {

        $("body").css("background-image", "url(background/drizzle.gif)");
      }
      //rain done 
      else if (weatherCode >= 60 && weatherCode <= 69) {

        $("body").css("background-image", "url(background/rain.gif)");
      }
      //Precipitation done 
      else if ([14, 15, 16, 20, 21, 22, 23, 24, 25, 26, 27, 80, 81, 82, 83, 84].includes(weatherCode)) {
        $("body").css("background-image", "url(background/rain.gif)");
      }
      //Squalls/Funnel Clouds yet to find image done 
      else if ([18, 19].includes(weatherCode)) {

        $("body").css("background-image", "url()");
      }
      //Duststorm/Sandstorm done 
      else if ([7, 8, 9, 30, 31, 32, 33, 34, 35].includes(weatherCode)) {

        $("body").css("background-image", "url(background/sandstorm.gif)");
      }
      //Light Snow done
      else if ([36, 85].includes(weatherCode)) {

        $("body").css("background-image", "url(background/snow.gif)");
      }
      //Moderate Snow done 
      else if ([37, 38, 39, 70, 71, 72, 73, 74, 75, 76, 77, 78, 86, 87, 88].includes(weatherCode)) {
        $("body").css("background-image", "url(background/snow.gif)");
      }
      //Snow Pellets/Small Hail done
      else if ([27, 79, 89, 90].includes(weatherCode)) {
        $("body").css("background-image", "url(background/hail.gif)");
      }


      curr_date = document.getElementById("date");
      curr_date.textContent = moment(data.daily.time[0]).utc().format('dddd, MMMM Do YYYY');

      curr_temp = document.getElementById("temperature");
      curr_temp.textContent = data.current_weather.temperature + "°C";

      curr_high_temp = document.getElementById("high-temperature");
      curr_high_temp.textContent = data.daily.temperature_2m_max[0] + "°C";

      curr_low_temp = document.getElementById("low-temperature");
      curr_low_temp.textContent = data.daily.temperature_2m_min[0] + "°C";

      curr_wind = document.getElementById("wind-speed");
      curr_wind.textContent = data.current_weather.windspeed + " km/h";

      curr_precip = document.getElementById("rain-probability");
      curr_precip.textContent = data.daily.precipitation_sum[0] + " %";

      curr_fl_low = document.getElementById("feel_high");
      curr_fl_low.textContent = data.daily.apparent_temperature_max[0] + "°C";

      curr_fl_high = document.getElementById("feel_low");
      curr_fl_high.textContent = data.daily.apparent_temperature_min[0] + "°C";


      for (let i = 0; i < data.daily.time.length; i++) {

        var day_date = "day_date_" + (i + 1);
        dayOfWeek = document.getElementById(day_date);
        dayOfWeek.textContent = date_to_day(data.daily.time[i]);

        var low_id = "low_label_" + (i + 1);
        low = document.getElementById(low_id);
        low.textContent = data.daily.temperature_2m_min[i] + "°C";

        var high_id = "high_label_" + (i + 1);
        high = document.getElementById(high_id);
        high.textContent = data.daily.temperature_2m_max[i] + "°C";

        var precipitation_id = "rain_label_" + (i + 1);
        rain = document.getElementById(precipitation_id);
        rain.textContent = data.daily.precipitation_sum[i] + " %";

        var wind_id = "wind_label_" + (i + 1);
        wind = document.getElementById(wind_id);
        wind.textContent = data.daily.windspeed_10m_max[i] + " km/h";

      }
      
      d3.select("svg").remove();
      // console.log(data.hourly.time.length);
      let time_arr = [];
      let temp_arr = [];

      for (let j = 0; j < data.hourly.time.length; j++) {

        if (j >= 7) {
          updateChart(time_arr, temp_arr);
          break;
        }

        else {
          var hourly_time_id = "hourly_time_" + (j + 1);
          hourly_time = document.getElementById(hourly_time_id);
          hourly_time.textContent = moment(data.hourly.time[j]).utc().format('h A');
          time_arr[j] = moment(data.hourly.time[j]).utc().format('h A');

          var hourly_temp_id = "hourly_temp_" + (j + 1);
          temp = document.getElementById(hourly_temp_id);
          temp.textContent = data.hourly.temperature_2m[j] + "°C";
          temp_arr[j] = data.hourly.temperature_2m[j];

          var hourly_icon_id = "hourly-icon-" + (j + 1);
          getWeatherIcon(hourly_icon_id, data.hourly.weathercode[j]);
        }
      }
      // changes weather icon for current day 
      getWeatherIcon("icon", data.current_weather.weathercode);
      getWeatherIcon("icon_label_1", data.current_weather.weathercode);
      getWeatherIcon("icon_label_2", data.daily.weathercode[1]);
      getWeatherIcon("icon_label_3", data.daily.weathercode[2]);
      getWeatherIcon("icon_label_4", data.daily.weathercode[3]);
      getWeatherIcon("icon_label_5", data.daily.weathercode[4]);
      getWeatherIcon("icon_label_6", data.daily.weathercode[5]);
      getWeatherIcon("icon_label_7", data.daily.weathercode[6]);
    },
    error: function () {
      alert("Could not retrieve weather data. Please try again.");
    }
  });

}
$(document).ready(function () {
  // updates clock every 1 sec
  setInterval(updateClock, 1000);

  var global_loc;

  // Handle form submission
  $('#location-form').submit(function (event) {
    event.preventDefault();
    var location = $('#location-input').val();

    getCoordinates(location, function (latitude, longitude, name) {
      $('#location-input').val(name);

      getWeatherData(latitude, longitude);
    });
  });

  // Handle form submission for the first page
  $('#main-location-form').submit(function (event) {
    event.preventDefault();
    var location = $('#main-location-input').val();
    getCoordinates(location, function (latitude, longitude, name) {

      getWeatherData(latitude, longitude);
    });
  });

  // Navigate to weather.html with location as query parameter
  $('#main-location-form').submit(function (event) {
    event.preventDefault();
    var location = $('#main-location-input').val();

    getCoordinates(location, function (latitude, longitude, name) {

      localStorage.setItem('location', name);
      localStorage.setItem('latitude', latitude);
      localStorage.setItem('longitude', longitude);
      window.location.href = 'weather.html';
    });
  });

// Get location data from localStorage and fetch weather data on page load
  if (localStorage.getItem('location')) {

    var name = localStorage.getItem('location');
    var latitude = localStorage.getItem('latitude');
    var longitude = localStorage.getItem('longitude');

    $("#location").text(name);
    getWeatherData(latitude, longitude);
    localStorage.clear();    
  }
  // gets user location if the button is clicked 
  document.getElementById("locate-me-button").addEventListener("click", function() {
    start();
  });
});