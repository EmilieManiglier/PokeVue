<template>
 <div class="d-flex flex-wrap justify-content-center col-md-8 mx-auto">
  <div
    v-for="type in types" 
    :key="type" 
    :class="`type ${type}`"
    :id="type"
    @click="onClick"
  >
    {{type}}
  </div>
 </div>
</template>

<script>
export default {
  data() {
    return {
      types: ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water']       
    }
  },
  methods: {
    onClick(evt) {
      this.$store.dispatch('loadTypes', evt.target.id);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/types';
@import '@/assets/styles/mixin';

.type {
  border-radius: 0.5rem;
  margin: 0.5rem;
  padding: 0.5rem;
  text-transform: capitalize;
  color: #fff;
  @include prefix((text-shadow: 10px 10px 20px #000));
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
}
</style>

