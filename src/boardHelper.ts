import Cell from "./Cell";

const getNearbyValidCellIndices = (
  cell: number[],
  maxCol: number,
  maxRow: number
) => {
  const baseCells: number[][] = getNearbyCellIndices(cell);

  return baseCells.filter((cell) => {
    if (isValidCell(cell, maxCol, maxRow)) return cell;
    else return null;
  });
};

const getNearbyCellIndices = (cell: number[]) => {
  const col = cell[0];
  const row = cell[1];

  return [
    [col, row + 1],
    [col, row - 1],
    [col + 1, row],
    [col + 1, row + 1],
    [col + 1, row - 1],
    [col - 1, row],
    [col - 1, row + 1],
    [col - 1, row - 1],
  ];
};

const isValidCell = (cell: number[], maxCol: number, maxRow: number) => {
  if (cell[0] < maxCol && cell[0] >= 0)
    if (cell[1] < maxRow && cell[1] >= 0) {
      return true;
    }
};

const getEmptyBoard = (cols: number, rows: number) => {
  const validCols = getValidNumberOfColumns(cols);
  const validRows = getValidNumberOfRows(rows);

  const emptyBoard: Cell[][] = Array.from({ length: validCols }, () =>
    Array.from({ length: validRows }, () => new Cell())
  );

  return emptyBoard;
};

const getValidNumberOfColumns = (cols: number) => {
  if (cols < 8) return 8;
  else if (cols > 99) return 99;
  else return cols;
};

const getValidNumberOfRows = (rows: number) => {
  if (rows < 1) return 1;
  else if (rows > 99) return 99;
  else return rows;
};

const getValidNumberOfBombs = (board: Cell[][], bombs: number) => {
  const maxBombs =
    board.length * board[0].length - getCellsWhereFrogsAreNotAllowed(board);

  if (bombs < 1) return 1;
  else if (bombs > maxBombs) return maxBombs;
  else return bombs;
};

const getCellsWhereFrogsAreNotAllowed = (board: Cell[][]) => {
  let size = 0;

  board.forEach((cells) =>
    cells.forEach((cell) => {
      if (cell.isOfStartingCluster) size++;
    })
  );

  return size + 1;
};

const boardHelper = {
  getNearbyValidCellIndices,
  getEmptyBoard,
  getValidNumberOfColumns,
  getValidNumberOfRows,
  getValidNumberOfBombs,
};

export default boardHelper;
