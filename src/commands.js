// Cli commands implementations goes here

/**
 * Adds a new task to task list.
 *
 * @param {string} description - The task description
 * @returns {void}
 */
const addTask = (description = 'No description') => {
  console.log(description);
};

export { addTask };