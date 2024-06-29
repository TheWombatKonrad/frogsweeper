class Cell {
  value: number;
  revealed: boolean;
  isStartingCell: boolean;
  isOfStartingCluster: boolean;
  nearbyFrogs: number | null;
  isMarked: boolean;

  constructor() {
    this.value = 0;
    this.revealed = false;
    this.isStartingCell = false;
    this.isOfStartingCluster = false;
    this.nearbyFrogs = null;
    this.isMarked = false;
  }
}

export default Cell;
