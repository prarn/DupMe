import Page404 from "./Pages/Page404/Page404";
import Home from "./Pages/Home/Home";
import Piano from "./components/Piano/Piano";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/piano" element={<Piano />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}

export default App;
