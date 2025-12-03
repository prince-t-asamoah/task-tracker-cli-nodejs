import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  const tasksFilePath = path.join(__dirname, "tasks.json");

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

export { addTask };
