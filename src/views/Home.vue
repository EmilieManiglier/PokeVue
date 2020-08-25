<template>
  <div class="home">
    <div v-if="loading">
      <Loader />
    </div>

    <div v-else>
      <search />
      <!-- if no pokemon has been searched, display list -->
      <div v-if="pokemons.length > 0">
        <div class="d-flex flex-wrap justify-content-center">
          <b-card-group v-for="pokemon in pokemons" :key="pokemon.data.id">
            <pokemon :pokemon="pokemon.data" />
          </b-card-group>
        </div>
  
        <Observer @intersect="loadMore" />
      </div>

      <!-- Else, if a pokemon has been searched  -->
      <div v-else class="d-flex justify-content-center">
      <!--if there's an error, display error message -->
        <div v-if="error">
          <b-alert show variant="danger" class="text-center">
            <p>Oops, looks like {{searchPokemon}} doesn't exist !</p>
            <img src="https://media1.tenor.com/images/fb21c5a0ff18e29aab890d1d1f6d6e64/tenor.gif?itemid=15357817" alt="" class="search-error-image" />
          </b-alert>
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
import Observer from '@/components/Home/Observer'
import Loader from '@/components/Loader'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  components: { Pokemon, Search, Loader, Observer },
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
    'searchPokemon'
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
  .search-error-image {
    width: 50%;
    margin-top: 1.5rem;
  }  
}
</style>
