import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Split from "./components/Split";
import Merge from "./components/Merge";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/split" element={<Split />} />
          <Route path="/merge" element={<Merge />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
