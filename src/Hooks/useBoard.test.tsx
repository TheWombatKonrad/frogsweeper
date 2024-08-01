import { renderHook } from "@testing-library/react";
import useBoard from "./useBoard";
import { act } from "react";
import Cell from "../Cell";

describe("useBoard", () => {
  it("Before start, returns an empty board", () => {
    //Arrange
    const { result } = renderHook(() => useBoard(10, 10));

    //Assert
    result.current.board.forEach((cells) =>
      cells.forEach((cell) => {
        expect(cell.value).toBe(0);
        expect(cell.isMarked).toBeFalsy();
        expect(cell.isOfStartingCluster).toBeFalsy();
        expect(cell.isStartingCell).toBeFalsy();
        expect(cell.nearbyFrogs).toBe(0);
        expect(cell.isRevealed).toBeFalsy();
      })
    );
  });

  it("Returns a board of the correct minimum size", () => {
    //Arrange
    const { result } = renderHook(() => useBoard(0, 0));

    //Assert
    expect(result.current.board.length).toBe(8);
    expect(result.current.board[0].length).toBe(1);
  });

  it("Returns the correct maximum size", () => {
    //Arrange
    const { result } = renderHook(() => useBoard(200, 200));

    //Assert
    expect(result.current.board.length).toBe(99);
    expect(result.current.board[0].length).toBe(99);
  });

  it("StartGame returns a valid gameboard", () => {
    //Arrange
    const expectedCols: number = 10;
    const expectedRows: number = 10;
    const { result } = renderHook(() => useBoard(expectedCols, expectedRows));
    const expectedStartingCell: number[] = [1, 1];
    const expectedNumberOfBombs: number = 9;

    //Act
    act(() => {
      result.current.startGame(expectedStartingCell, expectedNumberOfBombs);
    });

    //Assert Calculations
    let actualNumberOfBombs: number = 0;
    let actualStartingCell: number[] = [0, 0];
    let numberOfStartingCells: number = 0;
    let numberInStartingCluster: number = 0;
    const board: Cell[][] = result.current.board;

    for (let i = 0; i < board.length; i++) {
      const cells = board[i];

      for (let ii = 0; ii < cells.length; ii++) {
        const cell = cells[ii];

        actualNumberOfBombs = actualNumberOfBombs + cell.value;

        if (cell.isStartingCell) {
          actualStartingCell = [i, ii];
          numberOfStartingCells++;
        }

        if (cell.isOfStartingCluster) numberInStartingCluster++;
      }
    }

    //Assert
    expect(actualNumberOfBombs).toBe(expectedNumberOfBombs);
    expect(actualStartingCell).toStrictEqual(expectedStartingCell);
    expect(numberOfStartingCells).toBe(1);
    expect(numberInStartingCluster).toBe(8);
    expect(board.length).toBe(expectedCols);
    expect(board[0].length).toBe(expectedRows);
  });

  it("ResetBoard returns an empty gameboard", () => {
    //Arrange
    const { result } = renderHook(() => useBoard(10, 10));

    //Act
    act(() => {
      result.current.startGame([0, 0], 9);
      result.current.resetBoard();
    });

    //Assert
    result.current.board.forEach((cells) =>
      cells.forEach((cell) => {
        expect(cell.value).toBe(0);
        expect(cell.isMarked).toBeFalsy();
        expect(cell.isOfStartingCluster).toBeFalsy();
        expect(cell.isStartingCell).toBeFalsy();
        expect(cell.nearbyFrogs).toBe(0);
        expect(cell.isRevealed).toBeFalsy();
      })
    );
  });

  it("StartGame returns the correct minimum frogs", () => {
    //Arrange
    const { result } = renderHook(() => useBoard(10, 10));

    //Act
    act(() => {
      result.current.startGame([0, 0], 0);
    });

    //Assert Calculations
    let numberOfFrogs: number = 0;

    result.current.board.forEach((cells) =>
      cells.forEach((cell) => (numberOfFrogs = numberOfFrogs + cell.value))
    );

    //Assert
    expect(numberOfFrogs).toBe(1);
  });

  it("StartGame returns the correct maximum frogs", () => {
    //Arrange
    const { result } = renderHook(() => useBoard(10, 10));

    //Act
    act(() => {
      result.current.startGame([0, 0], 200);
    });

    //Assert Calculations
    let numberOfFrogs: number = 0;

    result.current.board.forEach((cells) =>
      cells.forEach((cell) => (numberOfFrogs = numberOfFrogs + cell.value))
    );

    //Assert
    expect(numberOfFrogs).toBe(96); //cols*rows-starting cell - starting cluster
  });
});
