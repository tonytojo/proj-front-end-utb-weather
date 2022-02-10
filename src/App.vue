<template>
  <main class="container-fluid text-white bg-secondary">
    <CityButtons />

    <div class="mt-2 mb-3 w-100">
      <input ref="city" type="text" class="search-bar" placeholder="Search..." v-model="query" @keypress="fetchWeather" />
    </div>

    <div class="row justify-content-center">
      <div v-if="weather" class="no-gutters col-sm-12 col-md-5 position-static">
        <div class="location-box">
          <h1 class="location h-title">
            {{ weather.name }}, {{ weather.sys.country }}
          </h1>
          <div class="date">{{ dateBuilder() }}</div>
        </div>

        <div class="text-center">
          <div class="temp">{{ Math.round(weather.main.temp) }}&deg;C</div>
          <div class="weather" @click="changeIconSet = !changeIconSet">
            {{ weather.weather[0].main }}
            <WeatherIcon :iconSetOneID="weather.weather[0].icon" :weatherID="weather.weather[0].id" :showIconSetTwo="changeIconSet" />
          </div>

          <h1 class="pb-2 h-title">Väderdata</h1>
          <h5>Lufttryck: {{pressure}} hPa</h5>
          <h5>Luftfuktighet: {{humidity}} %</h5>
          
          <h5 class="d-inline-block">Vind: {{wind}} m/s</h5>&nbsp;
          <img v-if="direction" :src="require(`@/assets/${direction}`)" alt="">    
          <h5>Sikt: {{visibility}} meter</h5>
        </div>
      </div>

      <div class="no-gutters col-xs-12 col-md-7 position-static">
       <MapLocation ref="showMap" />
      </div>

      <!-- // TODO * MY FIX FOR STATES * -->
      <!--  Waking & Shaking App.vue! ;) -->
      <div style="font-size: 0px;" >{{ stateWakeApp }}</div>
    </div>
  </main>
</template>

<script>
import WeatherIcon from './components/WeatherIcon.vue';
import MapLocation from './components/MapLocation.vue';
import CityButtons from './components/CityButtons.vue';
import sweetalert from 'sweetalert';
import store from './store'

