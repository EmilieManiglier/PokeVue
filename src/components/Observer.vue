<template>
  <div class="observer"></div>
</template>

<script>
export default {
  name: 'observer',
  data() {
    return {
      observer: null,
    }
  },
  mounted() {
    // IntersectionObserver callback function takes an array as parameter
    // As we only want first index of the array, we'll rename it entry
    this.observer = new IntersectionObserver(([entry]) => {
      // If entry is set and if we have reached a certain element (e.g bottom of screen)
      if(entry && entry.isIntersecting) {
        // emits an event whenever we're intersecting
        this.$emit('intersect');
      }
    });

    // observe current element
    this.observer.observe(this.$el);
  }
};
</script>
