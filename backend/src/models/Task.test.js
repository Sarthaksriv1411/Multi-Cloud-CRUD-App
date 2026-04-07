import assert from "node:assert/strict";
import { describe, it } from "node:test";

import Task from "./Task.js";

describe("Task model", () => {
  it("requires a title", () => {
    const task = new Task({ description: "No title provided" });
    const error = task.validateSync();

    assert.equal(error?.errors.title?.message, "Title is required.");
  });

  it("rejects unsupported statuses", () => {
    const task = new Task({
      title: "Ship CI pipeline",
      status: "Blocked"
    });
    const error = task.validateSync();

    assert.equal(
      error?.errors.status?.message,
      "`Blocked` is not a valid enum value for path `status`."
    );
  });
});