export default {
  name: "App",
  components: {
    WeatherIcon, MapLocation, CityButtons
  },

  data() {
    return {
      validDirections:['n.png', 'nne.png', 'ne.png', 'ene.png', 'e.png', 'ese.png', 'se.png', 'sse.png', 's.png', 'ssw.png', 'sw.png', 'wsw.png', 'w.png', 'wnw.png', 'nw.png', 'nnw.png','n.png'],
      api_key: "31bb142cae6eb97ee59e5b60d90e1e94",
      url_base: "https://api.openweathermap.org/data/2.5/",
      query: "",
      weather: "",
      showWeather: false,
      changeIconSet: false,
      apikey: "eX4LyGYFGO3dZjbHc6BeIzaxDekw7uhk",
      lat: "",
      long: "",
      pressure:'',
      humidity:'',
      wind:'',
      direction:'',
      visibility:''
    };
  },
  //Get Latitud and weather
  mounted() {
    this.fetchMyLocationAndWeather();
    this.focusInput();
  },

  // ----------------------------------------------------------------
  // TODO * MY FIX FOR STATES *
  computed: {
    stateWakeApp() {      // Waking & Shaking App.vue! ;)
      this.getLocationFromState();
      return store.getters.getWakeApp
    }
  },

  methods: {
    setStateCoordinates(lat, long, now) {
      store.commit('setLatitude', lat)
      store.commit('setLongitude', long)
      store.commit('setTime', now)
    },

    getLocationFromState() {
      let posLat = store.getters.getLatitude
      let posLon = store.getters.getLongitude
      fetch(`${this.url_base}weather?lat=${posLat}&lon=${posLon}&units=metric&appid=${this.api_key}`)
        .then((res) => res.json())
        .then(weather => {
          if(weather.cod === 200)
          {
            this.pressure = weather.main.pressure;
            this.humidity = weather.main.humidity;
            this.wind = weather.wind.speed;
            this.visibility = weather.visibility;
            this.direction = this.validDirections[Math.round(weather.wind.deg/22.5)];
            this.setResults(weather);

            //Get local date and time
            let now = new Date(weather.dt*1000+(weather.timezone*1000));
            now.setHours(now.getHours() - 1);                                
            now = now.toString().substr(0,24);
            
            this.setStateCoordinates(weather.coord.lat, weather.coord.lon, now) 
          }
        })
    },
  // ----------------------------------------------------------------


  // methods: {
      focusInput() {
        this.$refs.city.focus();
    },
    //Get geolocation with latitud and longitud from
    //current position
    getPosition() {
      return navigator.geolocation
        ? new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject))
        : new Promise((resolve) => resolve({}));
    },

    //Get latitud and longitud for a given city
    /* Not used because we get lat and long from REST-API väder
    async getGeoLocationFromAdr() {
      const response = await fetch(`http://open.mapquestapi.com/nominatim/v1/search.php?key=${this.apikey}&format=json&q=` + this.query);
      const data = await response.json();

      this.lat = data[0].lat;
      this.long = data[0].lon;

      //Show map with a location pointer
      this.$refs.showMap.mapLocation(this.lat, this.long);
    },
    */

    //Get weather data for a given city
    fetchWeather(e) {
      if (e.key === "Enter") {
          fetch(`${this.url_base}weather?q=${this.query}&units=metric&appid=${this.api_key}`)
          .then(res => res.json())
          .then(weather => 
          {
              if(weather.cod === 200)
              {
                this.pressure = weather.main.pressure;
                this.humidity = weather.main.humidity;
                this.wind = weather.wind.speed;
                this.visibility = weather.visibility;
                this.direction = this.validDirections[Math.round(weather.wind.deg/22.5)];
                this.setResults(weather);

                //Get local date and time
                let now = new Date(weather.dt*1000+(weather.timezone*1000));
                now.setHours(now.getHours() - 1);                                
                now = now.toString().substr(0,24);
                
                // TODO * MY FIX FOR STATES *
                this.setStateCoordinates(weather.coord.lat, weather.coord.lon, now) 
              }
              else
              {
                sweetalert({text: "No such city exist", icon: "error"});         
              }
          });
      }
    },

    //Get weather for a given latitud and longitud
    async fetchMyLocationAndWeather() {

      //Get latitud and longitud for current server
      let position = await this.getPosition();

     //Get weather data for a given latitud and longitud
      if (position.coords) 
      {
        fetch(`${this.url_base}weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${this.api_key}`)
          .then((res) => res.json())
          .then(weather => {
              this.pressure = weather.main.pressure;
              this.humidity = weather.main.humidity;
              this.wind = weather.wind.speed;
              this.direction = this.validDirections[Math.round(weather.wind.deg/22.5)];
              this.visibility = weather.visibility;
              
              this.setResults(weather);
              const now = new Date().toString().substr(0,24);

              // TODO * MY FIX FOR STATES *
              this.setStateCoordinates(position.coords.latitude, position.coords.longitude, now) 
          });
      } 
      else {
        sweetalert({text: "Geolocation can not be used",icon: "info"});
      }
    },
    setResults(results) {
      this.weather = results;
    },

    dateBuilder() {
      let d = new Date();
      let months = [
        // "January", "Febuary", "March", "April", "May", "June",
        // "July", "August", "September", "October", "November", "December"
        "Januari", "Februari", "Mars", "April", "Maj", "Juni",
        "Juli", "Augusti", "September", "Oktober", "November", "December"

      ];
      let days = [
        // "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"
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
  @import './assets/windDirection.css';
  @import './assets/fullScreen.css';
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap');

  h1,h2,h3,h4,h5,h6 {
     font-family: 'Open Sans', sans-serif;
  }

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
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.25),rgba(0, 0, 0, 0.75));
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
    text-align: center;
    text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
  }

  .h-title {
    font-size: 30px;
    font-weight: bold;
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

  .no-gutters {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
</style>
