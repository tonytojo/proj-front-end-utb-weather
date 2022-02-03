<template>
  <div class="map-wrapper">
    <div style="paddingBottom:10px">
      <h2>Latitud:&nbsp;&nbsp;&nbsp; <span class="bg-red">{{lat}}</span></h2>
      <h2>Longitud: <span class="bg-red">{{long}}</span></h2>
    </div>

    <LMap class="show-map" :zoom="zoom" :center="center">
      <LTileLayer :url="url" :attribution="attribution"></LTileLayer>
      <LMarker :lat-lng="marker"></LMarker> 
    </LMap>
  </div>
</template>

<script>
import L from "leaflet";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";

export default {
  name: "MapLocation",
  data() {
    return {
      zoom: 14,
      center: L.latLng(0, 0),
      marker: L.latLng(0, 0),
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    };
  },
    components: { LMap, LTileLayer, LMarker },
  methods: {
     mapLocation(lat,long) {
      this.center = L.latLng(lat, long);
      this.marker = L.latLng(lat, long);
      this.lat = lat;
      this.long = long;
    },
  }
};
</script>

<style scoped>
  .bg-red {
    background-color: red;
  }
  .map-wrapper {
    height: 100%;
    width: 100%;
    }

  .show-map {
    width: 75%;
    min-height: 400px;
    min-width: 400px;

    max-height: 400px;
    }
</style>