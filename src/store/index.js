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
    // pokemon first's type
    firstType: '',
    // pokemon' description
    description: '',
    // pokemon abilities (hidden or not)
    abilities: [],
    // pokemon about data
    about: {},
    // pokemon training data
    training: {},
    // pokemons stats
    stats: []
  },
  getters: {
    getFirstType(state) {
      const findType = state.pokemon.types.find(type => type.slot === 1);
      return findType.type.name;
    }
  },
  mutations: {
    mutate(state, payload) {
      const { property, value } = payload;
      state[property] = value;
    },
    updateAbout(state, about) {
      state.about = {...state.about, ...about}
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
    async loadSinglePokemon({ commit, getters }, pokemon) {
      // Reset loading and error value
      commit('mutate', {property: 'loading', value: true});
      commit('mutate', {property: 'error', value: false});
      
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        // Save pokemon in the state
        commit('mutate', {property: 'pokemon', value: response.data});      
        // Empty input value
        commit('mutate', {property: 'searchPokemon', value: ''});
        // Get Pokemon first type
        commit('mutate', {property: 'firstType', value: getters.getFirstType});
        // Save abilities in the state
        commit('mutate', {property: 'abilities', value: response.data.abilities});

        const about = {
          'Species': '',
          // Convert height (dm) in meters
          'Height': `${response.data.height/ 10} m`,
          // Convert weight (hg) in kg with 1 digit after comma
          'Weight': `${(response.data.weight * 0.1).toFixed(1)} kg`,
        };
        // Update about object in state with the data
        commit('updateAbout', about);

        // Get pokemon's base stat and update state with the datas
        const stats = response.data.stats.map(stat => stat.base_stat);
        commit('mutate', {property: 'stats', value: stats});
      }
      catch {
        // Set error to true to display error message
        commit('mutate', {property: 'error', value: true});      
      }
      // Hide Loader
      commit('mutate', {property: 'loading', value: false});
    },
    async loadAbout({ commit }, pokemonId) {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);

        // Get pokemon species name in english
        const speciesName = response.data.genera.find(element => element.language.name === 'en').genus;
        // Update about object in state with the species
        commit('updateAbout', {'Species' : speciesName});

        // get all description in english
        const descriptionEnglish = response.data.flavor_text_entries.filter(element => 
          element.language.name === 'en');
        // Get the english description coming from the latest version
        const description = descriptionEnglish[descriptionEnglish.length - 1].flavor_text;
        // Update description in the state
        commit('mutate', {property: 'description', value: description});

        const training = {
          "Capture rate": response.data.capture_rate,
          "Base Happiness": response.data.base_happiness,
          "Growth rate": response.data.growth_rate.name
        };
        // Update training in the state with th data
        commit('mutate', {property: 'training', value: training});

      }
      catch(error) {
        console.log(error);
      }
    }
  },
  modules: {
  }
})
