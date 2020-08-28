<template>
  <b-card header="Captured Pokemons" class="w-100 text-center" no-body>

    <draggable
      class="dragArea mt-2 d-flex flex-wrap justify-content-center drop-container"
      :list="capturedPokemon"
      :group="{ name: 'pokemon', pull: false, put: true }"
    >
      <fragment v-if="capturedPokemon.length === 0">
        <b-card-text class="p-4">Click on the Pokemons that you have captured or drop them here</b-card-text>
      </fragment>

      <fragment v-else>
        <div v-for="pokemon in capturedPokemon" :key="pokemonId(pokemon.pokemon.name)">
          <pokemon-sprite 
            :src="getPokemonImage(pokemon.pokemon.url)"
            :alt="pokemon.pokemon.name"
            :id="pokemon.pokemon.name"
            :content="`${pokemon.pokemon.name} captured in ${capturedLocation}`"
          />
        </div>
      </fragment>
      <img src="@/assets/pokeball.png" alt class="pokeball" />
    </draggable>
    
  </b-card>
</template>

<script>
import draggable from "vuedraggable";
import { mapState } from 'vuex' 
import { Fragment } from 'vue-fragment'
import PokemonSprite from '@/components/Location/PokemonSprite'

export default {
  props: ['getPokemonImage'],
  computed: mapState(['capturedPokemon', 'capturedLocation']),
  components: { draggable, Fragment, PokemonSprite},
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
  min-height: 280px;
  max-height: 350px;
  overflow: auto;
  position: relative;

  .pokeball {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.3;
    pointer-events: none;
  }
}

@media screen and (min-width: 768px) {
  .drop-container {
    min-height: 450px;
    max-height: 500px;
  }
}
</style>