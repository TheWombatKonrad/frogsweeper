class Cell {
  value: number;
  isRevealed: boolean;
  isStartingCell: boolean;
  isOfStartingCluster: boolean;
  nearbyFrogs: number;
  isMarked: boolean;

  constructor() {
    this.value = 0;
    this.isRevealed = false;
    this.isStartingCell = false;
    this.isOfStartingCluster = false;
    this.nearbyFrogs = 0;
    this.isMarked = false;
  }
}

export default Cell;
