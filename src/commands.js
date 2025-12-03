// Cli commands implementations goes here

/**
 * Adds a new task to task list.
 *
 * @param {string} description - The task description
 * @returns {void}
 */
const addTask = (description = 'No description') => {
    const date = new Date().toISOString();
    const newTask = { 
        id: String(crypto.randomUUID()),
        description: description,
        status: 'to-do',
        createdAt: date,
        updatedAt: date
    }
  console.log(newTask);
};

export { addTask };