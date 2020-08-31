<template>
  <div class="text-center text-light container">
    <h2 class="title">404 <br /> Pokemon not found</h2>
    <b-img src="https://pa1.narvii.com/6393/74e6e3acab01b5b00a308385298bec51f5acc1aa_hq.gif" alt="" fluid />
    <router-link to="/" aria-label="Back to home" class="back-link">
      Back home
    </router-link>
  </div>
</template>

<style lang='scss' scoped>
.title {
  font-size: 2rem;
  margin: 2rem 0;
}

.back-link {
  display: block;
  background-color: #c00d0d;
  color: #fff;
  border-radius: 0.5rem;
  padding: 0.5rem 1.5rem;
  margin: 1rem auto;
  width: fit-content;
}
</style>