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
    const noNearbyFrogs: boolean = cell.nearbyFrogs === null;
    const cellRevealed: boolean = cell.revealed;

    if (!cellRevealed && noFrog) {
      this.revealTile(cellIndex);
      const nearbyCells = boardHelper.getNearbyValidCells(
        cellIndex,
        this.cols,
        this.rows
      );

      if (noNearbyFrogs) {
        for (const nearbyCell of nearbyCells) {
          this.revealTiles(nearbyCell);
        }
      }
    }
  };

  getCell = (cellIndex: number[]) => {
    return this.board[cellIndex[0]][cellIndex[1]];
  };

  private revealTile = (cellIndex: number[]) => {
    this.getCell(cellIndex).revealed = true;

    this.getButtonElement(cellIndex).style.display = "none";

    const cellDiv = this.getCellElement(cellIndex);
    cellDiv.style.display = "flex";
    cellDiv.style.color = this.getFrogCounterColor(
      this.getCell([cellIndex[0], cellIndex[1]]).nearbyFrogs
    );
  };

  private getButtonElement = (cellIndex: number[]) => {
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
        this.getButtonElement([col, row]).style.display = "flex";
        this.getCellElement([col, row]).style.display = "none";
        this.getCellElement([col, row]).style.background = "rgb(110, 148, 245)";
        this.getFrogMarkerElement([col, row]).hidden = true;
      }
    }
  };

  revealAllFrogs = () => {
    for (let col = 0; col < this.board.length; col++) {
      for (let row = 0; row < this.board[col].length; row++) {
        if (this.board[col][row].value === 1) this.revealTile([col, row]);
      }
    }
  };

  setCellBackgroundRed = (cellIndex: number[]) => {
    this.getCellElement(cellIndex).style.background = "red";
  };
}

export default CellInteractions;
