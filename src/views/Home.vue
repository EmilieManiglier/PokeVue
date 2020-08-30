<template>
  <div class="home text-center">
    <Loader v-if="loading"/>

    <fragment v-else>
      <div class="container p-2 mb-2 home-filters">
        <h2>Filters</h2>
        <search />
        <b-form-select
          v-model="selected"
          :options="options"
          class="col-md-4 my-2"
          @change="onChange"
        ></b-form-select>
        <types-filter />
      </div>

      <!-- if no pokemon has been searched or if a type has been searched -->
      <fragment v-if="pokemons.length > 0">
        <!--if there's an error, display error message -->
        <error v-if="error" :search="searchPokemon" />

        <!--Else, if there's no error, display list -->
        <div v-else class="d-flex flex-wrap justify-content-center">
          <b-card-group v-for="(pokemon, index) in pokemons" :key="`${index}-${pokemon.data.id}`">
            <pokemon :pokemon="pokemon.data" />
          </b-card-group>
        </div>

        <!-- Prevent infinite scroll if we display list by pokemon's type  -->
        <div v-if="!searchType && showSpinner" class="text-center">
          <div class="spinner-border text-light" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <Observer @intersect="loadMore" />
        </div>
      </fragment>

      <!-- Else, if a pokemon has been searched -->
      <div 
        v-else-if="Object.keys(this.pokemon).length > 0" 
        class="d-flex justify-content-center"
      >
        <!--if there's an error, display error message -->
        <error v-if="error" :search="searchPokemon" />

        <!--Else, if there's no error, display pokemon -->
        <pokemon v-else :pokemon="pokemon" />
      </div>
    </fragment>
  </div>
</template>

<script>
import Pokemon from '@/components/Home/Pokemon'
import Search from '@/components/Home/Search'
import TypesFilter from '@/components/Home/TypesFilter'
import Error from '@/components/Home/Error'
import Observer from '@/components/Observer'
import Loader from '@/components/Loader'
import { mapState } from 'vuex'
import { Fragment } from 'vue-fragment'

export default {
  name: 'Home',
  components: {
    Pokemon,
    Search,
    TypesFilter,
    Error,
    Loader,
    Observer,
    Fragment
  },
  data() {
    return {
      // offset used to display pokemons
      offset: 0,
      showSpinner: true,
      selected: null,
      // Select options
      options: [
        { value: null, text: 'Find Pokemons by alphabetical order', disabled: true },
        { value: 'ascending', text: 'Pokemon A-Z' },
        { value: 'descending', text: 'Pokemon Z-A' },
      ]      
    }
  },
  computed: mapState([
    'pokemons',
    'pokemon',
    'loading',
    'error',
    'searchPokemon',
    'searchType',
    'isSorted',
    'maxSlice'
  ]),
  methods: {
    loadMore() {
      /* Stops infinite scroll if offset is above 780 
      because there is no datas for pokemon last generation in the pokeAPI
      */
      if(!this.isSorted && this.offset <= 780) {
        // If offset is under 780
        // Increment offset by 20
        this.offset += 20;   
        // Load the 20 next pokemons whenever we reach bottom of the screen
        this.$store.dispatch('loadPokemons', {offset: this.offset, limit: 20});
      }
      else if(this.isSorted && this.maxSlice <= 807) {
        this.$store.dispatch('loadPokemons', {offset: this.maxSlice, limit:(807 - this.maxSlice) });
      }
      else {
        // Hide spinner since there are no more pokemons to load
        this.showSpinner = false;
      }
    },
    onChange(order) {
      // Reset values in the state
      this.$store.commit('mutate', {property: 'maxSlice', value: 0});
      this.$store.commit('mutate', {property: 'isSorted', value: true});
      this.$store.commit('mutate', {property: 'loading', value: true});

      // Set isAsc in the datas according to the value chosen by user
      this.$store.commit('mutate', {property: 'isAsc', value: order});

      // Load pokemons by ascending or descending alphabetical order
      this.$store.dispatch('loadPokemons', {offset: 0, limit: 807});
    }
  },
  created() {
    // Load the 20 first pokemons
    this.$store.dispatch('loadPokemons', {offset: this.offset, limit: 20});
  }
}
</script>

<style lang="scss" scoped>
.home {
  padding: 2rem 1rem;

  .home-filters {
    background-color: #ffeadb;
    border-radius: 0.5rem;
  }
}
</style>
