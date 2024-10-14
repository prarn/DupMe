import { Link } from "react-router-dom";

function Home() {
    return (
        <h1 className="home-menu">
            <Link to='/'>
                <button>Home</button>
            </Link>
            <p></p>
            <Link to='/piano'>
                <button>Game</button>
            </Link>
        </h1>
    )
}
export default Home;
