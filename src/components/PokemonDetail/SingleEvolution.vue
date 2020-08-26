<template>
  <div class="evolution-container d-flex justify-content-around align-items-center my-4">
    <div class="evolution-container__unit">
      <img :src="getPicture(firstEvolutionName)" alt="" class="evolution-image" />
      <img src="@/assets/pokeball-dark.png" alt="" class="pokeball" />
      <p>{{capitalName(firstEvolutionName)}}</p>
    </div>

    <div class="icon">
      <div class="arrow"></div>
    </div>

    <div class="evolution-container__unit">
      <img :src="getPicture(secondEvolutionName)" alt="" class="evolution-image" />
      <img src="@/assets/pokeball-dark.png" alt="" class="pokeball" />
      <p>{{capitalName(secondEvolutionName)}}</p>
    </div>
  </div>

</template>

<script>
import { capitalString, formatId } from '@/utils/functions.js';

export default {
  props: ['firstEvolutionName', 'secondEvolutionName'],
  computed: {
    pokemonIds() { return this.$store.state.pokemonIds},
  },
  methods: {
    capitalName(name) { return capitalString(name);},
    getPicture(name) {
      // Find pokemon id and name according to name given in parameters
      const pokemon = this.pokemonIds.find(element => element.name === name);
      // Format id
      const id = formatId(pokemon.id);
      // Get the picture corresponding to pokemon's id
      return `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png`;
    },
  }
};
</script>

<style lang='scss' scoped>
@import '@/assets/styles/mixin';

.evolution-container {
  .icon {
    width: 50px;
    height: 50px;
    .arrow {
      position: relative;
      top: 25px;
      width: 80%;
      height: 5px;
      background-color: #2c3e50;
      @include prefix((box-shadow: 0 3px 5px rgba(0, 0, 0, .2)));

      &::after, &::before {
        content: '';
        position: absolute;
        width: 55%;
        height: 5px;
        right: -8px;
        background-color: #2c3e50;
      }

      &::after {
        top: -6px;
        transform: rotate(45deg);
      }

      &::before {
        top: 6px;
        @include prefix((box-shadow: 0 3px 5px rgba(0, 0, 0, .2)));
        transform: rotate(-45deg);
      }
    }
  }

  .evolution-container__unit {
    width: fit-content;
    text-align: center;
    position: relative;

    .evolution-image {
      width: 100px;
      display: block;
      position: relative;
      z-index: 2;
    }

    .pokeball {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 250px;
      opacity: 0.1;
    }
  }
}
</style>