import Page404 from "./Pages/Page404/Page404";
import Home from "./Pages/Home/Home";
import Game from "./Pages/Game/Game";
import SoundTesting from "./Pages/SoundTesting/SoundTesting";
import InLobby from "./Pages/InLobby/InLobby";
import Select from "./Pages/Select/Select";
import { Route, Routes } from "react-router-dom";
import Rooms from "./Pages/Rooms/Rooms";
import BackgroundChange from "./Pages/BackgroundChange/BackgroundChange";
import Avatar from "./Pages/Avatar/Avatar";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/game" element={<Game />} />
        <Route path="/soundtesting" element={<SoundTesting />} />
        <Route path="/inlobby" element={<InLobby />} />
        <Route path="/select" element={<Select />} />
        <Route path="*" element={<Page404 />} />
        <Route path="/backgroundchange" element={<BackgroundChange />} />
        <Route path="/avatar" element={<Avatar />} />
      </Routes>
    </div>
  );
}

export default App;
