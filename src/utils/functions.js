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