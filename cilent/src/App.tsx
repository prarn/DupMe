import Page404 from './Pages/Page404/Page404';
import Home from './Pages/Home/Home';
import Piano from './Pages/Game/Piano';
import SoundTesting from './Pages/SoundTesting/SoundTesting'
import InLobby from './Pages/InLobby/InLobby';
import Select from './Pages/Select/Select';
import { Route, Routes } from "react-router-dom";
import Rooms from './Pages/Rooms/Rooms';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/piano" element={<Piano />} />
        <Route path='/soundtesting' element={<SoundTesting />} />
        <Route path='/inlobby' element={<InLobby />} />
        <Route path='/select' element={<Select />} />


        {/* <Route path="*" element={<Page404 />} /> */}
      </Routes>
    </div>
  );
}

export default App;
