<template>
  <div>
    <div v-if="loading">
      <Loader />
    </div>
    
    <b-card v-else class="my-4 mx-2" no-body>
      <b-card-header header-tag="nav">
        <b-nav card-header tabs align="center">
          <b-nav-item :active="menu.about" @click="toggleMenuLink">About</b-nav-item>
          <b-nav-item :active="menu.stats" @click="toggleMenuLink">Stats</b-nav-item>
          <b-nav-item :active="menu.evolution" @click="toggleMenuLink">Evolution</b-nav-item>
        </b-nav>
      </b-card-header>
  
        <b-card-body class="p-0">

          <div class="pt-2 text-center" :class="`${firstType}-light`">
            <b-card-img class="pokemon-img" :src="`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemonId}.png`" alt=""></b-card-img>
            <b-card-text>
              {{ pokemonTitle }}
            </b-card-text>
    
            <b-card-text class="d-flex flex-wrap types">
              <div
                class="type"
                :class="type.type.name"
                v-for="type in pokemon.types"
                :key="type.slot"
              >
                {{type.type.name}}
              </div>
            </b-card-text>
          </div>
        
        <about v-if="menu.about" :id="this.id" />
        <stats v-if="menu.stats" :id="this.id" />

      </b-card-body>
    </b-card>
  </div>

</template>

<script>
import { capitalString, formatId } from '@/utils/functions.js'
import { mapState } from 'vuex'
import About from '@/components/PokemonDetail/About'
import Stats from '@/components/PokemonDetail/Stats'
import Loader from '@/components/Loader'

export default {
  name: 'pokemonDetail',
  props: ['id'],
  components: { Loader, About, Stats },
  data() {
    return {
      menu: {
        about: true,
        stats: false,
        evolution: false,
      }
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
    }
  },
  created() {
    this.$store.dispatch('loadSinglePokemon', this.id);
  }
};
</script>

<style lang='scss' scoped>
@import '@/assets/styles/mixin';
@import '@/assets/styles/types';

.pokemon-img {
  width: 150px;
}

.types {
  width: 80%;
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


@media screen and (min-width: 768px) {
  .types {
    width: 20%;
  }
}

@media screen and (min-width: 1900px) {
  .types {
    width: 10%;
  }
}

</style>