import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-menu">
      <div>
        <Link to="/">
          <img
            src="/homepage_image/DupMe.png"
            alt="DupMe"
            className="dupme-logo"
          />
        </Link>
      </div>

      <Link to="/rooms">
        <img
          className="findgame-button"
          src="/homepage_image/findgame.png"
          alt="findgame button"
        />
      </Link>

      <Link to="/select">
        <img
          className="soundtesting-button"
          src="/homepage_image/soundtesting.png"
          alt="soundtesting button"
        />
      </Link >
      <Link to="/backgroundchange">
      <img
        className="changebg-button"
        src="/homepage_image/changebg.png"
        alt="changebg button"
      />
      </Link>
    </div>
  );
}
export default Home;
