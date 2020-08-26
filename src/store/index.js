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
    searchType: false,
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
    // pokemon stats
    stats: [],
    // pokemon evolution chain
    evolutions: {},
    // Pokemon name and id used to get pokemon's image 
    pokemonIds: [],
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
    },
    updateId(state, id) {
      state.pokemonIds = [...state.pokemonIds, id]
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
      allPokemons.map(pokemon => {
        // Check if pokemon already exist in the array
        if(!this.state.pokemons.some(poke => poke.data.id === pokemon.data.id)) {
          // If not, Update pokemons array in the state with the new array
          // This prevents for loop key duplicate error during render
          commit('updatePokemons', allPokemons);
        }
      })

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
    async loadAbout({ commit, dispatch }, pokemonId) {
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

        dispatch('loadEvolutions', response.data.evolution_chain.url);
      }
      catch(error) {
        console.log(error);
      }
    },
    async loadEvolutions({ commit }, url) {
      try {
        // Send request to get pokemon's evolution chain
        const response = await axios.get(url);
        
        // update evolutions in the state with response
        commit('mutate', {property: 'evolutions', value: response.data.chain});     

        // Push pokemon's name into evolutionsName
        const evolutionsName = [];
        evolutionsName.push(response.data.chain.species.name);

        // If pokemon can evolve, push the evolution'name into evolutionsName array
        if(response.data.chain.evolves_to.length > 0) {
          response.data.chain.evolves_to.forEach(evolution => {
            evolutionsName.push(evolution.species.name)
          
            // If pokemon can evolve again, push the evolution'name into evolutionsName array
            if(evolution.evolves_to.length > 0) {
              evolutionsName.push(evolution.evolves_to[0].species.name)
            }
          });

          // If pokemon has an other evolution, push the evolution'name into evolutionsName array
          if(response.data.chain.evolves_to[0].evolves_to.length > 0) {
            response.data.chain.evolves_to[0].evolves_to.forEach(evolution => evolutionsName.push(evolution.species.name))
          }
        }   

        // For each name in evolutionsName, send request to get pokemon information
        const allEvolutions = await Promise.all(evolutionsName.map(pokemon => axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)));
        // For each response, push an object inside pokemonIds in the state
        allEvolutions.forEach(pokemon => {
          const pokemonId = {
            id: pokemon.data.id,
            name: pokemon.data.name
          }
          commit('updateId', pokemonId);
        })

      }
      catch(error) {
        console.log(error);
      }
      // Hide loader
      commit('mutate', {property: 'loading', value: false});
    },
    async loadTypes({ commit }, type) {
      // Reset loading and error status
      commit('mutate', {property: 'loading', value: true});
      commit('mutate', {property: 'error', value: false});
      // Set searchType to true to disable infinite scroll on home page
      commit('mutate', {property: 'searchType', value: true});

      try {
        // Send request to get all pokemon of one type
        const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
        const allPokemons = await Promise.all(response.data.pokemon.map(pokemon => axios.get(pokemon.pokemon.url)));
        
        // Get only the pokemon whose id is below 808 because otherwise there is no available image 
        const filterPokemons = allPokemons.filter(pokemon => pokemon.data.id < 808);
        // Update state with the datas
        commit('mutate', {property: 'pokemons', value: filterPokemons});        
      }
      catch(error) {
        commit('mutate', {property: 'error', value: true});
      }
      // Hide loader
      commit('mutate', {property: 'loading', value: false});
    }
  },
  modules: {
  }
})
