import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { addTask, deleteTask, listAllTask, markTaskStatus, updateTask } from "./commands.js";

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const args = process.argv.slice(2);
  const command = args[0] || ""; // For no command available
  const params = args.slice(1);

  const tasksFilePath = path.join(__dirname, "tasks.json");
  //Creates tasks json file if does not exist
  if (!fs.existsSync(tasksFilePath)) {
    fs.writeFileSync(tasksFilePath, "[]", "utf-8");
  }

  switch (command) {
    case "add":
      addTask(params[0]);
      break;
    case "list":
      const status = params[0];
      listAllTask(status);
      break;
    case "delete":
      deleteTask(params[0]);
      break;
    case "update":
      const taskId = params[0];
      const description = params[1];
      updateTask(taskId, description);
      break;
    case "mark-done":
    case 'mark-to-do':
    case 'mark-in-progress':
      const markStatus = command.split('mark-')[1] // Get the status
      markTaskStatus(params[0], markStatus);
      break;
    case "help":
    default:
      // Get the cli instructions

      const instructions = fs.readFileSync(
        path.join(__dirname, "instructions.txt")
      );

      console.log(instructions.toString());
  }
}

// Run main application
main();
