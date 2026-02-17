import { NavLink } from "react-router-dom";
import "../style/NavBar.css";

// Замени на путь к своему логотипу
// Рекомендуемое разрешение: 32x32p x или 64x64px (SVG — любое, масштабируется)
import logo from "../assets/logo.svg";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <div className="navbar__logo">
          {/* logo.svg — положи файл в src/assets/logo.svg */}
          <img src={logo} alt="Логотип" width={32} height={32} />
        </div>
        <NavLink to="/" className="navbar__home-link">
        <span className="navbar__title">ШколаДок</span>
        </NavLink>
      </div>

      <div className="navbar__links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `navbar__link ${isActive ? "navbar__link--active" : ""}`
          }
        >
          Главная
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `navbar__link ${isActive ? "navbar__link--active" : ""}`
          }
        >
          О нас
        </NavLink>
      </div>

      <div className="navbar__auth">
        <NavLink to="/login" className="navbar__btn navbar__btn--outline">
          Войти
        </NavLink>
        <NavLink to="/register" className="navbar__btn navbar__btn--filled">
          Регистрация
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;