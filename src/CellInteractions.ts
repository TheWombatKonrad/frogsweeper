import Cell from "./Cell";
import boardHelper from "./boardHelper";

class CellInteractions {
  private board: Cell[][];
  private cols: number;
  private rows: number;

  constructor(board: Cell[][], cols: number, rows: number) {
    this.board = board;
    this.cols = cols;
    this.rows = rows;
  }

  revealTiles = (cellIndex: number[]) => {
    const cell = this.getCell(cellIndex);
    const noFrog: boolean = cell.value === 0;
    const noNearbyFrogs: boolean = cell.nearbyFrogs === 0;
    const cellRevealed: boolean = cell.isRevealed;

    if (!cellRevealed && noFrog) {
      this.revealTile(cellIndex);
      const nearbyCellIndices = boardHelper.getNearbyValidCellIndices(
        cellIndex,
        this.cols,
        this.rows
      );

      if (noNearbyFrogs) {
        for (const index of nearbyCellIndices) {
          this.revealTiles(index);
        }
      }
    }
  };

  getCell = (cellIndex: number[]) => {
    return this.board[cellIndex[0]][cellIndex[1]];
  };

  revealTile = (cellIndex: number[]) => {
    this.getCell(cellIndex).isRevealed = true;

    this.getOuterButton(cellIndex).style.display = "none";

    const cellDiv = this.getCellElement(cellIndex);
    cellDiv.style.display = "flex";
    cellDiv.style.color = this.getFrogCounterColor(
      this.getCell([cellIndex[0], cellIndex[1]]).nearbyFrogs
    );
  };

  private getOuterButton = (cellIndex: number[]) => {
    return document.getElementById(
      "buttonC" + cellIndex[0] + "R" + cellIndex[1]
    )!;
  };

  private getCellElement = (cellIndex: number[]) => {
    return document.getElementById(
      "cellC" + cellIndex[0] + "R" + cellIndex[1]
    )!;
  };

  private getFrogCounterColor = (nearbyFrogs: number | null) => {
    switch (nearbyFrogs) {
      case 1:
        return "blue";
      case 2:
        return "green";
      case 3:
        return "red";
      case 4:
        return "midnightblue";
      case 5:
        return "darkred";
      default:
        return "grey";
    }
  };

  switchCellMarking = (cellIndex: number[]) => {
    const marking = this.getFrogMarkerElement(cellIndex);
    const cell = this.getCell(cellIndex);

    if (cell.isMarked) {
      marking.hidden = true;
      cell.isMarked = false;
    } else {
      marking.hidden = false;
      cell.isMarked = true;
    }
  };

  private getFrogMarkerElement = (cellIndex: number[]) => {
    return document.getElementById(
      "frogMarkerC" + cellIndex[0] + "R" + cellIndex[1]
    )!;
  };

  resetAllCells = () => {
    for (let col = 0; col < this.board.length; col++) {
      for (let row = 0; row < this.board[col].length; row++) {
        this.getOuterButton([col, row]).style.display = "flex";
        this.getCellElement([col, row]).style.display = "none";
        this.getCellElement([col, row]).style.background =
          "var(--dark-background-color)";
        this.getFrogMarkerElement([col, row]).hidden = true;
      }
    }
  };

  revealAllFrogs = () => {
    for (let col = 0; col < this.board.length; col++) {
      for (let row = 0; row < this.board[col].length; row++) {
        const cell = this.board[col][row];

        if (cell.value === 1 && !cell.isMarked) this.revealTile([col, row]);
      }
    }
  };

  setCellBackgroundRed = (cellIndex: number[]) => {
    this.getCellElement(cellIndex).style.background = "red";
  };

  getNumberOfRevealedCells = () => {
    let revealedCells = 0;

    this.board.forEach((cells) =>
      cells.forEach((cell) => {
        if (cell.isRevealed) revealedCells++;
      })
    );

    return revealedCells;
  };

  areTheMinimumAmountOfCellsMarked = (
    nearbyCellIndices: number[][],
    necessaryMarks: number
  ) => {
    let markedCells = 0;

    nearbyCellIndices.forEach((index) => {
      if (this.getCell(index).isMarked) markedCells++;
    });

    return markedCells >= necessaryMarks ? true : false;
  };
}

export default CellInteractions;
