import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../style/Page_auth.css";

function Page_login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Убираем ошибку при вводе
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Введите корректный email";
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен быть не менее 6 символов";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      login(formData.email, formData.password);
      navigate("/profile");
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Вход в систему</h1>
            <p className="auth-subtitle">
              Войдите в свой аккаунт для подачи заявления
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {errors.submit && (
              <div className="alert alert--error">{errors.submit}</div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="example@mail.com"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? "form-input--error" : ""}`}
                disabled={isSubmitting}
              />
              {errors.email && (
                <span className="form-error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Введите пароль"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? "form-input--error" : ""}`}
                disabled={isSubmitting}
              />
              {errors.password && (
                <span className="form-error">{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--block"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Вход..." : "Войти"}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-link-text">
              Нет аккаунта?{" "}
              <Link to="/register" className="auth-link">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page_login;