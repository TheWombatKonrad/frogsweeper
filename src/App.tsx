import { useState } from "react";
import "./App.css";
import GameDifficulty from "./Controls/GameDifficulty";
import CustomModal from "./CustomModal";
import GameBoard from "./GameBoard";
import Controls from "./Controls/Controls";

function App() {
  const [cols, setCols] = useState<number>(30);
  const [rows, setRows] = useState<number>(16);
  const [bombs, setBombs] = useState<number>(99);
  const [shouldGameReset, setShouldGameReset] = useState<boolean>(false);

  return (
    <div id="outer-window">
      <div id="inner-window">
        <div id="top-bar">
          <ul id="controls">
            <li>
              <CustomModal
                title="Game Difficulty"
                content={
                  <GameDifficulty
                    setBombs={setBombs}
                    setCols={setCols}
                    setRows={setRows}
                    setShouldGameReset={setShouldGameReset}
                  />
                }
              />
            </li>
            <li>
              <CustomModal title="Controls" content={<Controls />} />
            </li>
            <li id="music">Frog music coming soon!</li>
          </ul>
        </div>
        <div id="gameboard-table">
          <GameBoard
            cols={cols}
            rows={rows}
            bombs={bombs}
            shouldGameReset={shouldGameReset}
            setShouldGameReset={setShouldGameReset}
          />
        </div>
      </div>
      {/* <div id="sidebar"></div> */}
    </div>
  );
}

export default App;
