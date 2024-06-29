import "./Controls.css";

function Controls() {
  return (
    <div id="controls-info">
      <div id="controls-desktop">
        <h3>Desktop</h3>
        <ul>
          <li>
            <b>Left-click</b> a cell to reveal its content
          </li>
          <li>
            <b>Right-click</b> a cell to mark a frog.
          </li>
        </ul>
      </div>
      <div id="controls-mobile">
        <h3>Mobile</h3>
        <span>Coming soon!</span>
      </div>
    </div>
  );
}

export default Controls;
