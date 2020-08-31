<template>
  <div class="evolution">
    <h3 class="evolution-title">Evolution chain</h3>

    <loader v-if="loading" />

    <fragment v-else>
      <div v-if="evolutions.evolves_to && evolutions.evolves_to.length === 0">
        {{name}} has no evolution 
      </div>

      <fragment v-else>
        <!-- First(s) Evolution(s) -->
        <div v-for="evolution in evolutions.evolves_to" :key="evolution.species.name">
          <single-evolution
            :firstEvolutionName="evolutions.species.name"
            :secondEvolutionName="evolution.species.name"
          />

          <!-- Second(s) Evolution(s) -->
          <fragment v-if="evolution.evolves_to.length > 0">
            <div v-for="nextEvolution in evolution.evolves_to" :key="nextEvolution.species.name">
              <single-evolution
                :firstEvolutionName="evolution.species.name"
                :secondEvolutionName="nextEvolution.species.name"
              />
            </div>
          </fragment>
        </div>
      </fragment>

    </fragment>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Fragment } from 'vue-fragment'
import Loader from '@/components/Loader';
import SingleEvolution from './SingleEvolution';

export default {
  name: 'Evolution',
  props: ['name'],
  components: { Fragment, SingleEvolution, Loader },
  computed: mapState(['evolutions', 'evolutionUrl', 'loading'])
};
</script>

<style lang='scss' scoped>
@import '@/assets/styles/mixin';

  .evolution {
    padding: 1rem;
    height: 100%; 

    .evolution-title {
      position: relative;
      text-align: center;
      margin: 1rem 0;

      &:before {
        content: " ";
        position: absolute;
        border-bottom: 2px solid #2c3e50;
        width: 15%;
        height: 15px;
        margin-left: calc(-15% - 8px);
      }
      &:after {
        content: " ";
        position: absolute;
        border-bottom: 2px solid #2c3e50;
        width: 15%;
        height: 15px;
        margin-left: 8px;
      }
    }
  }
</style>