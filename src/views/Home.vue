<template>
  <div class="home">
    <div v-if="loading">
      <Loader />
    </div>

    <div v-else class="d-flex flex-wrap justify-content-center">
      <b-card-group v-for="pokemon in pokemons" :key="pokemon.data.id">
        <pokemon :pokemon="pokemon.data" />
      </b-card-group>

      <Observer @intersect="loadMore" />

    </div>
  </div>
</template>

<script>
import Pokemon from '@/components/Home/Pokemon'
import Loader from '@/components/Loader'
import Observer from '@/components/Observer'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  components: { Pokemon, Loader, Observer },
  data() {
    return {
      // offset used to display pokemons
      offset: 0,
    }
  },
  computed: mapState([
    'pokemons',
    'loading'
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
