import { useState } from "react";
import { Link } from "react-router-dom";
import "../style/Page_schools.css";

const schoolsData = [
  {
    id: 1,
    name: "Школа-гимназия № 17",
    district: "Алматинский",
    type: "Гимназия",
    rating: 4.8,
    students: 850,
    address: "ул. Кенесары, 47",
    hasPlaces: true,
    programs: ["Углублённая математика", "Естественно-научный профиль"],
  },
  {
    id: 2,
    name: "Школа-лицей № 27",
    district: "Есильский",
    type: "Лицей",
    rating: 4.9,
    students: 620,
    address: "пр. Мангилик Ел, 19",
    hasPlaces: true,
    programs: ["Языковой профиль", "Международные программы"],
  },
  {
    id: 3,
    name: "Школа-лицей № 48",
    district: "Сарыаркинский",
    type: "Лицей",
    rating: 4.7,
    students: 540,
    address: "ул. Сейфуллина, 25",
    hasPlaces: false,
    programs: ["Физико-математический профиль"],
  },
  {
    id: 4,
    name: "Средняя школа № 60",
    district: "Алматинский",
    type: "Общеобразовательная",
    rating: 4.5,
    students: 720,
    address: "ул. Жумабаева, 14",
    hasPlaces: true,
    programs: ["Общеобразовательная программа"],
  },
  {
    id: 5,
    name: "Школа-гимназия № 31",
    district: "Байконур",
    type: "Гимназия",
    rating: 4.6,
    students: 680,
    address: "ул. Бейбитшилик, 38",
    hasPlaces: true,
    programs: ["Гуманитарный профиль", "Языковая подготовка"],
  },
  {
    id: 6,
    name: "Средняя школа № 72",
    district: "Нура",
    type: "Общеобразовательная",
    rating: 4.4,
    students: 910,
    address: "ул. Кабанбай батыра, 56",
    hasPlaces: true,
    programs: ["Общеобразовательная программа", "Спортивные классы"],
  },
  {
    id: 7,
    name: "Школа-лицей № 59",
    district: "Есильский",
    type: "Лицей",
    rating: 4.8,
    students: 480,
    address: "ул. Туркестан, 10",
    hasPlaces: false,
    programs: ["IT-профиль", "Инженерная подготовка"],
  },
  {
    id: 8,
    name: "Средняя школа № 83",
    district: "Нура",
    type: "Общеобразовательная",
    rating: 4.3,
    students: 760,
    address: "ул. Улы Дала, 33",
    hasPlaces: true,
    programs: ["Общеобразовательная программа"],
  },
];

function Page_schools() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState("rating");

  // Получаем уникальные районы и типы
  const districts = ["all", ...new Set(schoolsData.map((s) => s.district))];
  const types = ["all", ...new Set(schoolsData.map((s) => s.type))];

  // Фильтрация
  const filteredSchools = schoolsData
    .filter((school) => {
      // Поиск
      const matchesSearch = school.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Фильтр по району
      const matchesDistrict =
        selectedDistrict === "all" || school.district === selectedDistrict;

      // Фильтр по типу
      const matchesType =
        selectedType === "all" || school.type === selectedType;

      // Фильтр по наличию мест
      const matchesAvailability = !showOnlyAvailable || school.hasPlaces;

      return (
        matchesSearch && matchesDistrict && matchesType && matchesAvailability
      );
    })
    // Сортировка
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name);
        case "students":
          return b.students - a.students;
        default:
          return 0;
      }
    });

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDistrict("all");
    setSelectedType("all");
    setShowOnlyAvailable(false);
    setSortBy("rating");
  };

  return (
    <div className="schools-page">
      <div className="schools-container">
        {/* Header */}
        <div className="schools-header">
          <div>
            <h1 className="schools-title">Список школ</h1>
            <p className="schools-subtitle">
              Найдено школ: {filteredSchools.length} из {schoolsData.length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="schools-filters">
          {/* Search */}
          <div className="filter-search">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="search-icon"
            >
              <path
                d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Поиск по названию школы..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="filter-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="search-clear"
                aria-label="Очистить"
              >
                ×
              </button>
            )}
          </div>

          {/* District Filter */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="filter-select"
          >
            <option value="all">Все районы</option>
            {districts
              .filter((d) => d !== "all")
              .map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="filter-select"
          >
            <option value="all">Все типы</option>
            {types
              .filter((t) => t !== "all")
              .map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="rating">По рейтингу</option>
            <option value="name">По названию</option>
            <option value="students">По количеству учеников</option>
          </select>

          {/* Checkbox */}
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={showOnlyAvailable}
              onChange={(e) => setShowOnlyAvailable(e.target.checked)}
            />
            <span>Только с местами</span>
          </label>

          {/* Reset */}
          <button onClick={handleResetFilters} className="btn btn--ghost btn--sm">
            Сбросить
          </button>
        </div>

        {/* Schools Grid */}
        {filteredSchools.length > 0 ? (
          <div className="schools-grid">
            {filteredSchools.map((school) => (
              <div key={school.id} className="school-card">
                <div className="school-card-header">
                  <div>
                    <h3 className="school-card-title">{school.name}</h3>
                    <p className="school-card-address">{school.address}</p>
                  </div>
                  <div className="school-rating">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="currentColor"
                    >
                      <path d="M9 1l2.5 5.5L17 7.3l-4 3.9.9 5.8L9 14.5 4.1 17l.9-5.8-4-3.9 5.5-.8L9 1z" />
                    </svg>
                    {school.rating}
                  </div>
                </div>

                <div className="school-card-body">
                  <div className="school-info-grid">
                    <div className="school-info-item">
                      <span className="school-info-label">Район</span>
                      <span className="school-info-value">
                        {school.district}
                      </span>
                    </div>
                    <div className="school-info-item">
                      <span className="school-info-label">Тип</span>
                      <span className="school-info-value">{school.type}</span>
                    </div>
                    <div className="school-info-item">
                      <span className="school-info-label">Учеников</span>
                      <span className="school-info-value">
                        {school.students}
                      </span>
                    </div>
                    <div className="school-info-item">
                      <span className="school-info-label">Места</span>
                      <span
                        className={`school-badge ${
                          school.hasPlaces
                            ? "school-badge--success"
                            : "school-badge--error"
                        }`}
                      >
                        {school.hasPlaces ? "Есть" : "Нет"}
                      </span>
                    </div>
                  </div>

                  <div className="school-programs">
                    {school.programs.map((program, idx) => (
                      <span key={idx} className="school-program-tag">
                        {program}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="school-card-footer">
                  <Link
                    to="/register"
                    className={`btn ${
                      school.hasPlaces ? "btn--primary" : "btn--ghost"
                    } btn--block btn--sm`}
                    disabled={!school.hasPlaces}
                  >
                    {school.hasPlaces
                      ? "Подать заявление"
                      : "Мест нет"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="schools-empty">
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              className="schools-empty-icon"
            >
              <path
                d="M32 48c8.837 0 16-7.163 16-16s-7.163-16-16-16-16 7.163-16 16 7.163 16 16 16z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M32 26v6M32 38h.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <p className="schools-empty-text">
              По вашему запросу школы не найдены
            </p>
            <button onClick={handleResetFilters} className="btn btn--primary">
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page_schools;