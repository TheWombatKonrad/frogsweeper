import { act, fireEvent } from "@testing-library/react";
import testHelper from "./testHelper";
import boardHelper from "../src/boardHelper";

const markNearbyFrogs = (
  screen: any,
  centerButton: HTMLElement,
  mockedProps: any
) => {
  const index = getIndex(centerButton.id);

  const nearbyCellIndices = boardHelper.getNearbyValidCellIndices(
    index!,
    mockedProps.expectedCols,
    mockedProps.expectedRows
  );

  nearbyCellIndices.forEach((i) => {
    const cell: HTMLElement = screen.getByTestId("cellC" + i[0] + "R" + i[1]);

    const containsFrog = testHelper
      .getInnerButtonFromCell(cell)
      .innerHTML.includes("🐸");

    if (containsFrog)
      act(() => fireEvent.contextMenu(testHelper.getOuterButtonFromCell(cell)));
  });
};

const markNearbyCellsWithoutFrogs = (
  screen: any,
  centerButton: HTMLElement,
  mockedProps: any
) => {
  const index = getIndex(centerButton.id);

  const nearbyCellIndices = boardHelper.getNearbyValidCellIndices(
    index!,
    mockedProps.expectedCols,
    mockedProps.expectedRows
  );

  nearbyCellIndices.forEach((i) => {
    const cell: HTMLElement = screen.getByTestId("cellC" + i[0] + "R" + i[1]);

    const containsFrog = testHelper
      .getInnerButtonFromCell(cell)
      .innerHTML.includes("🐸");

    if (!containsFrog)
      act(() => fireEvent.contextMenu(testHelper.getOuterButtonFromCell(cell)));
  });
};

const getIndex = (id: string) => {
  return id.match(/\d+/g)?.map((i) => Number.parseInt(i));
};

const startPlayableGame = (screen: any, startingIndex: number) => {
  const nonFrogButtons: HTMLButtonElement[] = [];

  do {
    act(() => {
      testHelper.clickOuterButton(screen, startingIndex);
    });

    nonFrogButtons.push(...testHelper.getNonFrogOuterButtons(screen));
    if (nonFrogButtons.length === 0) {
      act(() => testHelper.resetGame(screen));
    }
  } while (nonFrogButtons.length === 0 || nonFrogButtons.length === 8);
};

const startGame = (screen: any, startingIndex: number) => {
  act(() => {
    testHelper.clickOuterButton(screen, startingIndex);
  });
};

const testActs = {
  markNearbyFrogs,
  markNearbyCellsWithoutFrogs,
  startPlayableGame,
  startGame,
};

export default testActs;
