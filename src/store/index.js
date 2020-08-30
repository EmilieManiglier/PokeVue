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
    // Defines whether a pokemon type has been searched or not
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
    // locations datas
    locations: [],
    // List of the 683 locations
    allLocations: [],
    // Pokemons that have been captured
    capturedPokemon: [],
    // Defines whether pokemons has been sorted by alphabetical or not
    isSorted: false,
    // Sorting order (ascending or descending)
    isAsc: null,
    // Max value to apply for splice function called on sorted pokemon array
    maxSlice: 0,
  },
  getters: {
    getFirstType(state) {
      const findType = state.pokemon.types.find(type => type.slot === 1);
      return findType.type.name;
    }
  },
  mutations: {
    mutate(state, { property, value }) {
      state[property] = value;
    },
    mutateArray(state, { property, value, iterate }) {
      if(iterate) {
        state[property] = [...state[property], ...value]
      }
      else {
        state[property] = [...state[property], value]
      }
    },
    updateAbout(state, about) {
      state.about = {...state.about, ...about}
    },
  },
  actions: {
    async loadPokemons({ commit }, {offset, limit }) {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
      /* 
      With the first response we only get pokemon's name and an url 
      In order to get more informations about the pokemon we'll use the url to send an other request to the API and we'll do it for each pokemons of response.data.results array
      */
      const allPokemons = await Promise.all(response.data.results.map(pokemon => axios.get(pokemon.url)));
      
      // If user has selected a sorting order, loads all the 807 pokemons
      if(this.state.isAsc !== null) {
        // Empty pokemons array
        commit('mutate', {property: 'pokemons', value: []});

        /* 
        - If first pokemon name is less than second
        It should be placed before the second in resulting array => return something negative

        - Else, if it's greater, it should be placed after the second one => return something positive

        - If isAsc isn't equal to ascending, reverse logic to get pokemons by descending alphabetical order
        */
        const sortPokemons = [...allPokemons].sort((pokemonA, pokemonB) => (pokemonA.data.name < pokemonB.data.name ? -1 : 1) * (this.state.isAsc === 'ascending' ? 1 : -1)
        );
        
        // Increment maxSlice to get results in sortPokemons 20 by 20
        commit('mutate', {property: 'offsetSort', value: this.state.maxSlice += 20})
        const newArray = [];
        newArray.push(...sortPokemons.splice(0, this.state.maxSlice));
        // Update pokemons array in the state with the new sorted array
        commit('mutateArray', {property: 'pokemons', value: newArray, iterate: true});              
      }
      else {
        // Else, check if offset is equal to 0
        // If true, it means that home view is (re)loaded 
        // (otherwise it would means that we want to loadMore pokemons on scroll)
        if(offset === 0) {
          // Empty pokemons array in order to avoid duplicate pokemons
          commit('mutate', {property: 'pokemons', value: []});
        }  
        // Update pokemons array with the response from pokeAPI
        commit('mutateArray', {property: 'pokemons', value: allPokemons, iterate: true});      
      }      

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
          commit('mutateArray', {property: 'pokemonIds', value: pokemonId, iterate: false});

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
    },
    async loadLocations({ commit }, {offset, limit}) {
      try {
        // Send request to get location-area datas
        const response = await axios.get(`https://pokeapi.co/api/v2/location-area?offset=${offset}&limit=${limit}`);
        const allLocations = await Promise.all(response.data.results.map(location => axios.get(location.url)));

        // If limit is equal to 683, we want to get all locations in the game
        if(limit === 683) {     
          // for each location, remove hyphens from location name   
          const locations = allLocations.map(location => location.data.name.replace(/-/g, ' '));
          // Update state with the modified array
          commit('mutateArray', {property: 'allLocations', value: locations, iterate: true});
        }
        else {
          // else we only want to get 20 locations starting from the offset
          allLocations.map(currentLocation => {
            // For each location, check if location already exist in the array
            if(!this.state.locations.some(location => location.data.id === currentLocation.data.id)) {
              // If not, Update locations array in the state with the new array
              // This prevents for loop key duplicate error during render
              commit('mutateArray', {property: 'locations', value: allLocations, iterate: true});
            }
          })
        }
      }
      catch(error) {
        console.log(error);
      }
      commit('mutate', {property: 'loading', value: false});
    },
    async loadLocation({ commit }, location) {
      try {
        // Send request to get location-area datas
        const response = await axios.get(`https://pokeapi.co/api/v2/location-area/${location}`);
        // Push the response into an array
        const newLocation = [];
        newLocation.push(response);

        // Update state with the new location
        commit('mutate', {property: 'locations', value: newLocation});
      }
      catch(error) {
        console.log(error);
      }
      commit('mutate', {property: 'loading', value: false});
    },    
  },
  modules: {
  }
})
