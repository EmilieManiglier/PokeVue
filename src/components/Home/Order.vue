<template>
  <fragment>
    <b-form-select
      v-model="selected"
      :options="options"
      class="col-md-4 my-2 mx-2"
      @change="onChange"
    ></b-form-select>
  </fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'
export default {
  components: { Fragment },
  data() {
    return {
      selected: null,
      // Select options
      options: [
        { value: null, text: 'Find Pokemons by alphabetical order', disabled: true },
        { value: 'ascending', text: 'Pokemon A-Z' },
        { value: 'descending', text: 'Pokemon Z-A' },
      ]      
    }
  },
  methods: {
    onChange(order) {
      // Reset values in the state
      this.$store.commit('mutate', {property: 'maxSlice', value: 0});
      this.$store.commit('mutate', {property: 'isSorted', value: true});
      this.$store.commit('mutate', {property: 'loading', value: true});

      // Set isAsc in the datas according to the value chosen by user
      this.$store.commit('mutate', {property: 'isAsc', value: order});

      // Load pokemons by ascending or descending alphabetical order
      this.$store.dispatch('loadPokemons', {offset: 0, limit: 807});
    }
  }
};
</script>

<style lang='scss' scoped>

</style>