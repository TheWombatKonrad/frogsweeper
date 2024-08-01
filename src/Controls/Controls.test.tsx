import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import Controls from "./Controls";

describe("Controls", () => {
  it("Renders successfully", () => {
    render(<Controls />);
  });
});
