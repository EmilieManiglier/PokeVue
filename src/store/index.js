import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // All pokemons List 
    pokemons: [],
    // One pokemon data
    pokemon: [],
    // Defines whether to display or not loader
    loading: true,
    // Value of search pokemon input
    searchPokemon: '',
    // Defines whether to display or not error message
    error: false,
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
    async loadSinglePokemon({ commit }, pokemon) {
      // Reset loading and error value
      commit('mutate', {property: 'loading', value: true});
      commit('mutate', {property: 'error', value: false});
      
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        // Save pokemon in the state
        commit('mutate', {property: 'pokemon', value: response.data});      
        // Empty input value
        commit('mutate', {property: 'searchPokemon', value: ''});
      }
      catch {
        // Set error to true to display error message
        commit('mutate', {property: 'error', value: true});      
      }
      // Hide Loader
      commit('mutate', {property: 'loading', value: false});
    }
  },
  modules: {
  }
})
