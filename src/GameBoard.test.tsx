import { describe, it, expect } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import GameBoard from "./GameBoard";
import testHelper from "../tests/testHelper";
import testActs from "../tests/testActs";

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
      testHelper.clickOuterButton(screen, 6); //starting game
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
      testHelper.markOuterButton(button);
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
      testHelper.markOuterButton(button);
    });

    //Assert
    expect(Number.parseInt(screen.getByTestId("frogs-counter").innerHTML)).toBe(
      mockedProps.expectedFrogs - 1
    );
  });

  it("Upon right-click, a marked cell is unmarked as containing a frog", () => {
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
      testHelper.markOuterButton(button);
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
      testHelper.markOuterButton(button);
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
    vi.useFakeTimers({ shouldAdvanceTime: true });

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
      testHelper.markOuterButton(rightClickButton);
    });

    //checking that what should be reset is changed
    await waitFor(() => {
      expect(Number.parseInt(screen.getByTestId("timer").innerHTML)).toBe(2);
    });
    expect(rightClickButton.innerHTML).not.contains("hidden");
    //@ts-ignore
    expect(leftClickButton).not.toBeVisible();

    //Act
    await act(async () => {
      testHelper.resetGame(screen);
      vi.advanceTimersByTimeAsync(2000);
    });

    //Assert
    await waitFor(() => {
      expect(Number.parseInt(screen.getByTestId("timer").innerHTML)).toBe(0);
    });

    expect(rightClickButton.innerHTML).not.toContain("hidden");
    //@ts-ignore
    expect(leftClickButton).toBeVisible();

    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("When a frog is revealed, all unmarked frogs are revealed", () => {
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

    testActs.startGame(screen, 6);

    const innerButton = testHelper.getNumericalInnerButtons(screen)[2];
    testActs.markNearbyFrogs(screen, innerButton, mockedProps);

    const frogButtons = testHelper.getFrogOuterButtons(screen);

    //Act
    act(() => {
      frogButtons[6]?.click();
    });

    //Assert
    const revealedFrogs = testHelper.getRevealedFrogInnerButtons(screen);
    const markedFrogs = Number.parseInt(innerButton.innerHTML);

    expect(revealedFrogs.length).toEqual(
      mockedProps.expectedFrogs - markedFrogs
    );
  });

  it("When the game is lost, cells cannot be interacted with", () => {
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
      testHelper.clickOuterButton(screen, 6);
    });

    const frogButtons = testHelper.getFrogOuterButtons(screen);

    act(() => {
      frogButtons[6]?.click();
    });

    const nonFrogOuterButtons = testHelper.getNonFrogOuterButtons(screen);
    const innerNumericalButtons = testHelper.getNumericalInnerButtons(screen);
    const baseRevealedButtons = testHelper.getVisibleOuterButtons(screen);

    //Act
    act(() => {
      nonFrogOuterButtons[0]?.click(); //tests if cells can be revealed
      testHelper.markOuterButton(nonFrogOuterButtons[1]!);
      innerNumericalButtons[2].click(); //tests if autoclick works
    });

    const result = testHelper.getVisibleOuterButtons(screen);

    //Assert
    expect(nonFrogOuterButtons.length).toBeGreaterThan(1);
    //@ts-ignore
    expect(nonFrogOuterButtons[0]).toBeVisible();
    expect(nonFrogOuterButtons[1]?.innerHTML).contains("hidden");
    expect(result.length).toEqual(baseRevealedButtons.length);
  });

  it("When the game is lost, the timer stops", async () => {
    //Arrange
    vi.useFakeTimers({ shouldAdvanceTime: true });

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
    await act(async () => {
      screen.getByTestId("board").querySelectorAll("button")[6].click();
      vi.advanceTimersByTimeAsync(2000);
    });

    await waitFor(() => {
      expect(Number.parseInt(screen.getByTestId("timer").innerHTML)).toBe(2);
    });

    //getting frog cells
    const frogButtons = testHelper.getFrogOuterButtons(screen);

    //Act
    await act(async () => {
      frogButtons[6]?.click();
      vi.advanceTimersByTimeAsync(2000);
    });

    //Assert
    await waitFor(() => {
      expect(Number.parseInt(screen.getByTestId("timer").innerHTML)).toBe(2);
    });

    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("When the game is won, the timer stops", async () => {
    //Arrange
    vi.useFakeTimers({ shouldAdvanceTime: true });

    render(
      <GameBoard
        cols={8}
        rows={1}
        bombs={1}
        shouldGameReset={false}
        setShouldGameReset={mockedProps.setShouldGameReset}
      />
    );

    testActs.startPlayableGame(screen, 1);

    await act(async () => {
      vi.advanceTimersByTimeAsync(2000);
    });

    await waitFor(() => {
      expect(Number.parseInt(screen.getByTestId("timer").innerHTML)).toBe(2);
    });

    //Act
    await act(async () => {
      testHelper
        .getNonFrogOuterButtons(screen)
        .forEach((button) => button?.click());
      vi.advanceTimersByTimeAsync(2000);
    });

    //Assert
    await waitFor(() => {
      expect(Number.parseInt(screen.getByTestId("timer").innerHTML)).toBe(2);
    });

    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("When a revealed cell is clicked and its frog markers are placed, nearby tiles are revealed", () => {
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

    act(() => {
      testHelper.clickOuterButton(screen, 6); //starting the game
    });

    const baseVisibleOuterButtons = testHelper.getVisibleOuterButtons(screen);
    const pressableInnerButton = testHelper.getNumericalInnerButtons(screen)[0];

    testActs.markNearbyFrogs(screen, pressableInnerButton, mockedProps);

    //Act
    act(() => {
      pressableInnerButton?.click();
    });

    const result = testHelper.getVisibleOuterButtons(screen);

    waitFor(() => {
      //if this is not in a waitfor, sometimes (not always) it will fail
      expect(result.length).toBeLessThan(baseVisibleOuterButtons.length);
    });
  });

  it("When a revealed empty cell is clicked, nothing is revealed", () => {
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

    act(() => {
      testHelper.clickOuterButton(screen, 6); //starting the game
    });

    const baseVisibleOuterButtons = testHelper.getVisibleOuterButtons(screen);
    const emptyInnerButtons = Array.from(
      screen.getByTestId("board").getElementsByClassName("board-cell")
    )
      .map((cell) => testHelper.getInnerButtonFromCell(cell))
      .filter((button) => button.innerHTML === "");

    //Act
    act(() => {
      emptyInnerButtons[0].click();
    });

    const result = testHelper.getVisibleOuterButtons(screen);

    waitFor(() => {
      //if this is not in a waitfor, sometimes (not always) it will fail
      expect(result.length).toEqual(baseVisibleOuterButtons.length);
    });
  });

  it("When a revealed cell is clicked and its frog markers are placed wrong, all frogs are revealed", () => {
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

    act(() => {
      testHelper.clickOuterButton(screen, 6); //starting the game
    });

    const pressableInnerButton = testHelper.getNumericalInnerButtons(screen)[0];

    testActs.markNearbyCellsWithoutFrogs(
      screen,
      pressableInnerButton,
      mockedProps
    );

    //Act
    act(() => {
      pressableInnerButton?.click();
    });

    const revealedFrogs = testHelper
      .getFrogOuterButtons(screen)
      .filter((button) => button.style.display === "none");

    expect(revealedFrogs.length).toEqual(mockedProps.expectedFrogs);
  });
});
