<template>
  <div class="mt-4 mx-2">
    <loader v-if="loading" />

    <div v-else class="container-fluid d-md-flex flex-md-row-reverse justify-content-md-around">
      <div class="captured-container sticky-top row mt-4 col-md-6">
        <drop
          :getPokemonImage="getPokemonImage"
        />
      </div>

      <div class="mt-4 row col-md-4">
        <drag 
          @drag="handleDrag"
          :removeHyphen="removeHyphen"
          :getPokemonImage="getPokemonImage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex' 
import { updatePokemonClass } from '@/utils/functions.js'
import Loader from '@/components/Loader'
import Drag from '@/components/Location/Drag'
import Drop from '@/components/Location/Drop'

export default {
  name: "location",
  components: { Loader, Drag, Drop },
  computed: mapState(['locations', 'loading']),
  methods: {
    removeHyphen(string) {
      // Remove all hyphens from a string
      return string.replace(/-/g, ' ');
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
      // Change dragged element classes to prevent it from being drag and drop or clicked again
      updatePokemonClass(evt.item.lastElementChild.alt);

      // Get location name from element id and update state
      const string = evt.item.lastElementChild.id.split('-pokemon-');
      const location = this.removeHyphen(string[0]);
      this.$store.commit('mutate', {property: 'capturedLocation', value: location})
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