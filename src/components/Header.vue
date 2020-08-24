<template>
  <header class="header">
    <b-navbar toggleable="md">
      <b-navbar-toggle target="nav-text-collapse" class="nav-btn">
        <span></span>
        <span></span>
        <span></span>

        <div class="miniButtonGlass-container">
          <div class="miniButtonGlass miniButtonGlass1"></div>
          <div class="miniButtonGlass miniButtonGlass2"></div>
          <div class="miniButtonGlass miniButtonGlass3"></div>
        </div>
      </b-navbar-toggle>

      <b-navbar-brand to="/">
        <h1>PokeVue</h1>
      </b-navbar-brand>

      <b-collapse id="nav-text-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/routes">Localisation</b-nav-item>
          <b-nav-item to="/types" disabled>Types</b-nav-item>
          <b-nav-item to="" disabled>Items</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </header>
</template>

<style lang='scss' scoped>
@import '@/assets/styles/mixin';
@import '@/assets/styles/hamburger';

@font-face {
	font-family: "Pokemon";
	src: url("~@/assets/fonts/Pokemon Solid.ttf");
}

.header {
  background-color: #c00d0d;
  padding: 1rem 0.5rem;
  text-align: center;
  @include prefix((box-shadow: 0 10px 2px #490000));
  @include hamburger-style;

  h1 {
    font-family: "Pokemon", sans-serif;
		font-size: 1.8rem;
    color: #2c3e50;
    @include prefix((text-shadow: 0 0 4px #fff));
  }

  .miniButtonGlass-container {
    @include flexbox;
    position: absolute;
    top: 0;
    right: -220%;
  }

  .miniButtonGlass {
		width: 15px;
    height: 15px;
		margin-right: 0.5rem;
		@include prefix((box-shadow: 0 0 10px #490000));
		@include prefix((border-radius: 20px));		
	}

	.miniButtonGlass1 {
		@include radial-gradient(#fb7b7b, #fb0505);
	}

	.miniButtonGlass2 {
		@include radial-gradient(#fbfb9b, #fbfb05);
	}

	.miniButtonGlass3 {
		@include radial-gradient(#b0fb7b, #50fb05);
  }
  
  .nav-link {
    color: #fff;
    font-weight: bold;
  }
}
</style>