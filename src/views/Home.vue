<template>
  <div class="home">
    <div v-if="loading">
      <Loader />
    </div>

    <div v-else>
      <search />

      <!-- if no pokemon has been searched or if a type has been searched -->
      <div v-if="pokemons.length > 0">
        <!--if there's an error, display error message -->
        <div v-if="error">
          <error :search="searchPokemon" />
        </div>

        <!--Else, if there's no error, display list -->
        <div v-else class="d-flex flex-wrap justify-content-center">
          <b-card-group v-for="pokemon in pokemons" :key="pokemon.data.id">
            <pokemon :pokemon="pokemon.data" />
          </b-card-group>
        </div>

        <!-- Prevent infinite scroll if we display list by pokemon's type  -->
        <div v-if="!searchType">
          <Observer @intersect="loadMore" />
        </div>
      </div>

      <!-- Else, if a pokemon has been searched  -->
      <div v-else class="d-flex justify-content-center">
      <!--if there's an error, display error message -->
        <div v-if="error">
          <error :search="searchPokemon" />
        </div>

        <!--Else, if there's no error, display pokemon -->
        <div v-else>
          <pokemon :pokemon="pokemon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pokemon from '@/components/Home/Pokemon'
import Search from '@/components/Home/Search'
import Error from '@/components/Home/Error'
import Observer from '@/components/Home/Observer'
import Loader from '@/components/Loader'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  components: { Pokemon, Search, Error, Loader, Observer },
  data() {
    return {
      // offset used to display pokemons
      offset: 0,
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
      // Load the 20 next pokemons whenever we reach bottom of the screen
      this.offset += 20;
      this.$store.dispatch('loadPokemons', this.offset);
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
