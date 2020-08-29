<template>
  <fragment>
    <b-card-img
      :src="src"
      :alt="alt"
      :id="id"
      :content="content"
      :class="`pokemon-sprite ${alt}`"
      @click="handleClick"
    />
    <b-tooltip :target="id" triggers="hover">
      <span class="tooltip-pokemon">{{content}}</span>
    </b-tooltip>
  </fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'
import { updatePokemonClass } from '@/utils/functions.js'

export default {
  props: ['src', 'alt', 'id', 'content', 'url'],
  components: { Fragment },
  methods: {
    handleClick(evt) {
      /* 
        Check if the element on which we clicked contains ('-pokemon-')
        => it means that it comes from the Drag component
        (prevents action on pokemon in the Drop component because it has already been captured)
        Also check if target element doesn't have inactive-click class
        => It means that it hasn't been selected before
        (prevents action on pokemon that have been clicked once)
      */
      if(evt.currentTarget.id.includes('-pokemon-') && !evt.currentTarget.classList.contains('inactive-click')) {
        // Get id from pokemon url
        const idFromUrl = this.url.split('pokemon/');
        // Remove last char (/) in the last part of the string to get only pokemon id
        const id = idFromUrl[1].slice(0, -1);

        // Create an object with pokemon's name and url
        // It must be in the same format as object received from PokeAPI
        const pokemon = {
          pokemon: {
            name: evt.currentTarget.alt,
            url: `https://pokeapi.co/api/v2/pokemon/${id}/`
          }
        }
        // Update capturedPokemon array with the new pokemon in order to display it on Drop component
        this.$store.commit('mutateArray',{property: 'capturedPokemon', value: pokemon, iterate: false});

        // Change target Element classes in order to prevent drag and drop and click events
        updatePokemonClass(evt.currentTarget.alt);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tooltip-pokemon {
  text-transform: capitalize;
}

.pokemon-sprite {
  position: relative;
  z-index: 2;
}
</style>