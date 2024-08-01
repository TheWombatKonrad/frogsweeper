import "./GameBoard.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import useBoard from "./Hooks/useBoard";
import CellInteractions from "./CellInteractions";
import useTimer from "./Hooks/useTimer";
import boardHelper from "./boardHelper";

function GameBoard(props: {
  cols: number;
  rows: number;
  bombs: number;
  shouldGameReset: React.SetStateAction<boolean>;
  setShouldGameReset: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [unmarkedBombs, setUnmarkedBombs] = useState<number>(props.bombs);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameIsLost, setGameIsLost] = useState<boolean>(false);
  const { board, startGame, resetBoard } = useBoard(props.cols, props.rows);
  const cellInteractions = useMemo(
    () => new CellInteractions(board, props.cols, props.rows),
    [board, props.cols, props.rows]
  );
  const { seconds, startTimer, stopTimer, resetTimer } = useTimer();

  const onLeftClick = (cell: number[]) => {
    if (!gameIsLost) {
      if (!gameStarted) {
        startGame(cell, props.bombs);
        setGameStarted(true);
        startTimer();
      }

      const isMarked = cellInteractions.getCell(cell).isMarked;
      if (!isMarked) revealTiles(cell);
    }
  };

  const revealTiles = (cellIndex: number[]) => {
    const noFrog: boolean = cellInteractions.getCell(cellIndex).value === 0;

    if (noFrog) {
      cellInteractions.revealTiles(cellIndex);
    } else {
      loseGame(cellIndex);
    }

    const totalFrogFreeCells = props.rows * props.cols - props.bombs;
    if (totalFrogFreeCells === cellInteractions.getNumberOfRevealedCells())
      winGame();
  };

  const loseGame = (cellIndex: number[]) => {
    cellInteractions.revealAllFrogs();
    cellInteractions.setCellBackgroundRed(cellIndex);
    stopTimer();
    setGameIsLost(true);
  };

  const winGame = () => {
    console.log("game won");
    stopTimer();
  };

  const onRightClick = (cellIndex: number[]) => {
    if (!gameIsLost) {
      cellInteractions.switchCellMarking(cellIndex);
      const cell = cellInteractions.getCell(cellIndex);

      if (cell.isMarked === true) setUnmarkedBombs(unmarkedBombs - 1);
      else setUnmarkedBombs(unmarkedBombs + 1);
    }
  };

  const onTileClick = (cellIndex: number[]) => {
    const nearbyCellIndices = boardHelper.getNearbyValidCellIndices(
      cellIndex,
      props.cols,
      props.rows
    );

    if (
      cellInteractions.areTheMinimumAmountOfCellsMarked(
        nearbyCellIndices,
        cellInteractions.getCell(cellIndex).nearbyFrogs
      )
    ) {
      autoRevealCells(nearbyCellIndices);
    }
  };

  const autoRevealCells = (nearbyCellIndices: number[][]) => {
    nearbyCellIndices.forEach((index) => {
      if (!cellInteractions.getCell(index).isMarked) {
        revealTiles(index);
      }
    });
  };

  const resetGame = useCallback(() => {
    cellInteractions.resetAllCells();
    resetBoard();
    stopTimer();
    resetTimer();
    setGameStarted(false);
    setUnmarkedBombs(props.bombs);
    setGameIsLost(false);
    props.setShouldGameReset(false);
  }, [cellInteractions, props, resetBoard, stopTimer]);

  useEffect(() => {
    if (props.shouldGameReset) resetGame();
  }, [props.cols, props.rows, props.bombs, props.shouldGameReset, resetGame]);

  return (
    <div id="game-console">
      <ul id="console-controls">
        <li className="counter" data-testid="frogs-counter">
          {unmarkedBombs.toString().length < 3 && 0}
          {unmarkedBombs}
        </li>
        <li>
          <button id="reset-button" onClick={resetGame}>
            🐸
          </button>
        </li>
        <li className="counter" data-testid="timer">
          {seconds.toString().length < 3 && 0}
          {seconds.toString().length < 2 && 0}
          {seconds}
        </li>
      </ul>
      <div id="board" data-testid="board">
        <ul className="board-column">
          {board.map((col, colIndex) => (
            <li key={colIndex}>
              <ul className="board-row">
                {col.map((cell, rowIndex) => (
                  <li
                    key={rowIndex}
                    className="board-cell"
                    data-testid={"cellC" + colIndex + "R" + rowIndex}
                  >
                    <button
                      id={"buttonC" + colIndex + "R" + rowIndex}
                      className="outer-cell-button"
                      onClick={() => onLeftClick([colIndex, rowIndex])}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        onRightClick([colIndex, rowIndex]);
                      }}
                    >
                      <div
                        id={"frogMarkerC" + colIndex + "R" + rowIndex}
                        className="frog-marker"
                        hidden
                      >
                        !
                      </div>
                    </button>
                    <button
                      id={"cellC" + colIndex + "R" + rowIndex}
                      className="inner-cell-button"
                      onClick={() => onTileClick([colIndex, rowIndex])}
                    >
                      {cell.value === 1 && <span className="bomb">🐸</span>}
                      {cell.value === 0 && cell.nearbyFrogs > 0 && (
                        <>{cell.nearbyFrogs}</>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GameBoard;
