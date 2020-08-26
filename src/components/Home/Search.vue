<template>
  <b-form class="text-center d-md-flex my-md-4" @submit.prevent="handleSubmit">
    <b-form-input
      size="md"
      class="my-2 mx-md-2"
      placeholder="Try Pikachu, 25 or electric"
      v-model.trim="searchPokemon" 
    >
    </b-form-input>

    <b-button
      variant="info"
      size="md"
      class="search-btn my-2"
      type="submit"
      aria-label="search pokemon"
      :disabled="disable"
    >
      Search
    </b-button>
  </b-form>
</template>

<script>
export default {
  computed: {
    disable() {
      // Disable button if input is empty
      if(this.searchPokemon === '') return true; 
      return false;
    },
    searchPokemon: {
      get () {
        // Get the value in the state
        return this.$store.state.searchPokemon
      },
      set (value) {
        // Change the value in the state on input event
        this.$store.commit('mutate', {property: 'searchPokemon', value: value.toLowerCase()});
      }
    }
  },
  data() {
    return {
      types: ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water']
    }
  },
  methods: {
    handleSubmit() {
      // Get pokemon data according to input value
      // if input value correspond to a pokemon type
      if(this.types.indexOf(this.searchPokemon) > -1) {
        // Send the request to get all pokemons of this type
        this.$store.dispatch('loadTypes', this.searchPokemon);
      }
      else {
        // Else, send the request to get one pokemon by name or id
        this.$store.dispatch('loadSinglePokemon', this.searchPokemon);
        // Empty pokemons array in the state in order to display only the result of the research
        this.$store.commit('mutate', {property: 'pokemons', value: []});     
      }
    }
  }
};
</script>

<style lang='scss' scoped>
form {
  width: 50%;
  margin: auto;

  .search-btn:disabled {
    cursor: not-allowed;
  }
}
@media screen and (min-width: 768px) {
  form {
    width: 25%;
  }
}
</style>