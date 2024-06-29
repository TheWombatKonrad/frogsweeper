import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CustomModal from "./CustomModal";
import { act } from "react";

describe("CustomModal", () => {
  it("Renders the button successfully", () => {
    //Arrange
    render(
      <div id="root">
        <CustomModal title="test-title" content={<div>testing div</div>} />
      </div>
    );

    //Assert
    expect(screen.getByRole("button", { name: "test-title" }));

    const heading = screen.queryByRole("heading", { name: "test-title" });
    expect(heading).toBeNull();

    const content = screen.queryByText("testing div");
    expect(content).toBeNull();
  });

  it("Opens and renders the modal successfully", () => {
    //Arrange
    render(
      <div id="root">
        <CustomModal title="test-title" content={<div>testing div</div>} />
      </div>
    );

    //Act
    act(() => {
      screen.getByRole("button", { name: "test-title" }).click();
    });

    //Assert
    expect(screen.getByRole("heading", { name: "test-title" }));
    expect(screen.getByText("testing div"));

    const button = screen.queryByRole("button", { name: "test-title" });
    expect(button).toBeNull();
  });

  it("Closes the modal successfully", () => {
    //Arrange
    render(
      <div id="root">
        <CustomModal title="test-title" content={<div>testing div</div>} />
      </div>
    );

    let heading = screen.queryByRole("heading", { name: "test-title" });
    expect(heading).toBeNull();

    act(() => {
      screen.getByRole("button", { name: "test-title" }).click();
    });

    expect(screen.getByRole("heading", { name: "test-title" }));

    //Act
    act(() => {
      screen.getByRole("button").click();
    });

    //Assert
    heading = screen.queryByRole("heading", { name: "test-title" });
    expect(heading).toBeNull();
  });
});
