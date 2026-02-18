import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../style/Page_auth.css";

function Page_register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "ФИО обязательно";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "ФИО должно содержать минимум 3 символа";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Введите корректный email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Телефон обязателен";
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Введите корректный номер телефона";
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен быть не менее 6 символов";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Подтвердите пароль";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
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
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };
      
      register(userData);
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
            <h1 className="auth-title">Регистрация</h1>
            <p className="auth-subtitle">
              Создайте аккаунт для подачи заявления в школу
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {errors.submit && (
              <div className="alert alert--error">{errors.submit}</div>
            )}

            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                ФИО родителя
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Иванов Иван Иванович"
                value={formData.fullName}
                onChange={handleChange}
                className={`form-input ${errors.fullName ? "form-input--error" : ""}`}
                disabled={isSubmitting}
              />
              {errors.fullName && (
                <span className="form-error">{errors.fullName}</span>
              )}
            </div>

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
              <label htmlFor="phone" className="form-label">
                Телефон
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+7 (XXX) XXX-XX-XX"
                value={formData.phone}
                onChange={handleChange}
                className={`form-input ${errors.phone ? "form-input--error" : ""}`}
                disabled={isSubmitting}
              />
              {errors.phone && (
                <span className="form-error">{errors.phone}</span>
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
                placeholder="Минимум 6 символов"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? "form-input--error" : ""}`}
                disabled={isSubmitting}
              />
              {errors.password && (
                <span className="form-error">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Подтверждение пароля
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Повторите пароль"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${errors.confirmPassword ? "form-input--error" : ""}`}
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <span className="form-error">{errors.confirmPassword}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--block"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-link-text">
              Уже есть аккаунт?{" "}
              <Link to="/login" className="auth-link">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page_register;