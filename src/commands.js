import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TASK_FILE_NAME = "tasks.json";
const TASK_FILE_PATH = path.join(__dirname, TASK_FILE_NAME);

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
  const jsonFileContent = fs.readFileSync(TASK_FILE_PATH, "utf-8");

  // Parse tasks json file and add new task to current tasks list
  try {
    currentTasks = JSON.parse(jsonFileContent);
    currentTasks.push(newTask);
  } catch (error) {
    console.error(`Error parsing file:${TASK_FILE_PATH} JSON: ${error}`);
  }

  // Save updated current tasks to json file
  try {
    fs.writeFileSync(
      TASK_FILE_PATH,
      JSON.stringify(currentTasks, null, 2),
      "utf-8"
    );
    console.log(`Task added successfully (ID:${newTask.id})`);
  } catch (error) {
    console.error(`Error writing to JSON file: ${TASK_FILE_PATH}`);
  }
};

/**
 * List all saved tasks.
 *
 * @param {string} status - Task status (to-do, in-progress, done, all(default))
 * @returns {void}
 */
const listAllTask = (status = "all") => {
  try {
    const tasksFileJson = fs.readFileSync(TASK_FILE_PATH, "utf-8");
    const allTasks = JSON.parse(tasksFileJson);

    const getTasksByStatus = (status) =>
      allTasks.filter((task) => task.status === status);
    let filteredTasks = [];

    switch (status) {
      case "to-do":
        filteredTasks = getTasksByStatus("to-do");
        filteredTasks.length > 0
          ? console.log(filteredTasks)
          : console.log("No to-do tasks available.");
        break;
      case "in-progress":
        filteredTasks = getTasksByStatus("in-progress");
        filteredTasks.length > 0
          ? console.log(filteredTasks)
          : console.log("No in progress tasks available.");
        break;
      case "done":
        filteredTasks = getTasksByStatus("done");
        filteredTasks.length > 0
          ? console.log(filteredTasks)
          : console.log("No in progress tasks available.");
        break;
      default:
        allTasks.length > 0
          ? console.log(allTasks)
          : console.log("No task available.");
    }
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
    const tasksFileJson = fs.readFileSync(TASK_FILE_PATH, "utf-8");

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
      TASK_FILE_PATH,
      JSON.stringify(currentTasks, null, 2),
      "utf-8"
    );
    console.log(`Task with id: ${taskId} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting task with id ${taskId}`, error.message);
  }
};

/**
 * Update task description or status
 *
 * @param {string} taskId - ID of task to be deleted
 * @param {string} description - New task description
 *
 * @returns {void}
 */
const updateTask = (taskId, description) => {
  if (!taskId && !description) {
    console.log("Task id and description must be provided to update a task");
    return;
  }

  try {
    // Read and parse tasks to object
    const tasksJson = fs.readFileSync(TASK_FILE_PATH, "utf-8");
    /** @type {Array<Task>} - All task object */
    const allTasks = JSON.parse(tasksJson);

    const taskToBeUpdateIndex = allTasks.findIndex(
      (task) => task.id === taskId
    );
    if (taskToBeUpdateIndex === -1) {
      console.log(`Task with id: ${taskId} does not exist.`);
      return;
    }

    // Update current task object with new description
    /** @type {Task} - Updated task object*/
    const updatedTask = {
      ...allTasks[taskToBeUpdateIndex],
      description,
      updatedAt: new Date().toISOString(),
    };
    allTasks[taskToBeUpdateIndex] = updatedTask;

    // Save updated tasks object to file.
    fs.writeFileSync(TASK_FILE_PATH, JSON.stringify(allTasks, null, 2));
    console.log(`Task with id: ${taskId} updated successfully.`);
  } catch (error) {
    console.error(
      `Error updating task description with id ${taskId}`,
      error.message
    );
  }
};

/**
 * Marks task done by id
 *
 * @param {string} taskId - Task to be marked done id
 * @param {string} status - Task status
 * @returns {void}
 */
const markTaskStatus = (taskId, status) => {
  if (!taskId) {
    console.log(`Task id must be provided to mark a task ${status}.`);
    return;
  }

  try {
    const tasksJson = fs.readFileSync(TASK_FILE_PATH, "utf-8");
    /**@type {Array<Task>} */
    const allTasks = JSON.parse(tasksJson);

    // Search if task exist by task id
    const taskToBeUpdatedIndex = allTasks.findIndex((task) => task.id);
    if (taskToBeUpdatedIndex === -1) {
      console.log(`Task with id: ${taskId} does not exist.`);
      return;
    }

    // Update task status and save to file
    const taskToBeUpdated = allTasks[taskToBeUpdatedIndex];
    allTasks[taskToBeUpdatedIndex] = {
      ...taskToBeUpdated,
      status,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(
      TASK_FILE_PATH,
      JSON.stringify(allTasks, null, 2),
      "utf-8"
    );
    console.log(`Task with id: ${taskId} marked ${status} successfully.`);
  } catch (error) {
    console.error(
      `Error updating task status with id ${taskId}`,
      error.message
    );
  }
};

export { addTask, listAllTask, deleteTask, updateTask, markTaskStatus };
