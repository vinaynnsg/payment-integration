import React from "react";
import './style.css';
import Banner from "../images/banner.jpeg";
import { NavLink } from "react-router-dom";


function Home() {
    const auth = localStorage.getItem('user');

    const logout = () => {
        localStorage.removeItem("user")
        window.location.reload()
    }
    const deleteAccount = () => {
        localStorage.clear()
        window.location.reload()
    }

    return (
        <div>
            <div className="home" style={{ backgroundImage: `url(${Banner})` }}>
                <h2>Best Online Food In India</h2>
                <p>Welcome 
                    ({ JSON.parse(auth).name})</p>
                <button onClick={logout} className="logout">LogOut</button>
                <button onClick={deleteAccount} className="delete">Delete Acc. </button>
                <div className="headerContainer">

                    <NavLink to="/">
                        <button className ="ordernow">ORDER NOW</button>
                    </NavLink>
                </div>


            </div>
        </div>
    );
}
export default Home;

