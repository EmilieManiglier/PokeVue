<template>
  <div class="home">
    <Loader v-if="loading"/>

    <div v-else>
      <search />

      <!-- if no pokemon has been searched or if a type has been searched -->
      <div v-if="pokemons.length > 0">
        <!--if there's an error, display error message -->
        <error v-if="error" :search="searchPokemon" />

        <!--Else, if there's no error, display list -->
        <div v-else class="d-flex flex-wrap justify-content-center">
          <b-card-group v-for="pokemon in pokemons" :key="pokemon.data.id">
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
      </div>

      <!-- Else, if a pokemon has been searched  -->
      <div v-else class="d-flex justify-content-center">
        <!--if there's an error, display error message -->
        <error v-if="error" :search="searchPokemon" />

        <!--Else, if there's no error, display pokemon -->
        <pokemon v-else :pokemon="pokemon" />
      </div>
    </div>
  </div>
</template>

<script>
import Pokemon from '@/components/Home/Pokemon'
import Search from '@/components/Home/Search'
import Error from '@/components/Home/Error'
import Observer from '@/components/Observer'
import Loader from '@/components/Loader'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  components: { Pokemon, Search, Error, Loader, Observer },
  data() {
    return {
      // offset used to display pokemons
      offset: 0,
      showSpinner: true
    }
  },
  computed: mapState([
    'pokemons',
    'pokemon',
    'loading',
    'error',
    'searchPokemon',
    'searchType'
  ]),
  methods: {
    loadMore() {
      /* Stops infinite scroll if offset is above 780 
      because there is no datas for pokemon last generation in the pokeAPI
      */
      if(this.offset <= 780) {
        // If offset is under 780
        // Increment offset by 20
        this.offset += 20;        
        // Load the 20 next pokemons whenever we reach bottom of the screen
        this.$store.dispatch('loadPokemons', this.offset);
      }
      else {
        // Hide spinner since there are no more pokemons to load
        this.showSpinner = false;
      }
    },
  },
  created() {
    // Load the 20 first pokemons
    this.$store.dispatch('loadPokemons', this.offset);
  },
}
</script>

<style lang="scss" scoped>
.home {
  padding: 2rem 1rem;
}
</style>
