import { useCallback, useState } from "react";
import Cell from "../Cell";
import boardHelper from "../boardHelper";

function useBoard(cols: number, rows: number) {
  const [board, setBoard] = useState<Cell[][]>(
    boardHelper.getEmptyBoard(cols, rows)
  );

  const calculateNearbyFrogs = useCallback(
    (cell: number[]) => {
      let nearbyFrogs: number = 0;
      const nearbyCells: number[][] = boardHelper.getNearbyValidCellIndices(
        cell,
        cols,
        rows
      );

      nearbyCells.forEach((cell) => {
        if (containsBomb(board, cell)) nearbyFrogs++;
      });

      return nearbyFrogs;
    },
    [board, cols, rows]
  );

  const containsBomb = (board: Cell[][], cell: number[]) => {
    if (board[cell[0]][cell[1]].value === 1) {
      return true;
    }
  };

  const calculateNearbyFrogsForAll = useCallback(() => {
    for (let col = 0; col < board.length; col++) {
      const cells = board[col];

      for (let index = 0; index < cells.length; index++) {
        cells[index].nearbyFrogs = calculateNearbyFrogs([col, index]);
      }
    }
  }, [board, calculateNearbyFrogs]);

  const getCell = useCallback(
    (cellIndex: number[]) => {
      return board[cellIndex[0]][cellIndex[1]];
    },
    [board]
  );

  const placeFrogs = useCallback(
    (bombs: number) => {
      let bombsPlaced: number = 0;
      bombs = boardHelper.getValidNumberOfBombs(board, bombs);

      do {
        const col = getRandomIndex(cols);
        const row = getRandomIndex(rows);
        const cell = getCell([col, row]);

        if (
          cell.value === 0 &&
          !cell.isStartingCell &&
          !cell.isOfStartingCluster
        ) {
          cell.value = 1;
          bombsPlaced++;
        }
      } while (bombsPlaced < bombs);
    },
    [getCell, cols, rows]
  );

  const getRandomIndex = (maxIndex: number) => {
    return Math.floor(Math.random() * maxIndex);
  };

  const startGame = useCallback(
    (startingCell: number[], bombs: number) => {
      const cell = getCell(startingCell);
      cell.isStartingCell = true;

      const nearbyCells = boardHelper.getNearbyValidCellIndices(
        startingCell,
        cols,
        rows
      );
      nearbyCells.forEach((cell) => (getCell(cell).isOfStartingCluster = true));

      placeFrogs(bombs);
      calculateNearbyFrogsForAll();
    },
    [calculateNearbyFrogsForAll, getCell, placeFrogs, cols, rows]
  );

  const resetBoard = () => {
    setBoard(boardHelper.getEmptyBoard(cols, rows));
  };

  return {
    board,
    startGame,
    resetBoard,
  } as const;
}

export default useBoard;
