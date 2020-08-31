<template>
  <div class="about">
    <p class="about-description">{{ description }}</p>
    <div class="about-datas">
      <h3 class="about-datas__title">Pokédex Data</h3>
      
      <div v-for="(value, name) in about" :key="name">
        <div class="data-container">
          <span class="data-name">{{ name }}</span>
          {{ value }}
        </div>
      </div>

      <div class="data-container">
        <span class="data-name">Abilities</span>
        <div class="ability">
          <div v-for="(ability, index) in trueAbilities" :key="ability.slot">
            {{ index+1 }}. {{ ability.ability.name }}
          </div>
        </div>
      </div>

      <div class="data-container">
        <span class="data-name">Hidden abilities</span>
        <div v-if="hiddenAbilities.length > 0" class="ability" > 
          <div v-for="ability in hiddenAbilities" :key="ability.slot">
            {{ ability.ability.name }}
          </div>
        </div>

        <div v-else>None</div>
      </div>
      
    </div>

    <div class="about-datas">
      <h3 class="about-datas__title">Training</h3>
      <div v-for="(value, name) in training" :key="name">
        <div class="data-container">
          <span class="data-name">{{ name }}</span>
          {{ value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: ['id'],
  computed: {
    ...mapState(['description', 'about', 'abilities', 'training']),
    trueAbilities() {
      if (!this.abilities) return [];
      return this.abilities.filter(
        ability => ability.is_hidden === false
      );      
    },
    hiddenAbilities() {
      if (!this.abilities) return [];
      return this.abilities.filter(
        ability => ability.is_hidden === true
      );
    }    
  }
};
</script>

<style lang='scss' scoped>
.about {
  background-color: #f7f7f7;
  padding: 1rem;
  border-top-right-radius: 1rem;
  border-top-left-radius: 1rem;
  height: 100%; 

  .about-description {
    text-align: center;
    line-height: 125%;
  }


  .about-datas {
    .about-datas__title {
      position: relative;
      text-align: center;
      margin: 2rem 0;

      &:before {
        content: " ";
        position: absolute;
        border-bottom: 2px solid rgba(#2c3e50, 0.4);
        width: 18%;
        height: 15px;
        margin-left: calc(-18% - 8px);
      }
      &:after {
        content: " ";
        position: absolute;
        border-bottom: 2px solid rgba(#2c3e50, 0.4);
        width: 18%;
        height: 15px;
        margin-left: 8px;
      }
    }

    .data-container {
      margin: 1.25rem 0;
    }

    .data-name {
      font-weight: bold;
      font-size: 0.9rem;
      display: inline-block;
      min-width: 120px;
      max-width: 120px;
    }

    .ability {
      margin-left: 0.25rem;
      display: inline-block;
      width: fit-content;
      text-transform: capitalize;


      .hidden {
        font-size: 0.8rem;
      }
    }
  }
}

@media screen and (min-width: 768px) {
  .about .about-datas {
    .data-container {
      width: 60%;
      margin: 1rem auto;
    }

    .data-name {
      margin-right: 2rem;
    }
  }
}
</style>