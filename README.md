# Task Tracker CLI

> A lightweight, file-backed command-line task manager — minimal dependencies, maximum velocity.

## Overview

This CLI implementation aligns with the **Task Tracker project** outlined on Roadmap.sh. For full reference, explore the official spec here:

> [https://roadmap.sh/projects/task-tracker](https://roadmap.sh/projects/task-tracker)

Task Tracker CLI is a simple, forward-thinking command-line application for tracking tasks in a JSON-backed datastore. It lets you add, update, delete, and mark tasks as `todo`, `in-progress`, or `done`. The tool is intentionally minimal: no external libraries, purely native filesystem operations, and positional CLI arguments for fast, scriptable workflows.

This repository contains a reference README to help contributors and users onboard quickly and implement the project consistently.

---

## Key Features

* Add, update, and delete tasks.
* Mark tasks as `in-progress` or `done`.
* List all tasks or filter by status (`todo`, `in-progress`, `done`).
* Persist tasks to a JSON file in the current working directory (`tasks.json`).
* Robust error handling and edge-case resilience.
* No external dependencies — implementable in any language that can read/write JSON and parse CLI args.

---

## Task Schema

Each task stored in `tasks.json` must include the following properties:

```json
{
  "id": 1,
  "description": "Buy groceries",
  "status": "todo", // allowed values: todo, in-progress, done
  "createdAt": "2025-12-03T11:00:00Z",
  "updatedAt": "2025-12-03T11:00:00Z"
}
```

* `id` — unique numeric identifier (auto-incremented).
* `description` — brief text describing the task.
* `status` — one of `todo`, `in-progress`, `done`.
* `createdAt` / `updatedAt` — ISO 8601 timestamps representing lifecycle events.

---

## CLI Specification

**Constraints**

* Use positional arguments for commands and inputs.
* Use a JSON file named `tasks.json` in the current directory as the datastore.
* If `tasks.json` does not exist, the application must create it with an empty array `[]`.
* Do **not** use external libraries or frameworks — interact with the native file system and JSON utilities.

**Exit codes & errors**

* Exit `0` on success.
* Non-zero exit codes for error cases (e.g., invalid args, I/O failure, not found).
* Provide clear, user-centric error messages.

---

## Commands & Usage

```bash
# Add a new task (positional arguments)
# CLI: task-cli add "Buy groceries"
# Output: Task added successfully (ID: 1)

# Update a task description
# CLI: task-cli update 1 "Buy groceries and cook dinner"

# Delete a task
# CLI: task-cli delete 1

# Mark a task in progress
# CLI: task-cli mark-in-progress 1

# Mark a task done
# CLI: task-cli mark-done 1

# List all tasks
# CLI: task-cli list

# List tasks by status: done, todo, in-progress
# CLI: task-cli list done
# CLI: task-cli list todo
# CLI: task-cli list in-progress
```

**Behavioral details**

* `add <description>`: Creates a new task with `status: todo`. Returns the newly assigned `id`.
* `update <id> <new description>`: Updates `description` and `updatedAt`.
* `delete <id>`: Removes the task from file. Should confirm or require explicit CLI acknowledgement pattern if implemented interactively.
* `mark-in-progress <id>` / `mark-done <id>`: Sets `status` and updates `updatedAt`.
* `list [<status>]`: If `status` provided, filter by it; otherwise list all tasks.

---

## Implementation Guidance

1. **Bootstrapping the datastore**

   * On startup, check for `tasks.json`. If it does not exist, create it with an empty JSON array `[]` and proper file permissions.

2. **ID generation**

   * Use a simple monotonic increment strategy based on the highest `id` in the file. This is deterministic and safe for single-user CLI usage.

3. **Atomic writes**

   * Write to a temporary file and rename to `tasks.json` to avoid partial writes and reduce the risk of corruption.

4. **Timestamps**

   * Use ISO 8601 (`YYYY-MM-DDTHH:MM:SSZ`) for `createdAt` and `updatedAt`.

5. **Input validation**

   * Validate required argument presence and types (e.g., numeric `id`).
   * Validate `status` values when filtering or setting statuses.

6. **Language-specific notes**

   * **Python**: Use `argparse` (standard library) or simple `sys.argv` parsing; use `json` and `pathlib` for I/O.
   * **Node.js**: Use `process.argv`, `fs`/`fs.promises`, and `JSON.parse`/`JSON.stringify`.
   * **Go/Java/Rust**: Use native CLIs and JSON libraries available in standard toolchains.

---

## Development & Testing

* Implement features incrementally: `add` → `list` → `update`/`delete` → `mark-*` → filters.
* Unit-test I/O operations where your language supports mocking file reads/writes. Ensure tests cover:

  * Missing `tasks.json` creation.
  * Concurrent-ish operations (read-modify-write) where applicable.
  * Invalid argument handling.
* Manual tests: run commands in a temporary directory to confirm `tasks.json` contents.

---

## Examples

Add two tasks and list them:

```bash
task-cli add "Buy groceries"
task-cli add "Write unit tests"
task-cli list
```

Mark the first task in progress and list in-progress:

```bash
task-cli mark-in-progress 1
task-cli list in-progress
```

Mark the first task done and list done:

```bash
task-cli mark-done 1
task-cli list done
```

---

## Contribution Guidelines

This project is deliberately lightweight and designed for incremental contributions. To contribute:

1. Fork the repository.
2. Implement or improve one CLI command or add robust tests.
3. Open a pull request with a concise description of the change and rationale.

Please maintain the constraint of zero external dependencies unless explicitly agreed by maintainers.

---

## License

This project is provided under the MIT License. See the `LICENSE` file for details.

---

## Final Notes

By building this CLI you'll reinforce fundamentals: filesystem I/O, CLI design, JSON persistence, and defensive programming. The final deliverable is a portable, scriptable tool that can be used as a foundation for more advanced systems (remote sync, multi-user backends, or a web UI).

Happy coding — ship fast, iterate thoughtfully.
