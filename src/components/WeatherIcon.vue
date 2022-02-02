// ----------------------------------------------------------------------------
// *** TEMPLATE (HTML) ***
// ----------------------------------------------------------------------------
<template>
    <img class="icon" v-bind:src="getURL()" alt="icon" width="80" height="80">
</template>


// ----------------------------------------------------------------------------
// *** SCRIPT (JavaScript) ***
// ----------------------------------------------------------------------------
<script>
export default {

    // *** PROPS ***
    props: {
        iconSetOneID: null,
        weatherID: null,
        showIconSetTwo: null
    },

    // *** PROP DATA ***
    propData: {
		showIconSetTwo: false
	},

    // *** DATA ***
    data () {
        return {
            // * Lokala variabler *
            iconURL: '',
            //
            // * openweathermap.org *
            // HEPP! http://openweathermap.org/img/w/10d.png
            baseOneURL: 'http://openweathermap.org/img/w/',
            //
            // * weatherbit.io *
            // DAG https://www.weatherbit.io/static/img/icons/[t01]d.png
            // NATT https://www.weatherbit.io/static/img/icons/[t01]n.png

            baseTwoURL: 'https://www.weatherbit.io/static/img/icons/',
            weatherCodes: {200: 't01', 201: 't02', 202: 't03', 230: 't04', 
                           231: 't04', 232: 't04', 233: 't05', 300: 'd01', 
                           301: 'd02', 302: 'd03', 500: 'r01', 501: 'r02', 
                           502: 'r03', 511: 'f01', 520: 'r04', 521: 'r05', 
                           522: 'r06', 600: 's01', 601: 's02', 602: 's03', 
                           610: 's04', 611: 's05', 612: 's05', 621: 's01', 
                           622: 's02', 623: 's06', 700: 'a01', 711: 'a02', 
                           721: 'a03', 731: 'a04', 741: 'a05', 751: 'a06', 
                           800: 'c01', 801: 'c02', 802: 'c02', 803: 'c03', 
                           804: 'c04', 900: 'u00'}
        }
    },

    // *** METHODS ***
    methods: {
        // * JavaScript/Logik *
        getURL() { // get weather icon URL
            if (this.showIconSetTwo) {
                let showDayOrNight = 'd';
                this.iconURL = `${this.baseTwoURL}${this.weatherCodes[this.weatherID]}${showDayOrNight}.png`;                
            } else {
                this.iconURL = `${this.baseOneURL}${this.iconSetOneID}.png`;  
            }
            
            return this.iconURL;
        }

    }
}
</script>


// ----------------------------------------------------------------------------
// *** STYLE (CSS) ***
// ----------------------------------------------------------------------------
<style scoped>
.icon {
      vertical-align: middle;
}
</style>