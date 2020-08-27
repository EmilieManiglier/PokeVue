<template>
  <div class="mt-4 mx-2">
    <loader v-if="loading" />

    <div v-else class="container-fluid d-md-flex flex-md-row-reverse justify-content-md-around">
      <div class="captured-container sticky-top row mt-4 col-md-6">
        <b-card header="Captured Pokemons" class="w-100 text-center" no-body>
            <b-card-text class="p-4">Select Pokemons that you have already captured or drop them here</b-card-text>

            <draggable
              class="dragArea d-flex flex-wrap justify-content-center drop-container"
              :list="capturedPokemon"
              :group="{ name: 'pokemon', pull: false, put: true }"
            >
              <div
                v-for="pokemon in capturedPokemon"
                :key="pokemonId(pokemon.pokemon.name)"
              >
                <b-card-img
                  :src="getPokemonImage(pokemon.pokemon.url)"
                  :alt="pokemon.pokemon.name"
                  :id="pokemon.pokemon.name"
                  class="pokemon-sprite"
                />
                <b-tooltip :target="pokemon.pokemon.name" triggers="hover">
                  <span class="tooltip-pokemon">{{pokemon.pokemon.name}}</span>
                </b-tooltip>
              </div>
              <img src="@/assets/pokeball.png" alt="" class="pokeball" />
            </draggable>

        </b-card>
      </div>

      <div class="mt-4 row col-md-4">
        <div role="tablist">
          
          <b-card no-body class="mb-1" v-for="location in locations" :key="location.data.id">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button block v-b-toggle="`accordion-${location.data.id}`" class="btn-location">{{removeHyphen(location.data.name)}}</b-button>
            </b-card-header>

            <b-collapse :id="`accordion-${location.data.id}`" visible accordion="my-accordion" role="tabpanel">
              <b-card-body>

                <draggable
                  class="d-flex flex-wrap justify-content-center drag-container"
                  v-model="location.data.pokemon_encounters"
                  :group="{ name: 'pokemon', pull: 'clone', put: false }"
                  draggable=".drag-item"
                  @remove="handleDrag"
                >
                  <div v-for="pokemon in location.data.pokemon_encounters" :key="pokemon.id" :class="`drag-item ${pokemon.pokemon.name}`">
                    <b-card-img
                      :src="getPokemonImage(pokemon.pokemon.url)"
                      :alt="pokemon.pokemon.name"
                      :id="`${location.data.name}-${pokemon.pokemon.name}`"
                      class="pokemon-sprite"
                    />
                    <b-tooltip :target="`${location.data.name}-${pokemon.pokemon.name}`" triggers="hover">
                      <span class="tooltip-pokemon">{{pokemon.pokemon.name}}</span>
                    </b-tooltip>
                  </div>
                </draggable>

              </b-card-body>
            </b-collapse>
          </b-card>

          <div v-if="showSpinner" class="text-center">
            <div class="spinner-border text-light" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <observer @intersect="loadMore" />
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '@/components/Loader'
import Observer from '@/components/Observer'
import draggable from "vuedraggable";
import { mapState } from 'vuex'

export default {
  name: "location",
  components: { Loader, Observer, draggable },
  data() {
    return {
      offset: 0,
      showSpinner: true,
      capturedPokemon: []
    }
  },
  computed: mapState(['locations', 'loading']),
  methods: {
    removeHyphen(string) {
      // Remove all hyphens from a string
      return string.replace(/-/g, ' ');
    },
    updatePokemonClass(pokemon) {
      // Get all element having the same class (which is pokemon's name) as event target
      const samePokemons = document.querySelectorAll(`.${pokemon}`);
      samePokemons.forEach(currentPokemon => {
        // For each pokemon found, change its classes to prevent it to be drag and drop again
        currentPokemon.classList.remove('drag-item');
        currentPokemon.classList.add('inactive-drag');
      })
    },
    loadMore() {
      // Allow infinite scroll until offset reaches 680
      if(this.offset <= 680) {
        // Load the 20 next location whenever we reach bottom of the screen
        this.offset += 20;
        this.$store.dispatch("loadLocations", this.offset);

        this.capturedPokemon.forEach(pokemon => {
          this.updatePokemonClass(pokemon.pokemon.name)
        })
      }
      else {
        // Hide spinner since there are no more locations to load
        this.showSpinner = false;
      }
    },
    getPokemonImage(url) {
      // Cut the url bebore and after pokemon/
      const idFromUrl = url.split('pokemon/');
      // Remove last char (/) in the last part of the string to get only pokemon id
      const id = idFromUrl[1].slice(0, -1);
      // Return pokemon sprite url
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    },
    handleDrag(evt) {
      this.updatePokemonClass(evt.item.lastElementChild.alt);
    },
    pokemonId(pokemon) {
      /* 
      A same pokemon can be on several locations so if we oonly put pokemon's name as id for the tooltip
      It will only work for the first location, if we try to hover the same pokemon on an other location 
      we won't be able to see the tooltip
      Therefore, the id has to be unique for each pokemon on each location
      To do so, we'll generate a random number and use it for the id
      */
      return `${pokemon}-${Math.floor(Math.random() * Math.floor(300))}`
    }
  },
  created() {
    this.$store.dispatch("loadLocations", this.offset);
  }
};
</script>

<style lang='scss' scoped>
.captured-container {
  max-height: 500px;
  margin-bottom: 2rem;

  .card-header {
    background-color: #c00d0d;
    color: #fff;
    font-weight: bold;
  }
}
.btn.btn-location {
  text-transform: capitalize;
  background-color: #c72c41;
  border-color: #801336;

  &:hover {
    background-color: #801336;
  }
}

.tooltip-pokemon {
  text-transform: capitalize;
}

.drag-item {
  cursor: pointer;
}

.inactive-drag{
  filter: grayscale(100%);
  cursor: not-allowed;
}

.pokemon-sprite {
  position: relative;
  z-index: 2;
}

.drop-container {
  background-color: rgba(#ec625f, 0.5);
  margin: 0 0.5rem 0.5rem;
  min-height: 300px;
  max-height: 400px;
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
</style>