import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import "../style/NavBar.css";
import logo from "../assets/logo.svg";

function NavBar() {
  const { isAuthenticated, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuOpen && navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }

    function handleScroll() {
      if (menuOpen) setMenuOpen(false);
    }

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, { passive: true });
    };
  }, [menuOpen]);

  return (
    <nav className="navbar" ref={navRef}>
      {/* Brand */}
      <NavLink to="/" className="navbar__brand-link" onClick={closeMenu}>
        <div className="navbar__brand">
          <img src={logo} alt="Логотип" width={32} height={32} />
          <span className="navbar__title">ШколаДок</span>
        </div>
      </NavLink>

      {/* Desktop links */}
      <div className="navbar__links">
        <NavLink to="/" className="navbar__link">Главная</NavLink>
        <NavLink to="/about" className="navbar__link">О системе</NavLink>
        <NavLink to="/schools" className="navbar__link">Школы</NavLink>
      </div>

      {/* Desktop auth */}
      <div className="navbar__auth">
        {isAuthenticated ? (
          <NavLink to="/profile" className="navbar__user">
            {user?.fullName?.split(" ")[0] || "Профиль"}
          </NavLink>
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

      {/* Burger */}
      <button
        className={`navbar__burger ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Открыть меню"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile menu */}
      <div className={`navbar__mobile ${menuOpen ? "open" : ""}`}>
        <NavLink to="/" onClick={closeMenu}>Главная</NavLink>
        <NavLink to="/about" onClick={closeMenu}>О системе</NavLink>
        <NavLink to="/schools" onClick={closeMenu}>Школы</NavLink>

        <div className="navbar__mobile-auth">
          {isAuthenticated ? (
            <NavLink to="/profile" onClick={closeMenu}>
              Профиль
            </NavLink>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMenu}>Войти</NavLink>
              <NavLink to="/register" onClick={closeMenu}>Регистрация</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
