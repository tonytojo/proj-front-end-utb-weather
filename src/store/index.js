// ****************************************************************************
// *                                                                          *
// *    index.js   ver 1.0                                                    *
// *                                                                          *
// ****************************************************************************

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// ----------------------------------------------------------------------------
// *** VUEX STORE ***
// ----------------------------------------------------------------------------
export default new Vuex.Store({
  
  // *** STATE ***
  state: {
    // Karlstad -- lat: 59.3793 / long: 13.5036
    latitude: 59.3793, 
    longitude: 13.5036,
    // latitude: 0, 
    // longitude: 0,
    time: 0,
    wakeapp: true     // Waking & Shaking App.vue! ;)
  },

  // *** MUTATIONS ***
  mutations: {
    setLatitude (state, payload) {
      state.latitude = payload
    },
    setLongitude (state, payload) {
      state.longitude = payload
    },     
    setTime (state, payload) {
      state.time = payload
    },
    setWakeApp (state) {
      state.wakeapp = !state.wakeapp
    }
  },
  
  // *** ACTIONS *** NOTE: ASYNC ONLY!
  actions: {
  },
  
  // *** GETTERS ***
  getters: {
    getLatitude (state) {
      return state.latitude
    },
    getLongitude (state) {
      return state.longitude
    },
    getTime (state) {
      return state.time
    },
    getWakeApp (state) {
      return state.wakeapp
    }
  },

  // *** MODULES ***
  modules: {
  }
})
