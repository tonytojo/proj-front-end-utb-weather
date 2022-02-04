<template>
  <main class="container-fluid text-white bg-secondary">
    <div class="mt-2 mb-3 w-100">
      <input type="text" class="search-bar" placeholder="Search..." v-model="query" @keypress="fetchWeather" />
    </div>

    <div class="row justify-content-center">
         <div v-if="weather" class="col-sm-12 col-md-5">
        <div class="location-box">
          <div class="location">
            {{ weather.name }}, {{ weather.sys.country }}
          </div>
          <div class="date">{{ dateBuilder() }}</div>
        </div>

        <div class="text-center">
          <div class="temp">{{ Math.round(weather.main.temp) }}&deg;C</div>
          <div class="weather" @click="changeIconSet = !changeIconSet">
            {{ weather.weather[0].main }}
            <WeatherIcon :iconSetOneID="weather.weather[0].icon" :weatherID="weather.weather[0].id" :showIconSetTwo="changeIconSet" />
          </div>
        </div>
      </div>

      <div class="col-xs-12 col-md-5">
        <MapLocation ref="showMap" />
      </div>
    </div>
  </main>
</template>

<script>
import WeatherIcon from './components/WeatherIcon.vue';
import sweetalert from 'sweetalert';
import MapLocation from './components/MapLocation.vue';

export default {
  name: "App",
  components: {
    WeatherIcon, MapLocation
  },

  data() {
    return {
      api_key: "31bb142cae6eb97ee59e5b60d90e1e94",
      url_base: "https://api.openweathermap.org/data/2.5/",
      query: "",
      weather: "",
      showWeather: false,
      changeIconSet: false,
      apikey: "eX4LyGYFGO3dZjbHc6BeIzaxDekw7uhk",
      lat: "",
      long: "",
    };
  },
  //Get Latitud and weather
  mounted() {
    this.fetchMyLocationAndWeather();
  },

  methods: {
    //Get geolocation with latitud and longitud from
    //current position
    getPosition() {
      return navigator.geolocation
        ? new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject))
        : new Promise((resolve) => resolve({}));
    },

    //Get latitud and longitud for a given city
    async getGeoLocationFromAdr() {
      const response = await fetch(`http://open.mapquestapi.com/nominatim/v1/search.php?key=${this.apikey}&format=json&q=` + this.query);
      const data = await response.json();

      this.lat = data[0].lat;
      this.long = data[0].lon;

      //Show map with a location pointer
      this.$refs.showMap.mapLocation(this.lat, this.long);
    },

    //Get weather data for a given city
    fetchWeather(e) {
      if (e.key === "Enter") {
          fetch(`${this.url_base}weather?q=${this.query}&units=metric&appid=${this.api_key}`)
          .then((res) => res.json())
          .then((weather) => {
            this.setResults(weather);

            if(this.weather.cod === 200)
            {
              //Use helper to get latitud and longitud for a given city
              //this.getGeoLocationFromAdr();
               this.$refs.showMap.mapLocation(weather.coord.lat, weather.coord.lon);
            }
            else{
                sweetalert({text: "No such city exist", icon: "error",
             });         
            }
          });
      }
    },

    //Get weather for a given latitud and longitud
    async fetchMyLocationAndWeather() {

      //Get latitud and longitud for current server
      let position = await this.getPosition();

     //Get weather data for a given latitud and longitud
      if (position.coords) {
        fetch(`${this.url_base}weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${this.api_key}`)
          .then((res) => res.json())
          .then(this.setResults);

          this.lat = position.coords.latitude;
          this.long = position.coords.longitude;
          this.$refs.showMap.mapLocation(position.coords.latitude, position.coords.longitude);
      } 
      else {
        sweetalert({
          text: "Geolocation can not be used",
          icon: "info",
        });
      }
    },
    setResults(results) {
      this.weather = results;
    },

    dateBuilder() {
      let d = new Date();
      let months = [
        "January",
        "Febuary",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      let day = days[d.getDay()];
      let date = d.getDate();
      let month = months[d.getMonth()];
      let year = d.getFullYear();
      return `${day} ${date} ${month} ${year}`;
    },
  }, // end methods
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
}

#app {
  background-image: url("https://images.unsplash.com/photo-1516912481808-3406841bd33c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3288&q=80");
  background-size: cover;
  background-position: center;
  transition: 0.4s;
}

main {
  min-height: 100vh;
  padding: 25px;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.25),
    rgba(0, 0, 0, 0.75)
  );
}

.w-100 .search-bar {
  width: 100%;
  padding: 15px;
  font-size: 20px;
  border: none;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.25);
  outline: none;
  background: none;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 0 16px 0 16px;
  transition: 0.4s;
}

.location-box .location {
  color: #fff;
  font-size: 32px;
  font-weight: 500;
  text-align: center;
  text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
}

.location-box .date {
  color: #fff;
  font-size: 20px;
  font-weight: 300;
  font-style: italic;
  text-align: center;
}

.text-center .temp {
  display: inline-block;
  padding: 10px 25px;
  color: #fff;
  font-size: 102px;
  font-weight: 900;
  text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  margin: 30px 0;
  box-shadow: 3px 6px rgba(0, 0, 0, 0.25);
}

.weather {
  color: #fff;
  font-size: 48px;
  font-weight: 100;
  font-style: italic;
  text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
}

::placeholder { 
  color: #fff;
}
</style>
