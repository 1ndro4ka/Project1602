import { Link } from "react-router-dom";
import "../style/Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* About */}
          <div className="footer-column">
            <h3 className="footer-title">ШколаДок</h3>
            <p className="footer-desc">
              Современная система электронной регистрации для поступления в
              школы Республики Казахстан
            </p>
          </div>

          {/* Navigation */}
          <div className="footer-column">
            <h4 className="footer-heading">Навигация</h4>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">
                  О системе
                </Link>
              </li>
              <li>
                <Link to="/schools" className="footer-link">
                  Список школ
                </Link>
              </li>
              <li>
                <Link to="/profile" className="footer-link">
                  Личный кабинет
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="footer-column">
            <h4 className="footer-heading">Аккаунт</h4>
            <ul className="footer-links">
              <li>
                <Link to="/register" className="footer-link">
                  Регистрация
                </Link>
              </li>
              <li>
                <Link to="/login" className="footer-link">
                  Вход
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-column">
            <h4 className="footer-heading">Контакты</h4>
            <ul className="footer-contact">
              <li>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  className="footer-icon"
                >
                  <path
                    d="M15 12.5c-1.25 0-2.45-.2-3.57-.57a1 1 0 00-1.01.24l-2.2 2.2a12.1 12.1 0 01-5.59-5.59l2.2-2.2a1 1 0 00.24-1.01A11.36 11.36 0 014.5 3a1 1 0 00-1-1h-2a1 1 0 00-1 1c0 7.73 6.27 14 14 14a1 1 0 001-1v-2a1 1 0 00-1-1z"
                    fill="currentColor"
                  />
                </svg>
                <span>+7 (727) 123-45-67</span>
              </li>
              <li>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  className="footer-icon"
                >
                  <path
                    d="M3 3h12a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M2 4l7 5 7-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span>info@schooldoc.kz</span>
              </li>
              <li>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  className="footer-icon"
                >
                  <path
                    d="M9 9.5a2 2 0 100-4 2 2 0 000 4z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M9 1C6.24 1 4 3.24 4 6c0 3.75 5 10 5 10s5-6.25 5-10c0-2.76-2.24-5-5-5z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span>г. Алматы, пр. Абая, 150</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} ШколаДок. Все права защищены.
          </p>
          <div className="footer-legal">
            <a href="#" className="footer-legal-link">
              Политика конфиденциальности
            </a>
            <span className="footer-divider">·</span>
            <a href="#" className="footer-legal-link">
              Условия использования
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;