<template>
  <div class="loader">
    <div class="loader-pokeball"></div>
  </div>
</template>

<style lang='scss' scoped>
@import '@/assets/styles/mixin';
$size: 50px;
@keyframes bounce {
  from {
    top: 45%;
  }
  50% {
    top: 50%;
  }
  to {
    top: 45%;
  }
}

.loader {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
}
.loader-pokeball {
  width: $size;
  height: $size;
  border-radius: $size;
  border: solid ($size/25) black;
  background-color: lightblue;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  @include linear-gradient(to bottom, #eeeeee, #ffffff);
  margin: 10px auto;
	animation: bounce 1000ms infinite;

  &:before,
  &:after {
    content: "";
    display: block;
  }

  &,
  &:before,
  &:after {
    transition: all 600ms cubic-bezier(0.67, 0.4, 0.36, 0.75);
  }

  &:before {
    width: 46px;
    height: ($size/2) - ($size/25/2);
    border-bottom: solid ($size/25) black;
    border-radius: ($size/2) ($size/2) 0 0;
    @include linear-gradient(to bottom, #d10000, #ff0000);
  }

  &:after {
    content: "";
    width: $size/5;
    height: $size/5;
    @include linear-gradient(to bottom, #fff, #ccc);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    box-shadow: 0 0 0 ($size/50) black, 0 0 0 ($size/25) #ddd,
      0 0 0 ($size/14) black, 0 0 ($size/10) ($size/17) rgba(0, 0, 0, 0.4);
  }
}
</style>