<template>
  <fragment>
    <loader v-if="loading" />

    <div v-else class="d-md-flex container mx-auto">
    <router-link to="/" aria-label="Back to home" class="back-link">
      Back
    </router-link>
    
      <div class="pt-2 text-center pokemon-info d-md-flex flex-md-column align-items-md-center justify-content-md-center" :class="`${firstType}-light`">
        <b-button
          aria-label="previous pokemon"
          class="previous"
          name="previous"
          @click="onClick"
          :disabled="id == '1'"
        >
          &#60; Previous
        </b-button>

        <b-button
          aria-label="next pokemon"
          class="next"
          name="next"
          @click="onClick"
          :disabled="id == '807'"
        >
          Next &#62;
        </b-button>

        <b-img class="pokemon-img" :src="`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemonId}.png`" alt=""></b-img>
        <p class="name">{{ pokemonTitle }}</p>

        <div class="d-flex flex-wrap types">
          <div
            class="type"
            :class="type.type.name"
            v-for="type in pokemon.types"
            :key="type.slot"
          >
            {{type.type.name}}
          </div>
        </div>
      </div>

      <b-card no-body>
        <b-card-header header-tag="nav">
          <b-nav card-header tabs align="center">
            <b-nav-item :active="menu.about" @click="toggleMenuLink">About</b-nav-item>
            <b-nav-item :active="menu.stats" @click="toggleMenuLink">Stats</b-nav-item>
            <b-nav-item :active="menu.evolution" @click="toggleMenuLink">Evolution</b-nav-item>
          </b-nav>
        </b-card-header>
    
        <b-card-body class="p-0">
          <about v-if="menu.about" :id="this.id" />
          <stats v-if="menu.stats" :id="this.id" />
          <evolution v-if="menu.evolution" :name="pokemon.name" />
        </b-card-body>
      </b-card>
    </div>

  </fragment>
</template>

<script>
import { capitalString, formatId } from '@/utils/functions.js'
import { mapState } from 'vuex'
import { Fragment } from 'vue-fragment'
import About from '@/components/PokemonDetail/About'
import Stats from '@/components/PokemonDetail/Stats'
import Evolution from '@/components/PokemonDetail/Evolution'
import Loader from '@/components/Loader'

export default {
  name: 'pokemonDetail',
  props: ['id'],
  components: { Fragment, Loader, About, Stats, Evolution },
  data() {
    return {
      menu: {
        about: true,
        stats: false,
        evolution: false,
      },
      params: ''
    }
  },
  computed: {
    ...mapState(['pokemon', 'loading', 'firstType']),
    pokemonTitle() {
      return `#${this.pokemonId} ${capitalString(this.pokemon.name)}`;
    },
    pokemonId() {
      return formatId(this.id);
    },
  },
  methods: {
    toggleMenuLink(event) {
      for (const link in this.menu) {
        // Set every menu link to false
        this.menu[link] = false;
        // Set current target to true to display content
        this.menu[event.currentTarget.textContent.toLowerCase()] = true;
      }
    },
    updateParams(params) {
      // Store url params id into a variable to allow modification of its value
      let id = this.id;
      // Update params value in the data depending on the button the user has clicked (next or previous)
      this.params = params;
      // Increment or decrement id
      params === 'next' ? id++ : id--;
      return id;
    },
    onClick(evt) {
      // Set pokemon next or previous id
      const id = this.updateParams(evt.currentTarget.name);
      // Change url
      this.$router.push(`/pokemon/${id}`);
    }
  },
  created() {
    this.$store.dispatch('loadSinglePokemon', this.id);
    this.$store.dispatch('loadAbout', this.id)
  },
  // We use beforeRouteUpdate to track every changes in the url
  // If there are changes, update view with the new datas
  beforeRouteUpdate(to, from, next) {
    const id = this.updateParams(this.params);
    this.$store.dispatch('loadSinglePokemon', id);
    this.$store.dispatch('loadAbout', id)    
    next();
  } 
};
</script>

<style lang='scss' scoped>
@import '@/assets/styles/mixin';
@import '@/assets/styles/types';

.container {
  margin-top: 4rem;

  .back-link {
    display: inline-block;
    background-color: #c00d0d;
    color: #fff;
    border-radius: 0.5rem;
    padding: 0.5rem 1.5rem;
    margin: 0 1rem 1rem;
    height: fit-content;
  }

  .pokemon-info {
    position: relative;

    .previous, .next {
      position: absolute;
      background-color: rgba(#fff, 0.5);
      color: #2c3e50;
      border: none;
      border-radius: 0;
      width: 50%;

      &:hover {
        background-color: rgba(#fff, 1);
      }

      &:disabled {
        cursor: not-allowed;
      }
    }

    .previous {
      top: 0;
      left: 0;
    }

    .next {
      top: 0;
      right: 0;
    }
  }

  .name {
    font-weight: bold;
    font-size: 1.3rem;
  }

  .card, .card-header {
    border: none;
    border-radius: 0;
  }

  .types {
    width: 60%;
    margin: auto;

    .type {
      text-transform: uppercase;
      font-weight: bold;
      font-size: 0.8rem;
      width: fit-content;
      margin: 0.5rem auto;
      padding: 0.5rem;
      color: #fff;
      border-radius: 0.5rem;
      @include prefix((text-shadow: 10px 10px 20px #000));
    }
  }  
}
.nav-link {
  color: #515585;
}

.nav-link.active {
  color: #c00d0d;
  font-weight: bold;
}

.pokemon-img {
  width: 150px;
}

@media screen and (min-width: 768px) {
  .container {
    .types {
      width: 30%;
      margin: 0;
    }

    .pokemon-info {
      width: 60%;
      min-height: 500px;
      max-height: 500px;
    }

    .card {
      width: 80%;
      min-height: 500px;
      max-height: 500px;
      @include prefix((overflow: auto));
    }
  }
}

@media screen and (min-width: 1900px) {
  .pokemon-img {
    width: 300px;
  }
}
</style>