<template>
  <b-alert show variant="danger" class="text-center">
    <p>Oops, looks like {{search}} doesn't exist !</p>
    <img src="https://media1.tenor.com/images/fb21c5a0ff18e29aab890d1d1f6d6e64/tenor.gif?itemid=15357817" alt="" class="search-error-image" />
  </b-alert>
</template>

<script>
export default {
  name: 'Error',
  props: ['search']
}
</script>

<style lang='scss' scoped>
  .search-error-image {
    width: 50%;
    margin-top: 1.5rem;
  }  
</style>