<template>
  <div>
    <div class="pb-2 text-center mt-4 mt-md-0">
      <h3>Latitud:&nbsp; <span class="pb-2">{{lat}}</span></h3>
      <h3>Longitud:&nbsp; <span class="pb-2">{{long}}</span></h3>
    </div>

    <LMap class="show-map w-75 rounded mb-3 mx-auto" :zoom="zoom" :center="center">
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
  .show-map {
    min-height: 370px;
    min-width: 370px;
    max-height: 400px;
    }

</style>