import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tasksfileName = "tasks.json";
const tasksFilePath = path.join(__dirname, tasksfileName);

/**
 *  A task object data model
 * @typedef {Object} Task
 * @property {string} id - Task id
 * @property {string} description - Task description
 * @property {string} status - Task status
 * @property {string} createdAt - Task creation timestamp
 * @property {string} updatedAt -  Task update timestamp
 */

/**
 * Adds a new task to task list.
 *
 * @param {string} description - The task description
 * @returns {void}
 */
const addTask = (description = "No description") => {
  const date = new Date().toISOString();
  const newTask = {
    id: String(crypto.randomUUID()),
    description: description,
    status: "to-do",
    createdAt: date,
    updatedAt: date,
  };

  let currentTasks = [];

  // Get current tasks list
  const jsonFileContent = fs.readFileSync(tasksFilePath, "utf-8");

  // Parse tasks json file and add new task to current tasks list
  try {
    currentTasks = JSON.parse(jsonFileContent);
    currentTasks.push(newTask);
  } catch (error) {
    console.error(`Error parsing file:${tasksFilePath} JSON: ${error}`);
  }

  // Save updated current tasks to json file
  try {
    fs.writeFileSync(
      tasksFilePath,
      JSON.stringify(currentTasks, null, 2),
      "utf-8"
    );
    console.log(`Task added successfully (ID:${newTask.id})`);
  } catch (error) {
    console.error(`Error writing to JSON file: ${tasksFilePath}`);
  }
};

/**
 * List all saved tasks.
 *
 * @returns {void}
 */
const listAllTask = () => {
  try {
    const tasksFileJson = fs.readFileSync(tasksFilePath, "utf-8");
    const allTasks = JSON.parse(tasksFileJson);
    console.log(allTasks);
  } catch (error) {
    console.error(`Error listing all tasks: ${error.message}`);
  }
};

/**
 * Remove task by id
 *
 * @param {string} taskId
 * @returns {void}
 */
const deleteTask = (taskId) => {
  if (!taskId) {
    console.error("Error: Task id must be provided to delete a task");
    return;
  }
  try {
    const tasksFileJson = fs.readFileSync(tasksFilePath, "utf-8");

    /**@type {Array<Task>} */
    const allTasks = JSON.parse(tasksFileJson);

    // Check if task with id exist
    const task = allTasks.find((task) => task.id === taskId);
    if (!task) {
      console.log(`Task with id: ${taskId} not found.`);
      return;
    }

    // Remove task by id and write current changes to task file
    const currentTasks = allTasks.filter((task) => task.id !== taskId);
    fs.writeFileSync(
      tasksFilePath,
      JSON.stringify(currentTasks, null, 2),
      "utf-8"
    );
    console.log(`Task with id: ${taskId} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting task with id ${taskId}`, error.message);
  }
};

export { addTask, listAllTask, deleteTask };
