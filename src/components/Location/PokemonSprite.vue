<template>
  <fragment>
    <b-card-img
      :src="src"
      :alt="alt"
      :id="id"
      :content="content"
      class="pokemon-sprite"
    />
    <b-tooltip :target="id" triggers="hover">
      <span class="tooltip-pokemon">{{content}}</span>
    </b-tooltip>
  </fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'

export default {
  props: ['src', 'alt', 'id', 'content'],
  components: { Fragment }
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