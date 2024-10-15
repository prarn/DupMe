import Page404 from './Pages/Page404/Page404';
import Home from './Pages/Home/Home';
import Piano from './Piano/Piano';
import { Route, Routes } from "react-router-dom";
import Rooms from './Rooms';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/piano" element={<Piano />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  )
}

export default App;