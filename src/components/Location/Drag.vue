<template>
  <fragment>

    <autocomplete
      :items="allLocations"
      @submit-search="searchLocation"
    />

    <b-alert
      :show="error"
      dismissible
      fade
      variant="danger"
      class="w-100 text-center"
    >
      No location found.
    </b-alert>

    <div role="tablist">
      <b-card no-body class="mb-1" v-for="(location, index) in locations" :key="location.data.id">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button
            block
            v-b-toggle="`accordion-${location.data.id}`"
            class="btn-location"
          >
            {{removeHyphen(location.data.name)}}
          </b-button>
        </b-card-header>
  
        <b-collapse
          :id="`accordion-${location.data.id}`"
          :visible="index === 0 ? true : false"
          accordion="my-accordion"
          role="tabpanel"
        >
          <b-card-body>
            <draggable
              class="d-flex flex-wrap justify-content-center drag-container"
              v-model="location.data.pokemon_encounters"
              :group="{ name: 'pokemon', pull: 'clone', put: false }"
              draggable=".drag-item"
              @remove="onRemove"
            >
              <div
                v-for="pokemon in location.data.pokemon_encounters"
                :key="pokemon.pokemon.name"
                :class="`drag-item ${pokemon.pokemon.name}`"
              >
                <pokemon-sprite 
                  :src="getPokemonImage(pokemon.pokemon.url)"
                  :alt="pokemon.pokemon.name"
                  :id="`${location.data.name}-pokemon-${pokemon.pokemon.name}`"
                  :content="pokemon.pokemon.name"
                  :url="pokemon.pokemon.url"
                />
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
  </fragment>
</template>

<script>
import { mapState } from 'vuex' 
import { Fragment } from 'vue-fragment'
import draggable from "vuedraggable"
import { updatePokemonClass } from '@/utils/functions.js'
import Observer from '@/components/Observer'
import Autocomplete from '@/components/Location/Autocomplete'
import PokemonSprite from '@/components/Location/PokemonSprite'

export default {
  props: ['removeHyphen', 'getPokemonImage'],
  components: { Fragment, draggable, Observer, PokemonSprite, Autocomplete },
  computed: mapState(['locations', 'capturedPokemon', 'allLocations']),
  data() {
    return {
      offset: 0,
      showSpinner: true,
      error: false
    }
  },
  methods: {
    loadMore() {
      // Allow infinite scroll until offset reaches 680
      if(this.offset <= 680) {
        // Load the 20 next location whenever we reach bottom of the screen
        this.offset += 20;
        this.$store.dispatch("loadLocations", {offset: this.offset, limit: 20});
      }
      else {
        // Hide spinner since there are no more locations to load
        this.showSpinner = false;
      }
    },
    onRemove(evt) {
      // Emit an event to parent component when a pokemon is removed from location list
      this.$emit('drag', evt);
    },
    searchLocation(search) {
      // If search value is in allLocations array
      if(this.allLocations.indexOf(search) > -1) {
        // Send request to get location data
        // Replace every spaces in search by hyphens
        this.$store.dispatch('loadLocation', search.replace(/ /g, '-'));
        // Reset error value to hide alert message
        this.error = false;
      }
      else {
        // Else, if the value doesn't exist, display alert message
        this.error = true;
      }
    }
  },
  updated() {   
    /* 
    Whenever Drag component is updated (if we scroll to the bottom of screen or if we search for a location)
    Check if there are pokemons in the capturedPokemon array
    If yes, for each pokemon, change the class of every pokemon that has the same name in the locations list to prevent it from being  drag and drop or clicked
    */
    if(this.capturedPokemon && this.capturedPokemon.length > 0) {
      this.capturedPokemon.forEach(pokemon => {
        updatePokemonClass(pokemon.pokemon.name)
      })    
    }
  }
};
</script>

<style lang='scss' scoped>

.btn.btn-location {
  text-transform: capitalize;
  background-color: #c72c41;
  border-color: #801336;

  &:hover {
    background-color: #801336;
  }
}

.drag-item {
  cursor: pointer;
}

.inactive-drag{
  filter: grayscale(100%);
  cursor: not-allowed;
}
</style>