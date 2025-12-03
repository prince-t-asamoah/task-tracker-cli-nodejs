// Application main code goes here
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { addTask } from "./commands.js";

function main() {
  const args = process.argv.slice(2);

  const command = args[0] || ""; // For no command available

  switch (command) {
    case 'add':
        addTask();
        break;
    case "help":
    default:

    // Get the cli instructions
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

      const instructions = fs.readFileSync(
        path.join(__dirname, "instructions.txt")
      );

      console.log(instructions.toString());
  }
}

// Run main application
main();
