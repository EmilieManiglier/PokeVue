<template>
  <b-form @submit.prevent="onSubmit" class="d-flex">
    <div class="autocomplete mb-4 mr-2">
      <b-form-input
        type="text"
        @input="onChange"
        v-model.trim="search"
        @keydown.down="onArrowDown"
        @keydown.up="onArrowUp"
        @keydown.enter="onEnter"
        placeholder="Find a location"
      />
      <ul
        id="autocomplete-results"
        v-show="isOpen"
        class="autocomplete-results"
      >
        <b-list-group>
          <b-list-group-item
            v-for="(suggestion, index) in suggestions"
            :key="`${index}-${suggestion}`"
            @click="setSuggestion(suggestion)"
            class="autocomplete-suggestion"
            :class="{ 'is-active': index === arrowCounter }"
          >
            {{ suggestion }}
          </b-list-group-item>
        </b-list-group>
      </ul>
    </div>

    <b-button
      type="submit"
      class="autocomplete-btn mb-4"
      aria-label="Search location"
      :disabled="disableSearch"
    >
      Search
    </b-button>
  </b-form>
</template>

<script>
  export default {
    name: 'autocomplete',
    props: ['items'],
    data() {
      return {
        isOpen: false,
        suggestions: [],
        search: '',
        isLoading: false,
        // track which result is being selected in the suggestion list
        arrowCounter: -1, 
      };
    },
    computed: {
      disableSearch() {
        // If input is empty set disable to true to disable submit button
        return this.search === '' ? true : false;
      }
    },
    methods: {
      onChange() {
        // Open suggestions list
        this.filterSuggestions();
        this.isOpen = true;
      },
      filterSuggestions() {
        // Find every location containing search input value
        this.suggestions = this.items.filter((item) => item.indexOf(this.search.toLowerCase()) > -1);
      },
      setSuggestion(suggestion) {
        // Set the input value to the suggestion that have been clicked
        this.search = suggestion;
        // Close suggestions list
        this.isOpen = false;
      },
      onArrowDown() {
        /*         
        Decrease arrowCounter by 1 when we press the arrow up key. This way, we can get the index corresponding to the arrowCounter from the array of suggestions
        */  
        if (this.arrowCounter < this.suggestions.length) {
          this.arrowCounter += 1;
        }
      },
      onArrowUp() {
        // Decrease arrowCounter by 1 when we press the arrow up key.
        if (this.arrowCounter > 0) {
          this.arrowCounter -= 1;
        }
      },
      onEnter() {
        // Set input value to selected suggestion
        this.search = this.suggestions[this.arrowCounter];
        // Close suggestions list
        this.isOpen = false;
        // Reset arrow counter
        this.arrowCounter = -1;
      },
      handleClickOutside(evt) {
        if (!this.$el.contains(evt.target)) {
          this.isOpen = false;
          this.arrowCounter = -1;
        }
      },
      onSubmit() {
        // Replace all spaces by hyphens
        const search = this.search.replace(/ /g, '-');
        // Warn the parent component that the form was submitted
        this.$emit('submit-search', search);
        // reset input value
        this.search = '';
      }
    },
    mounted() {
      document.addEventListener('click', this.handleClickOutside)
    },
    destroyed() {
      document.removeEventListener('click', this.handleClickOutside)
    }
  };
</script>

<style lang="scss" scoped>
.list-group {
  max-height: 300px;
  overflow: auto;
}

.autocomplete-suggestion {
  cursor: pointer;
  text-align: center;
  text-transform: capitalize;
}

.autocomplete-suggestion.is-active,
.autocomplete-suggestion:hover {
  background-color: #4AAE9B;
  color: #fff;
}

.autocomplete-btn {
  min-height: 40px; 
  max-height: 40px; 
  background-color: #4AAE9B;
}
</style>