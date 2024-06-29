import { describe, it, expect } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import GameBoard from "./GameBoard";

describe("GameBoard", () => {
  const mockedProps = {
    expectedFrogs: 9,
    expectedRows: 10,
    expectedCols: 10,
    setShouldGameReset: () => false,
  };

  it("Renders successfully", () => {
    //Arrange
    render(
      <GameBoard
        cols={mockedProps.expectedCols}
        rows={mockedProps.expectedRows}
        bombs={mockedProps.expectedFrogs}
        shouldGameReset={false}
        setShouldGameReset={mockedProps.setShouldGameReset}
      />
    );

    const board = screen.getByTestId("board");

    //Assert
    expect(screen.getByRole("button", { name: "🐸" }));
    expect(board.getElementsByClassName("board-cell").length).toBe(
      mockedProps.expectedCols * mockedProps.expectedRows
    );
  });

  it("Upon left-click, cells are revealed", () => {
    //Arrange
    render(
      <GameBoard
        cols={mockedProps.expectedCols}
        rows={mockedProps.expectedRows}
        bombs={mockedProps.expectedFrogs}
        shouldGameReset={false}
        setShouldGameReset={mockedProps.setShouldGameReset}
      />
    );

    const button = screen.getByTestId("board").querySelectorAll("button")[6];

    //Act
    act(() => {
      button.click();
    });

    //Assert
    //@ts-ignore
    expect(button).not.toBeVisible();
  });

  it("Upon the game starting, the timer starts", async () => {
    //Arrange
    vi.useFakeTimers();

    render(
      <GameBoard
        cols={mockedProps.expectedCols}
        rows={mockedProps.expectedRows}
        bombs={mockedProps.expectedFrogs}
        shouldGameReset={false}
        setShouldGameReset={mockedProps.setShouldGameReset}
      />
    );

    //Act
    await act(async () => {
      screen.getByTestId("board").querySelectorAll("button")[6].click();
      vi.advanceTimersByTimeAsync(2000);
    });

    //Assert
    waitFor(() => {
      expect(Number.parseInt(screen.getByTestId("timer").innerHTML)).toBe(2);
    });

    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("The frogs counter displays the correct number of frogs", () => {
    //Arrange
    render(
      <GameBoard
        cols={mockedProps.expectedCols}
        rows={mockedProps.expectedRows}
        bombs={mockedProps.expectedFrogs}
        shouldGameReset={false}
        setShouldGameReset={mockedProps.setShouldGameReset}
      />
    );

    //Assert
    expect(Number.parseInt(screen.getByTestId("frogs-counter").innerHTML)).toBe(
      mockedProps.expectedFrogs
    );
  });

  it("Upon right-click, the cell is marked as containing a frog", () => {
    //Arrange
    render(
      <GameBoard
        cols={mockedProps.expectedCols}
        rows={mockedProps.expectedRows}
        bombs={mockedProps.expectedFrogs}
        shouldGameReset={false}
        setShouldGameReset={mockedProps.setShouldGameReset}
      />
    );

    const button = screen.getByTestId("board").querySelectorAll("button")[6];

    //Act
    act(() => {
      fireEvent.contextMenu(button);
    });

    //Assert
    expect(button.innerHTML).not.contains("hidden");
  });

  it("Upon right-click, the frog counter should decrease", () => {
    //Arrange
    render(
      <GameBoard
        cols={mockedProps.expectedCols}
        rows={mockedProps.expectedRows}
        bombs={mockedProps.expectedFrogs}
        shouldGameReset={false}
        setShouldGameReset={mockedProps.setShouldGameReset}
      />
    );

    const button = screen.getByTestId("board").querySelectorAll("button")[6];

    //Act
    act(() => {
      fireEvent.contextMenu(button);
    });

    //Assert
    //@ts-ignore
    expect(Number.parseInt(screen.getByTestId("frogs-counter").innerHTML)).toBe(
      mockedProps.expectedFrogs - 1
    );
  });

  it("Upon right-click, the a marked cell is unmarked as containing a frog", () => {
    //Arrange
    render(
      <GameBoard
        cols={mockedProps.expectedCols}
        rows={mockedProps.expectedRows}
        bombs={mockedProps.expectedFrogs}
        shouldGameReset={false}
        setShouldGameReset={mockedProps.setShouldGameReset}
      />
    );

    const button = screen.getByTestId("board").querySelectorAll("button")[6];

    act(() => {
      fireEvent.contextMenu(button);
    });

    expect(button.innerHTML).not.contains("hidden");

    //Act
    act(() => {
      fireEvent.contextMenu(button);
    });

    //Assert
    expect(button.innerHTML).contains("hidden");
  });

  it("When a cell is marked, it cannot be revealed", () => {
    //Arrange
    render(
      <GameBoard
        cols={mockedProps.expectedCols}
        rows={mockedProps.expectedRows}
        bombs={mockedProps.expectedFrogs}
        shouldGameReset={false}
        setShouldGameReset={mockedProps.setShouldGameReset}
      />
    );

    const button = screen.getByTestId("board").querySelectorAll("button")[6];

    act(() => {
      fireEvent.contextMenu(button);
    });

    expect(button.innerHTML).not.contains("hidden");

    //Act
    act(() => {
      button.click();
    });

    //Assert
    //@ts-ignore
    expect(button).toBeVisible();
  });

  it("Upon pressing reset, everything is reset", async () => {
    //Arrange
    vi.useFakeTimers();

    render(
      <GameBoard
        cols={mockedProps.expectedCols}
        rows={mockedProps.expectedRows}
        bombs={mockedProps.expectedFrogs}
        shouldGameReset={false}
        setShouldGameReset={mockedProps.setShouldGameReset}
      />
    );

    const leftClickButton = screen
      .getByTestId("board")
      .querySelectorAll("button")[6];
    const rightClickButton = screen
      .getByTestId("board")
      .querySelectorAll("button")[25];

    await act(async () => {
      leftClickButton.click();
      vi.advanceTimersByTimeAsync(2000);
      fireEvent.contextMenu(rightClickButton);
    });

    //checking that what should be reset is changed
    waitFor(() => {
      expect(Number.parseInt(screen.getByTestId("timer").innerHTML)).toBe(2);
    });
    expect(rightClickButton.innerHTML).not.contains("hidden");
    //@ts-ignore
    expect(leftClickButton).not.toBeVisible();

    //Act
    await act(async () => {
      screen.getByRole("button", { name: "🐸" }).click();
      vi.advanceTimersByTimeAsync(2000);
    });

    //Assert
    waitFor(() => {
      expect(Number.parseInt(screen.getByTestId("timer").innerHTML)).toBe(0);
    });
    expect(rightClickButton.innerHTML).contains("hidden");
    //@ts-ignore
    expect(leftClickButton).toBeVisible();

    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("When a frog is revealed, the game is lost", () => {
    //Arrange
    render(
      <GameBoard
        cols={mockedProps.expectedCols}
        rows={mockedProps.expectedRows}
        bombs={mockedProps.expectedFrogs}
        shouldGameReset={false}
        setShouldGameReset={mockedProps.setShouldGameReset}
      />
    );

    //starting the game
    act(() => {
      screen.getByTestId("board").querySelectorAll("button")[6].click();
    });

    //getting frog cells
    const cells = Array.from(
      screen.getByTestId("board").getElementsByClassName("board-cell")
    );

    const frogButtons = cells
      .filter((cell) =>
        cell.getElementsByClassName("cell-content")[0].innerHTML.includes("🐸")
      )
      .map((cell) => cell.querySelector("button"));

    //Act
    act(() => {
      //@ts-ignore
      frogButtons[6]?.click();
    });

    //Assert
    frogButtons.forEach((button) => {
      //@ts-ignore
      expect(button).not.toBeVisible();
    });
  });
});
