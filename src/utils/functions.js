/* 
 * @param {string}
 * @returns {string} with first letter capitalized
*/
export const capitalString = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/* 
 * @param {id} pokemon's id
 * @returns {string} pokemon's id with 00 or 0 at the beginning if id is under 10 or 100, else return the id without changing it
*/
export const formatId = (id) => {
  if(!id) return '';
  if(id < 10) return `00${id}`;
  if(id < 100) return `0${id}`;
  return id;
}

/* 
 * @param {string} pokemon's name
 * change classes of every element with pokemon's name in its classList
*/
export const updatePokemonClass = (pokemon) => {
  // Find all pokemons with the same class as target pokemon
  const samePokemons = document.querySelectorAll(`.${pokemon}`);
  samePokemons.forEach(currentPokemon => {
    // For each pokemon found, change its classes to prevent drag and drop or click events
    currentPokemon.classList.remove('drag-item');
    currentPokemon.classList.add('inactive-drag', 'inactive-click');
  })
}