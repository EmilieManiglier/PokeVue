<template>
  <div role="tablist">
    <b-card no-body class="mb-1" v-for="location in locations" :key="location.data.id">
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
        visible
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
              :key="pokemon.id"
              :class="`drag-item ${pokemon.pokemon.name}`"
            >
              <pokemon-sprite 
                :src="getPokemonImage(pokemon.pokemon.url)"
                :alt="pokemon.pokemon.name"
                :id="`${location.data.name}-pokemon-${pokemon.pokemon.name}`"
                :content="pokemon.pokemon.name"
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
</template>

<script>
import draggable from "vuedraggable";
import Observer from '@/components/Observer'
import PokemonSprite from '@/components/Location/PokemonSprite'
import { mapState } from 'vuex' 

export default {
  props: ['updatePokemonClass', 'capturedPokemon', 'removeHyphen', 'getPokemonImage'],
  components: { draggable, Observer, PokemonSprite },
  computed: mapState(['locations']),
  data() {
    return {
      offset: 0,
      showSpinner: true,
    }
  },
  methods: {
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
    onRemove(evt) {
      // Emit an event to parent component when a pokemon is removed from location list
      this.$emit('drag', evt);
    },
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