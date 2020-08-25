import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // All pokemons List 
    pokemons: [],
    // Defines whether to display or not loader
    loading: true
  },
  mutations: {
    mutate(state, payload) {
      const { property, value } = payload;
      state[property] = value;
    },
    updatePokemons(state, pokemons) {
      state.pokemons = [...state.pokemons, ...pokemons];
    }
  },
  actions: {
    async loadPokemons({ commit }, offset) {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`);
      /* 
      With the first response we only get pokemon's name and an url 
      In order to get more informations about the pokemon we'll use the url to send an other request to the API and we'll do it for each pokemons of response.data.results array
      */
      const allPokemons = await Promise.all(response.data.results.map(pokemon => axios.get(pokemon.url)));

      // Update pokemons array in the state with the new array
      commit('updatePokemons', allPokemons);

      // hide loader
      commit('mutate', {property: 'loading', value: false});
    },
  },
  modules: {
  }
})
