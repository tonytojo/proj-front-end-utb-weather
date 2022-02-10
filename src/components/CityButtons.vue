// ****************************************************************************
// *                                                                          *
// *    CityButtons ver 1.0                                                   *
// *                                                                          *
// ****************************************************************************


// ----------------------------------------------------------------------------
// *** TEMPLATE (HTML) ***
// ----------------------------------------------------------------------------
<template>
  <div class="buttons-container">
    <button 
      class="city-button" 
      v-for="getCity in cityData"
      :key="getCity.city"
      @click="setState(getCity.lat, getCity.long)"
    >
      {{ getCity.city }}
    </button>
  </div>
</template>


// ----------------------------------------------------------------------------
// *** SCRIPT (JavaScript) ***
// ----------------------------------------------------------------------------
<script>
import store from '../store'

export default {

  // *** PROPS ***
  props: {
  },

  // *** DATA ***
  data () {
    return {
      // * Lokala variabler *
      cityData:[
        { city: 'New York',  lat: 40.7143, long: -74.006 },
        { city: 'London',    lat: 51.5085, long: -0.1257 },
        { city: 'Paris',     lat: 48.8534, long: 2.3488 },
        { city: 'Stockholm', lat: 59.3326, long: 18.0649 },
        { city: 'Göteborg',  lat: 57.7072, long: 11.9668 },
        { city: 'Malmö',     lat: 55.6059, long: 13.0007 }
      ]
    }
  },

  // *** METHODS ***
  methods: {
    setState(lat, long) {
      store.commit('setLatitude', lat)
      store.commit('setLongitude', long)
      store.commit('setWakeApp')      // Waking & Shaking App.vue! ;)

      // ... hence, no need for setting (local) Time here ...
      // ... it will be set in App.vue --> getLocationFromState() ...
    }
  }
}
</script>


// ----------------------------------------------------------------------------
// *** STYLE (CSS) ***
// ----------------------------------------------------------------------------
<style scoped>
  .buttons-container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .city-button {
    margin: 10px;
    padding: 6px 25px;
    font-size: 16px;
    color: #fff;
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 6px 6px rgba(0, 0, 0, 0.20);
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
  .city-button:hover {
    background: rgba(255, 255, 255, 0.35);
  }
  .city-button:active {
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0px 0px rgba(0, 0, 0, 0.20);
    transform: translateX(4px) translateY(4px);
  }
</style>