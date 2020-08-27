<template>
  <div class="mt-4 mx-2">
    <loader v-if="loading" />

    <div v-else class="container-fluid d-md-flex flex-md-row-reverse justify-content-md-around">
      <div class="captured-container sticky-top row mt-4 col-md-6">
        <b-card header="Captured Pokemons" class="w-100 text-center" no-body>
          <div class="d-flex flex-wrap justify-content-center align-items-center captured">
            <b-card-text class="p-4">Select Pokemons that you have already captured or drop them here</b-card-text>
          </div>
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
                <b-card-text class="d-flex flex-wrap justify-content-center">
                  <div v-for="pokemon in getPokemonByLocation(location.data.name)" :key="pokemon.id">
                    <b-card-img :src="pokemon.image" :alt="pokemon.name" :id="`${location.data.name}-${pokemon.name}`"></b-card-img>
                      <b-tooltip :target="`${location.data.name}-${pokemon.name}`" triggers="hover">
                        <span class="tooltip-pokemon">{{pokemon.name}}</span>
                      </b-tooltip>
                  </div>
                </b-card-text>
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
import { mapState } from 'vuex'

export default {
  name: "location",
  components: { Loader, Observer },
  data() {
    return {
      offset: 0,
      showSpinner: true
    }
  },
  computed: {
    ...mapState(['locations', 'loading']),
    pokemonData() {
      const data = [];
      this.locations.map(location => {
      // For each pokemon found in current location
        location.data.pokemon_encounters.map(pokemon => {
          // Split url after 'pokemon/'
          const idFromUrl = pokemon.pokemon.url.split('pokemon/');
          // Remove last char (/) in the string to get only pokemon id
          const id = idFromUrl[1].slice(0, -1);
          // Create an object with pokemon id, name, image and its location
          const pokemonInfo = {
            id: id,
            name: pokemon.pokemon.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
            location: location.data.name,
          }
          // Fill data array with pokemonInfo
          data.push(pokemonInfo);
        })
      })
      return data;
    },
  },
  methods: {
    getPokemonByLocation(location) {
      return this.pokemonData.filter(pokemon => pokemon.location === location)
    },
    removeHyphen(string) {
      // Remove all hyphens from a string
      return string.replace(/-/g, ' ');
    },
    loadMore() {
      // Allow infinite scroll until offset reaches 680
      if(this.offset <= 680) {
        // Load the 20 next location whenever we reach bottom of the screen
        this.offset += 20;
        this.$store.dispatch("loadLocations", this.offset);
      }
      else {
        // Hide spinner since there are no more locations to load
        this.showSpinner = false;
      }
    }
  },
  created() {
    this.$store.dispatch("loadLocations", this.offset);
  }
};
</script>

<style lang='scss' scoped>
.captured-container {
  max-height: 300px;
  overflow: auto;
  margin-bottom: 2rem;

  // .card {
  //   border-bottom: 2px solid #000;
  // }

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

</style>