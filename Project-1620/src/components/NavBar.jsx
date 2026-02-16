import { NavLink, Routes, Route } from "react-router-dom";


function NavBar() {
    return(
        <nav>
        <div className="nav-right">
        <NavLink to="/">Главная</NavLink> {" | "}
        <NavLink to="/about">О нас</NavLink>
        </div>
        <div className="nav-log">
            <NavLink to="/login">Войти</NavLink> {" | "}
            <NavLink to="/register">Регистрация</NavLink>
        </div>

        </nav>
    )
}

export default NavBar;