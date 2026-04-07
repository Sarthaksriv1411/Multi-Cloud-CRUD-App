import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import App from "./App.jsx";

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => []
      })
    );
    vi.stubGlobal("scrollTo", vi.fn());
    vi.stubGlobal("confirm", vi.fn(() => true));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the dashboard and loads the initial task list", async () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Task Manager CRUD App" })
    ).toBeInTheDocument();
    expect(await screen.findByText("No tasks yet.")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
