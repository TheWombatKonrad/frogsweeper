import "./GameBoard.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import useBoard from "./Hooks/useBoard";
import CellInteractions from "./CellInteractions";
import useTimer from "./Hooks/useTimer";

function GameBoard(props: {
  cols: number;
  rows: number;
  bombs: number;
  shouldGameReset: React.SetStateAction<boolean>;
  setShouldGameReset: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [unmarkedBombs, setUnmarkedBombs] = useState<number>(props.bombs);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const { board, startGame, resetBoard } = useBoard(props.cols, props.rows);
  const cellInteractions = useMemo(
    () => new CellInteractions(board, props.cols, props.rows),
    [board, props.cols, props.rows]
  );
  const { seconds, startTimer, stopTimer, resetTimer } = useTimer();

  const onLeftClick = (cell: number[]) => {
    if (!gameStarted) {
      startGame(cell, props.bombs);
      setGameStarted(true);
      startTimer();
    }

    const isMarked = cellInteractions.getCell(cell).isMarked;

    if (!isMarked) revealTiles(cell);
  };

  const revealTiles = (cellIndex: number[]) => {
    const noFrog: boolean = cellInteractions.getCell(cellIndex).value === 0;

    if (noFrog) {
      cellInteractions.revealTiles(cellIndex);
    } else {
      loseGame(cellIndex);
    }
  };

  const loseGame = (cellIndex: number[]) => {
    cellInteractions.revealAllFrogs();
    cellInteractions.setCellBackgroundRed(cellIndex);
  };

  const onRightClick = (cellIndex: number[]) => {
    cellInteractions.switchCellMarking(cellIndex);
    const cell = cellInteractions.getCell(cellIndex);

    if (cell.isMarked === true) setUnmarkedBombs(unmarkedBombs - 1);
    else setUnmarkedBombs(unmarkedBombs + 1);
  };

  const resetGame = useCallback(() => {
    cellInteractions.resetAllCells();
    resetBoard();
    stopTimer();
    resetTimer();
    setGameStarted(false);
    setUnmarkedBombs(props.bombs);
    props.setShouldGameReset(false);
  }, [cellInteractions, props, resetBoard, stopTimer]);

  useEffect(() => {
    if (props.shouldGameReset) resetGame();
  }, [props.cols, props.rows, props.bombs, props.shouldGameReset, resetGame]);

  return (
    <div id="game-console">
      <ul id="console-controls">
        <li className="counter" data-testid="frogs-counter">
          {unmarkedBombs}
        </li>
        <li>
          <button id="reset-button" onClick={resetGame}>
            🐸
          </button>
        </li>
        <li className="counter" data-testid="timer">
          {seconds}
        </li>
      </ul>
      <div id="board" data-testid="board">
        <ul className="board-column">
          {board.map((col, colIndex) => (
            <li key={colIndex}>
              <ul className="board-row">
                {col.map((cell, rowIndex) => (
                  <li key={rowIndex} className="board-cell">
                    <button
                      id={"buttonC" + colIndex + "R" + rowIndex}
                      onClick={() => onLeftClick([colIndex, rowIndex])}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        onRightClick([colIndex, rowIndex]);
                      }}
                    >
                      <div
                        id={"frogMarkerC" + colIndex + "R" + rowIndex}
                        hidden
                      >
                        !
                      </div>
                    </button>
                    <div
                      id={"cellC" + colIndex + "R" + rowIndex}
                      className="cell-content"
                    >
                      {cell.value === 1 && <span className="bomb">🐸</span>}
                      {cell.value === 0 && <>{cell.nearbyFrogs}</>}
                    </div>
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
