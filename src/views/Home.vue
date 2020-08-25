<template>
  <div class="home">
    <div v-if="loading">
      <Loader />
    </div>

    <div v-else class="d-flex flex-wrap justify-content-center">
      <b-card-group v-for="pokemon in pokemons" :key="pokemon.data.id">
        <pokemon :pokemon="pokemon.data" />
      </b-card-group>
    </div>
  </div>
</template>

<script>
import Pokemon from '@/components/Home/Pokemon'
import Loader from '@/components/Loader'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  components: { Pokemon, Loader },
  computed: mapState([
    'pokemons',
    'loading'
  ]),
  created() {
    this.$store.dispatch('loadPokemons', 'https://pokeapi.co/api/v2/pokemon');
  }
}
</script>

<style lang="scss" scoped>
.home {
  padding: 2rem 1rem;
}
</style>
