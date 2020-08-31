<template>
  <router-link :to="`/pokemon/${pokemon.id}`" class="pokemon-link">
    <b-card
      :title="pokemonTitle"
      :img-src="`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemonId}.png`"
      :img-alt="pokemon.name"
      tag="article"
      class="p-2 m-2 text-center rounded"
    >
      <img src="@/assets/pokeball.png" alt="" class="pokeball" />
      <b-card-text  v-for="type in pokemon.types" :key="type.slot" :class="type.type.name">
        {{type.type.name}}
      </b-card-text>
    </b-card>
  </router-link>
</template>

<script>
import { capitalString, formatId } from '@/utils/functions.js';

export default {
  props: ["pokemon"],
  computed: {
    pokemonTitle() {
      return `#${this.pokemonId} ${capitalString(this.pokemon.name)}`
    },
    pokemonId() {
      return formatId(this.pokemon.id)
    }
  },
};
</script>

<style lang='scss' scoped>
@import '@/assets/styles/mixin';
@import '@/assets/styles/types';

  .pokemon-link {
    color: #2c3e50;

    &:hover {
      text-decoration: none;
    }
  }

  .card {
    @include linear-gradient(to bottom right, #ff9a9e, #c00d0d);
    position: relative;
    z-index: 2;
    max-width: 18rem;
    cursor: pointer;
    text-align: center;

    &:hover {
      background: rgba(#c00d0d, 0.6);
      color: #fff;
    }
  }

  .card-text {
    text-transform: uppercase;
    width: fit-content;
    margin: 0.5rem auto;
    padding: 0.5rem;
    color: #fff;
    border-radius: 0.5rem;
    @include prefix((text-shadow: 10px 10px 20px #000));
  }

  .pokeball {
    position: absolute;
    top: -5%;
    left: -8%;
    z-index: -1;
    opacity: 0.5;
    height: 70%;
  }
</style>