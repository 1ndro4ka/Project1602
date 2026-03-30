import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/Page_schools.css";
import CustomSelect from "../components/CustomSelect";

function Page_schools() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [schoolsData, setSchoolsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const districts = ["all", ...new Set(schoolsData.map((s) => s.district))];
  const types = ["all", ...new Set(schoolsData.map((s) => s.type))];

  const districtOptions = districts.map((d) => ({
    value: d,
    label: d === "all" ? "Все районы" : d,
  }));

  const typeOptions = types.map((t) => ({
    value: t,
    label: t === "all" ? "Все типы" : t,
  }));

  const sortOptions = [
    { value: "rating", label: "По рейтингу" },
    { value: "name", label: "По названию" },
    { value: "students", label: "По количеству учеников" },
  ];

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/schools")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch schools");
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        const mapped = data.map((s) => ({
          id: s._id,
          name: s.name,
          address: s.address || "",
          district: s.district || "",
          type: s.type || "",
          rating: s.rating ?? 0,
          students: s.studentsCount ?? 0,
          hasPlaces: !!s.hasPlaces,
          programs: s.programs || [],
        }));
        setSchoolsData(mapped);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message);
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredSchools = schoolsData
    .filter((school) => {
      const matchesSearch = school.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDistrict =
        selectedDistrict === "all" || school.district === selectedDistrict;
      const matchesType =
        selectedType === "all" || school.type === selectedType;
      const matchesAvailability = !showOnlyAvailable || school.hasPlaces;
      return matchesSearch && matchesDistrict && matchesType && matchesAvailability;
    })
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
        <div className="schools-header">
          <div>
            <h1 className="schools-title">Список школ</h1>
            <p className="schools-subtitle">
              Найдено школ: {filteredSchools.length} из {schoolsData.length}
            </p>
          </div>
        </div>

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

          {/* District */}
          <CustomSelect
            value={selectedDistrict}
            onChange={setSelectedDistrict}
            options={districtOptions}
          />

          {/* Type */}
          <CustomSelect
            value={selectedType}
            onChange={setSelectedType}
            options={typeOptions}
          />

          {/* Sort */}
          <CustomSelect
            value={sortBy}
            onChange={setSortBy}
            options={sortOptions}
          />

          {/* Checkbox */}
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={showOnlyAvailable}
              onChange={(e) => setShowOnlyAvailable(e.target.checked)}
            />
            <span className="custom-checkbox" aria-hidden="true" />
            <span>Только с местами</span>
          </label>

          {/* Reset */}
          <button
            onClick={handleResetFilters}
            className="btn btn--ghost btn--sm"
          >
            Сбросить
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="schools-loading">Загрузка школ...</div>
        ) : error ? (
          <div className="schools-error">Ошибка: {error}</div>
        ) : schoolsData.length === 0 ? (
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
            <p className="schools-empty-text">Школ в базе данных не найдено</p>
          </div>
        ) : filteredSchools.length > 0 ? (
          <div className="schools-grid">
            {filteredSchools.map((school) => (
              <div key={school.id} className="school-card">
                <div className="school-card-header">
                  <div>
                    <h3 className="school-card-title">{school.name}</h3>
                    <p className="school-card-address">{school.address}</p>
                  </div>
                  <div className="school-rating">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                      <path d="M9 1l2.5 5.5L17 7.3l-4 3.9.9 5.8L9 14.5 4.1 17l.9-5.8-4-3.9 5.5-.8L9 1z" />
                    </svg>
                    {school.rating}
                  </div>
                </div>

                <div className="school-card-body">
                  <div className="school-info-grid">
                    <div className="school-info-item">
                      <span className="school-info-label">Район</span>
                      <span className="school-info-value">{school.district}</span>
                    </div>
                    <div className="school-info-item">
                      <span className="school-info-label">Тип</span>
                      <span className="school-info-value">{school.type}</span>
                    </div>
                    <div className="school-info-item">
                      <span className="school-info-label">Учеников</span>
                      <span className="school-info-value">{school.students}</span>
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
                    {school.hasPlaces ? "Подать заявление" : "Мест нет"}
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
            <p className="schools-empty-text">По вашему запросу школы не найдены</p>
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