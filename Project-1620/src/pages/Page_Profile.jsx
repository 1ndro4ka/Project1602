import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../style/Page_profile.css";

function Page_profile() {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
    });
    setIsEditing(false);
  };

  // Пример заявлений (будет расширено в следующих итерациях)
  const applications = [
    {
      id: 1,
      schoolName: "МБОУ «Школа № 112»",
      childName: "Иванов Иван Иванович",
      class: "1 «А»",
      status: "На рассмотрении",
      date: "2025-02-15",
    },
  ];

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div>
            <h1 className="profile-title">Личный кабинет</h1>
            <p className="profile-subtitle">
              Управляйте своими заявлениями и профилем
            </p>
          </div>
          <button onClick={handleLogout} className="btn btn--ghost">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M7 13L3 9m0 0l4-4M3 9h9m3-6v12a1 1 0 01-1 1H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Выйти
          </button>
        </div>

        <div className="profile-grid">
          {/* User Info Card */}
          <div className="profile-card">
            <div className="profile-card-header">
              <h2 className="profile-card-title">Информация о профиле</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-icon"
                  aria-label="Редактировать"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M13 3l2 2-9 9H4v-2l9-9z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>

            <div className="profile-card-body">
              {!isEditing ? (
                <div className="profile-info">
                  <div className="profile-info-item">
                    <span className="profile-info-label">ФИО</span>
                    <span className="profile-info-value">{user?.fullName}</span>
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-info-label">Email</span>
                    <span className="profile-info-value">{user?.email}</span>
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-info-label">Телефон</span>
                    <span className="profile-info-value">{user?.phone}</span>
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-info-label">
                      Дата регистрации
                    </span>
                    <span className="profile-info-value">
                      {new Date(user?.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="profile-edit-form">
                  <div className="form-group">
                    <label htmlFor="fullName" className="form-label">
                      ФИО
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Телефон
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="profile-edit-actions">
                    <button
                      onClick={handleSave}
                      className="btn btn--primary btn--sm"
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn btn--ghost btn--sm"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-icon stat-icon--primary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M9 11l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <div className="stat-value">1</div>
                <div className="stat-label">Активных заявлений</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon--success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <div className="stat-value">0</div>
                <div className="stat-label">Одобренных</div>
              </div>
            </div>
          </div>

          {/* Applications */}
          <div className="profile-card profile-card--full">
            <div className="profile-card-header">
              <h2 className="profile-card-title">Мои заявления</h2>
              <button className="btn btn--primary btn--sm">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M9 4v10M4 9h10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Новое заявление
              </button>
            </div>

            <div className="profile-card-body">
              {applications.length > 0 ? (
                <div className="applications-list">
                  {applications.map((app) => (
                    <div key={app.id} className="application-card">
                      <div className="application-header">
                        <div>
                          <h3 className="application-school">{app.schoolName}</h3>
                          <p className="application-child">{app.childName}</p>
                        </div>
                        <span className="badge badge--warning">
                          {app.status}
                        </span>
                      </div>
                      <div className="application-details">
                        <div className="application-detail">
                          <span className="application-detail-label">
                            Класс
                          </span>
                          <span className="application-detail-value">
                            {app.class}
                          </span>
                        </div>
                        <div className="application-detail">
                          <span className="application-detail-label">
                            Дата подачи
                          </span>
                          <span className="application-detail-value">
                            {new Date(app.date).toLocaleDateString("ru-RU")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    className="empty-state-icon"
                  >
                    <rect
                      x="12"
                      y="12"
                      width="40"
                      height="40"
                      rx="4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M20 28h24M20 36h16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <p className="empty-state-text">
                    У вас пока нет заявлений
                  </p>
                  <button className="btn btn--primary">
                    Подать первое заявление
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page_profile;