import { Link } from "react-router-dom";
import "../style/Page_about.css";

function Page_about() {
  const features = [
    {
      title: "Прозрачность процесса",
      desc: "Полная видимость всех этапов рассмотрения заявления. Вы всегда знаете, на каком этапе находится ваша заявка.",
    },
    {
      title: "Экономия времени",
      desc: "Подача документов занимает всего 3-5 минут. Не нужно стоять в очередях и многократно посещать школу.",
    },
    {
      title: "Юридическая сила",
      desc: "Электронное заявление имеет такую же юридическую силу, как и бумажное, согласно законодательству РК.",
    },
    {
      title: "Безопасность данных",
      desc: "Все документы защищены современными методами шифрования и хранятся на защищенных серверах.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Подготовка документов",
      items: [
        "Свидетельство о рождении ребёнка",
        "Паспорт родителя",
        "Справка с места жительства",
        "Медицинская карта (форма 026/у)",
      ],
    },
    {
      number: "02",
      title: "Заполнение заявления",
      items: [
        "Регистрация в системе",
        "Заполнение формы онлайн",
        "Загрузка сканов документов",
        "Проверка введённых данных",
      ],
    },
    {
      number: "03",
      title: "Отправка и ожидание",
      items: [
        "Отправка заявления в школу",
        "Получение уведомления о приёме",
        "Отслеживание статуса",
        "Получение решения",
      ],
    },
  ];

  const faq = [
    {
      question: "Как долго рассматривается заявление?",
      answer:
        "Срок рассмотрения заявления составляет от 3 до 10 рабочих дней в зависимости от загруженности школы и полноты предоставленных документов.",
    },
    {
      question: "Можно ли подать заявление в несколько школ?",
      answer:
        "Да, вы можете подать заявления в несколько школ одновременно. Система автоматически уведомит вас о результатах рассмотрения в каждой из них.",
    },
    {
      question: "Что делать, если допустили ошибку в заявлении?",
      answer:
        "Вы можете отредактировать заявление в личном кабинете до момента его рассмотрения администрацией школы. После начала рассмотрения потребуется связаться со школой напрямую.",
    },
    {
      question: "Нужно ли приносить оригиналы документов?",
      answer:
        "Да, после одобрения заявления вам необходимо будет предоставить оригиналы документов в школу для окончательной регистрации. Об этом вас уведомят отдельно.",
    },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-container">
          <div className="about-hero-grid">
            <div className="about-hero-content">
              <div className="section-label">О системе</div>
              <h1 className="about-hero-title">
                Современная система электронной записи в школы
              </h1>
              <p className="about-hero-desc">
                Наша платформа упрощает процесс зачисления детей в 1-й класс,
                делая его быстрым, прозрачным и удобным для родителей по всей
                Республике Казахстан.
              </p>
              <div className="about-hero-actions">
                <Link to="/register" className="btn btn--primary btn--lg">
                  Начать регистрацию
                </Link>
                <a href="#faq" className="btn btn--ghost btn--lg">
                  Частые вопросы
                </a>
              </div>
            </div>

            {/* Рекомендуемое разрешение: 600x800px или 800x600px */}
            <div className="about-hero-image">
              <img
                src="/src/assets/about-hero.jpg"
                alt="Родители с детьми"
                className="about-hero-img"
              />
              {/* Декоративные элементы */}
              <div className="about-hero-decoration about-hero-decoration--1" />
              <div className="about-hero-decoration about-hero-decoration--2" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="about-features">
        <div className="about-container">
          <div className="about-features-grid">
            {features.map((feature, i) => (
              <div key={i} className="about-feature-card">
                <h3 className="about-feature-title">{feature.title}</h3>
                <p className="about-feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="about-process">
        <div className="about-container">
          <div className="about-section-header">
            <div className="section-label">Процесс подачи</div>
            <h2 className="section-heading">
              Как происходит зачисление
            </h2>
          </div>

          <div className="about-steps">
            {steps.map((step, i) => (
              <div key={i} className="about-step">
                <div className="about-step-number">{step.number}</div>
                <h3 className="about-step-title">{step.title}</h3>
                <ul className="about-step-list">
                  {step.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        <div className="about-container">
          <div className="about-stats-grid">
            <div className="about-stat">
              <div className="about-stat-value">500+</div>
              <div className="about-stat-label">Школ в системе</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-value">12 000+</div>
              <div className="about-stat-label">Успешных зачислений</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-value">3 мин</div>
              <div className="about-stat-label">Среднее время подачи</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-value">24/7</div>
              <div className="about-stat-label">Доступность системы</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="about-faq" id="faq">
        <div className="about-container">
          <div className="about-section-header">
            <div className="section-label">FAQ</div>
            <h2 className="section-heading">Частые вопросы</h2>
          </div>

          <div className="about-faq-list">
            {faq.map((item, i) => (
              <details key={i} className="about-faq-item">
                <summary className="about-faq-question">
                  {item.question}
                </summary>
                <p className="about-faq-answer">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="about-container">
          <div className="about-cta-inner">
            <h2 className="about-cta-title">Готовы начать?</h2>
            <p className="about-cta-desc">
              Зарегистрируйтесь в системе и подайте заявление в выбранную школу
              прямо сейчас
            </p>
            <Link to="/register" className="btn btn--white btn--lg">
              Создать аккаунт
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Page_about;