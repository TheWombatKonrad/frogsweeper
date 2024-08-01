import { act, fireEvent, render, screen } from "@testing-library/react";
import GameDifficulty from "./GameDifficulty";
import { describe, it, expect } from "vitest";

describe("GameDifficulty", () => {
  const mockedProps = {
    setCols: () => 20,
    setRows: () => 20,
    setBombs: () => 20,
    setShouldGameReset: () => false,
  };

  it("Renders successfully", () => {
    //Arrange
    render(
      <GameDifficulty
        setBombs={mockedProps.setBombs}
        setCols={mockedProps.setCols}
        setRows={mockedProps.setRows}
        setShouldGameReset={mockedProps.setShouldGameReset}
      />
    );

    //Assert
    expect(screen.getByText("Width"));
    expect(screen.getByText("Height"));
    expect(screen.getByText("Mines"));
    expect(screen.getByRole("radio", { name: "Beginner" }));
    expect(screen.getByRole("radio", { name: "Intermediate" }));
    expect(screen.getByRole("radio", { name: "Expert" }));
    expect(screen.getByRole("radio", { name: "Custom" }));
  });

  it("The values set by the beginner radio buttons match the values stated", () => {
    //Arrange
    const setColsSpy = vi.spyOn(mockedProps, "setCols");
    const setRowsSpy = vi.spyOn(mockedProps, "setRows");
    const setBombsSpy = vi.spyOn(mockedProps, "setBombs");

    render(
      <GameDifficulty
        setBombs={mockedProps.setBombs}
        setCols={mockedProps.setCols}
        setRows={mockedProps.setRows}
        setShouldGameReset={mockedProps.setShouldGameReset}
      />
    );

    const expectedCols = Number(
      screen.getByTestId("beginner-width").textContent
    );
    const expectedRows = Number(
      screen.getByTestId("beginner-height").textContent
    );
    const expectedBombs = Number(
      screen.getByTestId("beginner-bombs").textContent
    );

    //Act
    act(() => {
      screen.getByRole("radio", { name: "Beginner" }).click();
      screen.getByRole("button", { name: "Confirm" }).click();
    });

    // Assert
    expect(setColsSpy).toHaveBeenCalledWith(expectedCols);
    expect(setRowsSpy).toHaveBeenCalledWith(expectedRows);
    expect(setBombsSpy).toHaveBeenCalledWith(expectedBombs);
  });

  it("The values set by the intermediate radio buttons match the values stated", () => {
    //Arrange
    const setColsSpy = vi.spyOn(mockedProps, "setCols");
    const setRowsSpy = vi.spyOn(mockedProps, "setRows");
    const setBombsSpy = vi.spyOn(mockedProps, "setBombs");

    render(
      <GameDifficulty
        setBombs={mockedProps.setBombs}
        setCols={mockedProps.setCols}
        setRows={mockedProps.setRows}
        setShouldGameReset={mockedProps.setShouldGameReset}
      />
    );

    const expectedCols = Number(
      screen.getByTestId("intermediate-width").textContent
    );
    const expectedRows = Number(
      screen.getByTestId("intermediate-height").textContent
    );
    const expectedBombs = Number(
      screen.getByTestId("intermediate-bombs").textContent
    );

    //Act
    act(() => {
      screen.getByRole("radio", { name: "Intermediate" }).click();
      screen.getByRole("button", { name: "Confirm" }).click();
    });

    // Assert
    expect(setColsSpy).toHaveBeenCalledWith(expectedCols);
    expect(setRowsSpy).toHaveBeenCalledWith(expectedRows);
    expect(setBombsSpy).toHaveBeenCalledWith(expectedBombs);
  });

  it("The values set by the expert radio buttons match the values stated", () => {
    //Arrange
    const setColsSpy = vi.spyOn(mockedProps, "setCols");
    const setRowsSpy = vi.spyOn(mockedProps, "setRows");
    const setBombsSpy = vi.spyOn(mockedProps, "setBombs");

    render(
      <GameDifficulty
        setBombs={mockedProps.setBombs}
        setCols={mockedProps.setCols}
        setRows={mockedProps.setRows}
        setShouldGameReset={mockedProps.setShouldGameReset}
      />
    );

    const expectedCols = Number(screen.getByTestId("expert-width").textContent);
    const expectedRows = Number(
      screen.getByTestId("expert-height").textContent
    );
    const expectedBombs = Number(
      screen.getByTestId("expert-bombs").textContent
    );

    //Act
    act(() => {
      screen.getByRole("radio", { name: "Expert" }).click();
      screen.getByRole("button", { name: "Confirm" }).click();
    });

    // Assert
    expect(setColsSpy).toHaveBeenCalledWith(expectedCols);
    expect(setRowsSpy).toHaveBeenCalledWith(expectedRows);
    expect(setBombsSpy).toHaveBeenCalledWith(expectedBombs);
  });

  it("The values set by the custom radio buttons match the values stated", () => {
    //Arrange
    const setColsSpy = vi.spyOn(mockedProps, "setCols");
    const setRowsSpy = vi.spyOn(mockedProps, "setRows");
    const setBombsSpy = vi.spyOn(mockedProps, "setBombs");

    render(
      <GameDifficulty
        setBombs={mockedProps.setBombs}
        setCols={mockedProps.setCols}
        setRows={mockedProps.setRows}
        setShouldGameReset={mockedProps.setShouldGameReset}
      />
    );

    const expectedCols = 20;
    const expectedRows = 20;
    const expectedBombs = 100;

    const widthInput = screen.getByTestId("custom-width");
    const heightInput = screen.getByTestId("custom-height");
    const bombsInput = screen.getByTestId("custom-bombs");

    fireEvent.change(widthInput, { target: { value: expectedCols } });
    fireEvent.change(heightInput, { target: { value: expectedRows } });
    fireEvent.change(bombsInput, { target: { value: expectedBombs } });

    //Act
    act(() => {
      screen.getByRole("radio", { name: "Custom" }).click();
      screen.getByRole("button", { name: "Confirm" }).click();
    });

    // Assert
    expect(setColsSpy).toHaveBeenCalledWith(expectedCols);
    expect(setRowsSpy).toHaveBeenCalledWith(expectedRows);
    expect(setBombsSpy).toHaveBeenCalledWith(expectedBombs);
  });
});
