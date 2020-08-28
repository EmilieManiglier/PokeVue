<template>
  <div class="mt-4 mx-2">
    <loader v-if="loading" />

    <div v-else class="container-fluid d-md-flex flex-md-row-reverse justify-content-md-around">
      <div class="captured-container sticky-top row mt-4 col-md-6">
        <drop
          :getPokemonImage="getPokemonImage"
          :capturedPokemon="capturedPokemon"
          :caputeredLocation="caputeredLocation"
        />
      </div>

      <div class="mt-4 row col-md-4">
        <drag 
          @drag="handleDrag"
          :updatePokemonClass="updatePokemonClass"
          :removeHyphen="removeHyphen"
          :getPokemonImage="getPokemonImage"
          :capturedPokemon="capturedPokemon"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '@/components/Loader'
import Drag from '@/components/Location/Drag'
import Drop from '@/components/Location/Drop'
import { mapState } from 'vuex' 

export default {
  name: "location",
  components: { Loader, Drag, Drop },
  data() {
    return {
      caputeredLocation: '',
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
    getPokemonImage(url) {
      // Cut the url bebore and after pokemon/
      const idFromUrl = url.split('pokemon/');
      // Remove last char (/) in the last part of the string to get only pokemon id
      const id = idFromUrl[1].slice(0, -1);
      // Return pokemon sprite url
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    },
    handleDrag(evt) {
      // Change dragged element classes to prevent it from being drag and drop again
      this.updatePokemonClass(evt.item.lastElementChild.alt);
      // Get location name from element id
      const string = evt.item.lastElementChild.id.split('-pokemon-');
      const location = this.removeHyphen(string[0]);
      this.caputeredLocation = location;
    },
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
}
</style>