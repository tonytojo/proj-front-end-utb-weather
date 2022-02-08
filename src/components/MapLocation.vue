<template>
  <div>
    <div class="pb-2 text-center mt-4 mt-md-0">
      <h4>Latitud:&nbsp; <span class="pb-2">{{ lat }}</span></h4>
      <h4>Longitud:&nbsp; <span class="pb-2">{{ long }}</span></h4>
      <h4 v-if="localTime">Lokal tid: {{date}}  {{ localTime }}</h4>
    </div>

    <LMap
      class="show-map w-75 rounded mb-3 mx-auto"
      :zoom="zoom"
      :center="center">
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
      interval:'',
      localTime:'',
      months : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      lat: "",
      long: "",
      now: "",
      time: "",
      date: "",
      month:"",
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
 
    mapLocation(lat, long, now) 
    {
      if (now) {
        this.interval ? clearInterval(this.interval): '';
        
         const day = parseInt(now.substr(8, 1))
           ? now.substr(8, 2)
           : now.substr(9, 1);
         this.month = now.substr(4, 3);
         const year = now.substr(11, 4);
         const hh = now.substr(16,2);

         //We use the same minute and second as the computer
         const mm = new Date().getMinutes();
         const ss = new Date().getSeconds();
       
         let localTime = new Date(year,this.months.indexOf(this.month,0),day,hh,mm,ss);
         let time = this;

         this.interval = setInterval(function () {
            localTime.setSeconds(localTime.getSeconds() + 1 );
            time.date = localTime.getDate().toString() + " " + localTime.toString().substr(4, 3);
            time.localTime = localTime.toLocaleTimeString();
         }, 1000);
      }

      this.center = L.latLng(lat, long);
      this.marker = L.latLng(lat, long);
      this.lat = lat;
      this.long = long;
    },
  },
};
</script>

<style scoped>
.show-map {
  min-height: 370px;
  min-width: 370px;
  max-height: 400px;
}
</style>
