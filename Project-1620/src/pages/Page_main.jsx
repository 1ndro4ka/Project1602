import { Link } from "react-router-dom";
import "../style/Page_main.css";

// ── Импорты изображений для info-блока ────────────────────────
// Рекомендуемое разрешение: 64x64px (SVG или PNG с прозрачностью)
import imgPortal from "../assets/portal.svg";
import imgDocs from "../assets/docs.svg";
import imgCheck from "../assets/check.svg";

// ── Импорты иконок для секции features ───────────────
// Рекомендуемое разрешение: 32x32px SVG
import iconSecurity from "../assets/icon-security.svg";
import iconMobile   from "../assets/icon-mobile.svg";
import iconSpeed    from "../assets/icon-speed.svg";
import iconSchool   from "../assets/icon-school.svg";

const stats = [
  { value: "500+", label: "Школ подключено" },
  { value: "12 000+", label: "Заявлений обработано" },
  { value: "3 мин", label: "Среднее время подачи" },
  { value: "100%", label: "Юридически значимо" },
];

const steps = [
  {
    step: "01",
    title: "Создайте аккаунт",
    desc: "Зарегистрируйтесь за 2 минуты. Достаточно email и номера телефона.",
  },
  {
    step: "02",
    title: "Заполните заявление",
    desc: "Введите данные ребёнка и загрузите необходимые документы онлайн.",
  },
  {
    step: "03",
    title: "Получите подтверждение",
    desc: "Уведомление придёт на email и телефон. Отслеживайте статус в личном кабинете.",
  },
];

const features = [
  {
    icon: iconSecurity,
    iconAlt: "Безопасность",
    title: "Безопасность данных",
    desc: "Все документы хранятся в зашифрованном виде в соответствии с законодательством о защите персональных данных.",
  },
  {
    icon: iconMobile,
    iconAlt: "Мобильная версия",
    title: "Мобильная версия",
    desc: "Подайте документы с любого устройства — компьютера, планшета или смартфона.",
  },
  {
    icon: iconSpeed,
    iconAlt: "Мгновенный ответ",
    title: "Мгновенный ответ",
    desc: "Статус заявки обновляется в реальном времени. Никаких звонков и ожиданий.",
  },
  {
    icon: iconSchool,
    iconAlt: "Все районы",
    title: "Все районы города",
    desc: "Система охватывает государственные и муниципальные школы всех районов.",
  },
];

