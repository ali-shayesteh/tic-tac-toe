import { useState } from "react";
import "./App.css";
import Main from "./components/main";
import Select from "./components/pages/select";

function App() {
  const [mode, setMode] = useState(null);
  const selectMode = (mode) => {
    setMode(mode);
  };
  return (
    <div className="container">
      {mode ? <Main mode={mode} /> : <Select onClick={selectMode} />}
    </div>
  );
}

export default App;
