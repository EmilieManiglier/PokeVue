<template>
  <b-card header="Captured Pokemons" class="w-100 text-center" no-body>
    <b-card-text class="p-4">Select Pokemons that you have already captured or drop them here</b-card-text>

    <draggable
      class="dragArea d-flex flex-wrap justify-content-center drop-container"
      :list="capturedPokemon"
      :group="{ name: 'pokemon', pull: false, put: true }"
    >
      <div v-for="pokemon in capturedPokemon" :key="pokemonId(pokemon.pokemon.name)">
        <pokemon-sprite 
          :src="getPokemonImage(pokemon.pokemon.url)"
          :alt="pokemon.pokemon.name"
          :id="pokemon.pokemon.name"
          :content="`${pokemon.pokemon.name} captured in ${caputeredLocation}`"
        />
      </div>
      <img src="@/assets/pokeball.png" alt class="pokeball" />
    </draggable>
  </b-card>
</template>

<script>
import draggable from "vuedraggable";
import PokemonSprite from '@/components/Location/PokemonSprite'

export default {
  props: ['getPokemonImage', 'capturedPokemon', 'caputeredLocation'],
  components: { draggable, PokemonSprite},
  methods: {
    pokemonId(pokemon) {
      /* 
      A same pokemon can be on several locations so if we only put pokemon's name as key
      There will be an error if the same pokemon is dropped again
      Therefore, we'll generate a random number and use it for the key to make it unique
      */
      return `${pokemon}-${Math.floor(Math.random() * Math.floor(300))}`
    }
  }
};
</script>

<style lang='scss' scoped>
.card-header {
  background-color: #c00d0d;
  color: #fff;
  font-weight: bold;
}

.drop-container {
  background-color: rgba(#ec625f, 0.5);
  margin: 0 0.5rem 0.5rem;
  min-height: 200px;
  max-height: 300px;
  overflow: auto;
  position: relative;


  .pokeball {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.3;
  }
}

@media screen and (min-width: 768px) {
  .drop-container {
    min-height: 400px;
    max-height: 500px;
  }
}
</style>