function Page_main() {
  return (
    <div className="main">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__grid" />
        </div>

        <div className="hero__inner">
          <div className="hero__content">
            <div className="hero__badge">
              <span className="hero__badge-dot" />
              Система работает · 2025
            </div>

            <h1 className="hero__heading">
              Онлайн-запись<br />
              <span className="hero__heading-accent">в школу</span>
            </h1>

            <p className="hero__sub">
              Подайте документы и зарегистрируйте ребёнка в школу не выходя из дома.
              Быстро, официально и без очередей.
            </p>

            <div className="hero__actions">
              <Link to="/register" className="btn btn--primary btn--lg">
                Подать заявление
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9h10M9 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/about" className="btn btn--ghost btn--lg">
                Узнать подробнее
              </Link>
            </div>

            <div className="hero__stats">
              {stats.map((s) => (
                <div key={s.label} className="hero__stat">
                  <span className="hero__stat-value">{s.value}</span>
                  <span className="hero__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__card hero__card--main">
              <div className="hero__card-header">
                <div className="hero__card-dots">
                  <span /><span /><span />
                </div>
                <span className="hero__card-title">Новое заявление</span>
              </div>
              <div className="hero__card-body">
                <div className="hero__field">
                  <label>Ребёнок</label>
                  <div className="hero__field-val">Зарахов Берс Берсович</div>
                </div>
                <div className="hero__field">
                  <label>Школа</label>
                  <div className="hero__field-val">МБОУ «Школа № 112»</div>
                </div>
                <div className="hero__field">
                  <label>Класс</label>
                  <div className="hero__field-val">1 «А»</div>
                </div>
                <div className="hero__field">
                  <label>Статус</label>
                  <div className="hero__field-val hero__field-val--status">
                    <span className="status-dot" />На рассмотрении
                  </div>
                </div>
              </div>
            </div>

            <div className="hero__card hero__card--badge">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M4 11l5 5L18 6" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Заявление принято!</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── INFO BLOCK ──────────────────────────────────────── */}
      <section className="info">
        <div className="section-inner">
          <div className="section-label">Что такое система</div>
          <h2 className="section-heading">
            Цифровой приём документов<br />для поступления в школу
          </h2>
          <p className="section-desc">
            Электронная система регистрации позволяет родителям подать документы для зачисления
            ребёнка в 1-й класс без визита в школу. Процесс полностью легитимен и соответствует
            требованиям Министерства образования и науки РК.
          </p>

          <div className="info__grid">
            <div className="info__image-block">
              {/* Рекомендуемое разрешение: 64x64px SVG или PNG */}
              <div className="info__img info__img--main">
                <img src={imgPortal} alt="Официальный портал" width={64} height={64} />
                <div className="info__img-label">Официальный портал</div>
              </div>

              {/* Рекомендуемое разрешение: 48x48px SVG или PNG */}
              <div className="info__img info__img--secondary">
                <img src={imgDocs} alt="Все документы онлайн" width={48} height={48} />
                <div className="info__img-label">Все документы онлайн</div>
              </div>

              {/* Рекомендуемое разрешение: 48x48px SVG или PNG */}
              <div className="info__img info__img--tertiary">
                <img src={imgCheck} alt="Мгновенное зачисление" width={48} height={48} />
                <div className="info__img-label">Мгновенное зачисление</div>
              </div>
            </div>

            <div className="info__text-block">
              <div className="info__highlight">
                <p>
                  Система разработана в соответствии с требованиями Министерства образования и науки РК
                  и полностью заменяет бумажный документооборот при зачислении в 1-й класс.
                </p>
              </div>

              <ul className="info__list">
                <li>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9l4 4 8-8" stroke="#1e4fc2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Подача заявления за 3 минуты через браузер
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9l4 4 8-8" stroke="#1e4fc2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Загрузка сканов / фото документов
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9l4 4 8-8" stroke="#1e4fc2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Отслеживание статуса в личном кабинете
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9l4 4 8-8" stroke="#1e4fc2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Уведомления на email и SMS
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9l4 4 8-8" stroke="#1e4fc2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Хранение документов в защищённом облаке
                </li>
              </ul>

              <div className="info__actions">
                <Link to="/register" className="btn btn--primary">
                  Начать регистрацию
                </Link>
                <Link to="/about" className="btn btn--secondary">
                  Подробнее о системе
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STEPS ───────────────────────────────────────────── */}
      <section className="steps">
        <div className="section-inner">
          <div className="section-label">Как это работает</div>
          <h2 className="section-heading">Три шага до зачисления</h2>

          <div className="steps__list">
            {steps.map((s, i) => (
              <div className="step-card" key={i}>
                <div className="step-card__num">{s.step}</div>
                <h3 className="step-card__title">{s.title}</h3>
                <p className="step-card__desc">{s.desc}</p>
                {i < steps.length - 1 && <div className="step-card__arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section className="features">
        <div className="section-inner">
          <div className="section-label">Преимущества</div>
          <h2 className="section-heading">Почему родители выбирают нас</h2>

          <div className="features__grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                {/* Рекомендуемое разрешение: 32x32px SVG */}
                <img
                  src={f.icon}
                  alt={f.iconAlt}
                  width={32}
                  height={32}
                  className="feature-card__icon"
                />
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="cta">
        <div className="section-inner">
          <div className="cta__inner">
            <div className="cta__orb" />
            <div className="section-label cta__label">Готовы начать?</div>
            <h2 className="cta__heading">
              Запишите ребёнка в школу<br />прямо сейчас
            </h2>
            <p className="cta__desc">
              Приём заявлений в 1-й класс открыт. Не упустите место в выбранной школе.
            </p>
            <div className="cta__actions">
              <Link to="/register" className="btn btn--white btn--lg">
                Подать заявление
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9h10M9 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/login" className="btn btn--ghost-white btn--lg">
                Войти в кабинет
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Page_main;