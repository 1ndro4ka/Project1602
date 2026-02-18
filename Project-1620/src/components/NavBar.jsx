import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../style/NavBar.css";

// Рекомендуемое разрешение: 32x32px или 64x64px (SVG — любое, масштабируется)
import logo from "../assets/logo.svg";

function NavBar() {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar__brand-link">
        <div className="navbar__brand">
          <div className="navbar__logo">
            <img src={logo} alt="Логотип" width={32} height={32} />
          </div>
          <span className="navbar__title">ШколаДок</span>
        </div>
      </NavLink>

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
          О системе
        </NavLink>
        <NavLink
          to="/schools"
          className={({ isActive }) =>
            `navbar__link ${isActive ? "navbar__link--active" : ""}`
          }
        >
          Школы
        </NavLink>
      </div>

      <div className="navbar__auth">
        {isAuthenticated ? (
          <>
            <NavLink to="/profile" className="navbar__user">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="navbar__user-icon"
              >
                <path
                  d="M10 10a4 4 0 100-8 4 4 0 000 8zM3 18a7 7 0 0114 0"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="navbar__user-name">{user?.fullName?.split(' ')[0] || 'Профиль'}</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login" className="navbar__btn navbar__btn--outline">
              Войти
            </NavLink>
            <NavLink to="/register" className="navbar__btn navbar__btn--filled">
              Регистрация
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;