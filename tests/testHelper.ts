import { fireEvent } from "@testing-library/react";

const getFrogOuterButtons = (screen: any) => {
  const cells = Array.from(
    screen.getByTestId("board").getElementsByClassName("board-cell")
  );

  const frogButtons = cells
    .filter((cell: any) =>
      getInnerButtonFromCell(cell).innerHTML.includes("🐸")
    )
    .map((cell: any) => getOuterButtonFromCell(cell));

  return frogButtons;
};

const getNonFrogOuterButtons = (screen: any) => {
  const cells: HTMLElement[] = Array.from(
    screen.getByTestId("board").getElementsByClassName("board-cell")
  );

  const buttons = cells
    .filter((cell) => !doesCellContainFrog(cell))
    .map((cell) => getOuterButtonFromCell(cell))
    .filter((button) => button?.style.display !== "none");

  return buttons;
};

const getNonFrogInnerButtons = (screen: any) => {
  return getRevealedInnerButtons(screen).filter(
    (button) => !button.innerHTML.includes("🐸")
  );
};

const getRevealedInnerButtons = (screen: any) => {
  const cells: HTMLElement[] = Array.from(
    screen.getByTestId("board").getElementsByClassName("board-cell")
  );

  const buttons = cells
    .map((cell) => getInnerButtonFromCell(cell))
    .filter((button) => button?.style.display === "flex");

  return buttons;
};

const getNumericalInnerButtons = (screen: any) => {
  const buttons = getNonFrogInnerButtons(screen).filter(
    (button) => Number.parseInt(button.innerHTML) > 0
  );

  return buttons;
};

const getVisibleOuterButtons = (screen: any) => {
  const cells: HTMLElement[] = Array.from(
    screen.getByTestId("board").getElementsByClassName("board-cell")
  );

  const buttons = cells
    .map((cell) => getOuterButtonFromCell(cell))
    .filter((button) => button?.style.display !== "none");

  return buttons;
};

const getOuterButtonFromCell = (cell: Element) => {
  return cell.querySelectorAll("button")[0];
};

const getInnerButtonFromCell = (cell: Element) => {
  return cell.querySelectorAll("button")[1];
};

const doesCellContainFrog = (cell: HTMLElement) => {
  return getInnerButtonFromCell(cell).innerHTML.includes("🐸");
};

const clickOuterButton = (screen: any, index: number) => {
  const button = getVisibleOuterButtons(screen)[index];
  button.click();
};

const resetGame = (screen: any) => {
  screen.getAllByRole("button", { name: "🐸" })[0].click();
};

const markOuterButton = (button: HTMLElement) => {
  fireEvent.contextMenu(button);
};

const getRevealedFrogInnerButtons = (screen: any) => {
  return getRevealedInnerButtons(screen).filter((button) =>
    button.innerHTML.includes("🐸")
  );
};

const testHelper = {
  getFrogOuterButtons,
  getNonFrogOuterButtons,
  getNonFrogInnerButtons,
  getNumericalInnerButtons,
  getVisibleOuterButtons,
  getOuterButtonFromCell,
  getInnerButtonFromCell,
  clickOuterButton,
  resetGame,
  markOuterButton,
  getRevealedFrogInnerButtons,
};

export default testHelper;
