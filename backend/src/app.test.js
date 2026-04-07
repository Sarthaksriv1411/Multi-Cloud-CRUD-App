import assert from "node:assert/strict";
import { describe, it } from "node:test";

import request from "supertest";

import app from "./app.js";

describe("backend app", () => {
  it("returns health metadata without requiring a database connection", async () => {
    const response = await request(app).get("/health").expect(200);

    assert.equal(response.body.status, "degraded");
    assert.equal(response.body.database, "disconnected");
    assert.ok(response.body.timestamp);
  });

  it("returns a clear 404 payload for unknown routes", async () => {
    const response = await request(app).get("/missing-route").expect(404);

    assert.equal(response.body.message, "Route not found: GET /missing-route");
  });
});
