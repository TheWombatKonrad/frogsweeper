import { useRef, useState } from "react";
import "./GameDifficulty.css";

function GameDifficulty(props: {
  setBombs: React.Dispatch<React.SetStateAction<number>>;
  setCols: React.Dispatch<React.SetStateAction<number>>;
  setRows: React.Dispatch<React.SetStateAction<number>>;
  setShouldGameReset: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const customCols = useRef<HTMLInputElement>(null);
  const customRows = useRef<HTMLInputElement>(null);
  const customBombs = useRef<HTMLInputElement>(null);
  const [difficulty, setDifficulty] = useState<string>();
  const [maxBombs, setMaxBombs] = useState<number>(1);

  const handleSubmit = (e: any) => {
    e.preventDefault(); //prevent page refresh
    if (difficulty === "beginner") setBeginner();
    if (difficulty === "intermediate") setIntermediate();
    if (difficulty === "expert") setExpert();
    if (difficulty === "custom") setCustom();
    props.setShouldGameReset(true);
    document.getElementById("close-modal-button")?.click();
  };

  const setBeginner = () => {
    props.setCols(9);
    props.setRows(9);
    props.setBombs(10);
  };

  const setIntermediate = () => {
    props.setCols(16);
    props.setRows(16);
    props.setBombs(40);
  };

  const setExpert = () => {
    props.setCols(30);
    props.setRows(16);
    props.setBombs(99);
  };

  const setCustom = () => {
    props.setCols(parseInt(customCols.current!.value));
    props.setRows(parseInt(customRows.current!.value));
    props.setBombs(parseInt(customBombs.current!.value));
  };

  const onDifficultyChange = (e: any) => {
    setDifficulty(e.currentTarget.value);

    if (e.currentTarget.value === "custom") {
      setCustomInputsRequired();
    } else {
      setCustomInputsNotRequired();
    }
  };

  const setCustomInputsRequired = () => {
    const inputs = document.querySelectorAll<HTMLInputElement>(".custom-input");

    inputs.forEach((element) => (element.required = true));
  };

  const setCustomInputsNotRequired = () => {
    const inputs = document.querySelectorAll<HTMLInputElement>(".custom-input");

    inputs.forEach((element) => (element.required = false));
  };

  const setMaxBombsAllowed = () => {
    const bombs = parseInt(customCols.current!.value);
    const rows = parseInt(customRows.current!.value);

    setMaxBombs(bombs * rows - 1);
  };

  return (
    <form className="game-difficulty" onSubmit={handleSubmit}>
      <div id="difficulty-headers" className="difficulty-row">
        <div className="difficulty"></div>
        <div className="difficulty-options">
          <div>Width</div>
          <div>Height</div>
          <div>Mines</div>
        </div>
      </div>

      <div className="difficulty-row">
        <label className="difficulty">
          <input
            type="radio"
            name="difficulty"
            id="beginner"
            value="beginner"
            onChange={(e) => onDifficultyChange(e)}
          />
          Beginner
        </label>
        <div className="difficulty-options">
          <div data-testid="beginner-width">9</div>
          <div data-testid="beginner-height">9</div>
          <div data-testid="beginner-bombs">10</div>
        </div>
      </div>

      <div className="difficulty-row">
        <label className="difficulty">
          <input
            type="radio"
            name="difficulty"
            id="intermediate"
            value="intermediate"
            onChange={(e) => onDifficultyChange(e)}
          />
          Intermediate
        </label>
        <div className="difficulty-options">
          <div data-testid="intermediate-width">16</div>
          <div data-testid="intermediate-height">16</div>
          <div data-testid="intermediate-bombs">40</div>
        </div>
      </div>

      <div className="difficulty-row">
        <label className="difficulty">
          <input
            type="radio"
            name="difficulty"
            id="expert"
            value="expert"
            onChange={(e) => onDifficultyChange(e)}
          />
          Expert
        </label>
        <div className="difficulty-options">
          <div data-testid="expert-width">30</div>
          <div data-testid="expert-height">16</div>
          <div data-testid="expert-bombs">99</div>
        </div>
      </div>

      <div className="difficulty-row">
        <label className="difficulty">
          <input
            type="radio"
            name="difficulty"
            id="custom"
            value="custom"
            onChange={(e) => onDifficultyChange(e)}
          />
          Custom
        </label>

        <div className="difficulty-options">
          <div>
            <input
              ref={customCols}
              onChange={setMaxBombsAllowed}
              type="number"
              max="99"
              min="8"
              step="1"
              className="custom-input"
              placeholder="9"
              data-testid="custom-width"
            />
          </div>

          <div>
            <input
              ref={customRows}
              onChange={setMaxBombsAllowed}
              type="number"
              max="99"
              min="1"
              step="1"
              className="custom-input"
              placeholder="9"
              data-testid="custom-height"
            />
          </div>

          <div>
            <input
              ref={customBombs}
              type="number"
              max={isNaN(maxBombs) ? 1 : maxBombs}
              min="1"
              step="1"
              className="custom-input"
              placeholder="10"
              data-testid="custom-bombs"
            />
          </div>
        </div>
      </div>

      <button type="submit">Confirm</button>
    </form>
  );
}

export default GameDifficulty;
