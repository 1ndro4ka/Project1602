import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../style/Page_documents.css";

function Page_documents() {
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [dragActive, setDragActive] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchParams] = useSearchParams();
  const schoolParam = searchParams.get("school");
  
  const [existingDocument, setExistingDocument] = useState(null);
  const [loadingExisting, setLoadingExisting] = useState(true);

  // Set initial selected school from URL if present
  useEffect(() => {
    if (schoolParam) {
      setSelectedSchool(schoolParam);
    }
  }, [schoolParam]);

  // Fetch existing application if any
  useEffect(() => {
    if (!isAuthenticated) return;
    let mounted = true;
    fetch("/api/documents/", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error("No data");
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        if (data && data._id && data.documents && Object.keys(data.documents).length > 0) {
          setExistingDocument(data);
          if (!schoolParam) {
            setSelectedSchool(data.school?._id || data.school || "");
          }
        }
        setLoadingExisting(false);
      })
      .catch(() => {
        if (!mounted) return;
        setLoadingExisting(false);
      });
    return () => { mounted = false; };
  }, [isAuthenticated, token, schoolParam]);

  // School selection
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [schoolsLoading, setSchoolsLoading] = useState(true);

  // Load schools list
  useEffect(() => {
    let mounted = true;
    fetch("/api/schools")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch schools");
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        // Only show schools with available places
        const available = data.filter((s) => s.hasPlaces);
        setSchools(available);
        setSchoolsLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setSchoolsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const requiredDocuments = [
    {
      id: "parent_statement",
      name: "Заявление родителей или законных представителей",
      icon: "📋",
    },
    {
      id: "medical_cert",
      name: "Медицинская справка формы №065-у",
      icon: "🏥",
    },
    {
      id: "health_passport",
      name: "Паспорт здоровья ребенка формы №052-2/у",
      icon: "📖",
    },
    {
      id: "photos",
      name: "2 фотографии размером 3×4 см",
      icon: "📷",
      multiple: true,
    },
  ];

  const allowedFormats = ["pdf", "jpeg", "jpg", "png", "doc", "docx"];
  const maxFileSize = 5 * 1024 * 1024; 

  const validateFile = (file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    
    if (!allowedFormats.includes(ext)) {
      return {
        valid: false,
        error: `Формат файла .${ext} не поддерживается`,
      };
    }

    if (file.size > maxFileSize) {
      return {
        valid: false,
        error: "Размер файла не должен превышать 5 МБ",
      };
    }

    return { valid: true };
  };

  const handleDrag = (e, docId) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(docId);
    } else if (e.type === "dragleave") {
      setDragActive(null);
    }
  };

  const handleDrop = (e, docId) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files, docId);
    }
  };

  const handleFileSelect = (e, docId) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files, docId);
    }
  };

  const handleFiles = (files, docId) => {
    const doc = requiredDocuments.find((d) => d.id === docId);
    let newFiles = Array.from(files);

    const validFiles = [];
    const newErrors = { ...errors };

    for (let file of newFiles) {
      const validation = validateFile(file);
      if (!validation.valid) {
        newErrors[docId] = validation.error;
      } else {
        validFiles.push(file);
        delete newErrors[docId];
      }
    }

    if (validFiles.length > 0) {
      if (doc.multiple) {
        const existingFiles = uploadedFiles[docId] || [];
        setUploadedFiles((prev) => ({
          ...prev,
          [docId]: [...existingFiles, ...validFiles],
        }));
      } else {
        setUploadedFiles((prev) => ({
          ...prev,
          [docId]: [validFiles[0]],
        }));
      }
    }

    setErrors(newErrors);
  };

  const removeFile = (docId, fileIndex) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [docId]: prev[docId].filter((_, idx) => idx !== fileIndex),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    // Validate school selection
    if (!selectedSchool) {
      setErrors({ general: "Пожалуйста, выберите школу" });
      return;
    }

    const missingDocs = requiredDocuments.filter((doc) => {
      const files = uploadedFiles[doc.id];
      if (doc.multiple) {
        return !files || files.length < 1;
      }
      return !files || files.length === 0;
    });

    if (missingDocs.length > 0) {
      setErrors({ general: "Пожалуйста, загрузите все обязательные документы" });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Add school ID
      formData.append("schoolId", selectedSchool);

      Object.entries(uploadedFiles).forEach(([docId, files]) => {
        files.forEach((file) => {
          formData.append(docId, file);
        });
      });

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Ошибка при загрузке документов");
      }

      setSuccessMessage("✅ Документы успешно загружены! Заявление отправлено в школу.");
      setUploadedFiles({});
      setSelectedSchool("");
      setErrors({});
      
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      setErrors({ general: error.message });
      console.error("Upload error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyExisting = async () => {
    if (!selectedSchool) {
      setErrors({ general: "Пожалуйста, выберите школу" });
      return;
    }
    
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrors({});

    try {
      const response = await fetch("/api/documents/apply-existing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ schoolId: selectedSchool }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Ошибка при перенаправлении заявки");
      }

      setSuccessMessage("✅ Документы успешно отправлены! Заявление передано в выбранную школу.");
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      setErrors({ general: error.message });
      console.error("Apply existing error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="documents-page">
        <div className="documents-container">
          <div className="auth-required">
            <h2>Доступ запрещен</h2>
            <p>Пожалуйста, авторизуйтесь для загрузки документов</p>
            <button
              onClick={() => navigate("/login")}
              className="btn btn--primary"
            >
              Перейти к входу
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="documents-page">
      <div className="documents-container">
        {/* Header */}
        <div className="documents-header">
          <div>
            <h1 className="documents-title">Приём документов</h1>
            <p className="documents-subtitle">
              Загрузите все обязательные документы для зачисления в школу
            </p>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="success-alert">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="error-alert">
            ⚠️ {errors.general}
          </div>
        )}

        {/* Info Alert */}
        <div className="info-alert">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 19c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 14v-4M10 6h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <strong>Требования к файлам:</strong>
            <p>Поддерживаемые форматы: PDF, JPEG, PNG, Word (до 5 МБ)</p>
          </div>
        </div>

        {/* Global School Selection */}
        <div className="school-selection" style={{ marginTop: '20px', marginBottom: '20px' }}>
          <label htmlFor="school-select" className="school-selection-label">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 1L1 6l9 5 9-5-9-5zM1 14l9 5 9-5M1 10l9 5 9-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Выберите школу для подачи заявления *
          </label>
          {schoolsLoading ? (
            <div className="school-selection-loading">Загрузка списка школ...</div>
          ) : schools.length === 0 ? (
            <div className="school-selection-empty">Нет школ с доступными местами</div>
          ) : (
            <select
              id="school-select"
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="school-select"
              disabled={isSubmitting}
            >
              <option value="">— Выберите школу —</option>
              {schools.map((school) => (
                <option key={school._id} value={school._id}>
                  {school.name} — {school.address || "Адрес не указан"}
                </option>
              ))}
            </select>
          )}
        </div>

        {loadingExisting ? (
          <div className="documents-loading">Загрузка ваших данных...</div>
        ) : existingDocument ? (
          <div className="existing-document-view">
            <div className="info-alert" style={{ backgroundColor: '#e0f2fe', color: '#0284c7', borderColor: '#bae6fd' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 19c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 14v-4M10 6h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <strong>Вы уже загрузили документы ранее!</strong>
                <p>Ваши документы надежно сохранены в системе. Вы можете подать заявление в другую школу, используя эти данные, или заново прикрепить новые.</p>
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: '20px', gap: '15px', display: 'flex', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn btn--primary btn--lg"
                onClick={handleApplyExisting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Отправка..." : "Отправить сохраненные документы"}
              </button>
              
              <button 
                type="button" 
                className="btn btn--ghost"
                onClick={() => setExistingDocument(null)}
                disabled={isSubmitting}
              >
                Загрузить новые документы
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="documents-form">
            <div className="documents-grid">
              {requiredDocuments.map((doc) => (
                <div key={doc.id} className="document-card">
                  <div className="document-header">
                    <span className="document-icon">{doc.icon}</span>
                    <h3 className="document-name">{doc.name}</h3>
                    {doc.multiple && (
                      <span className="badge">До 2 файлов</span>
                    )}
                  </div>

                  {/* Upload Area */}
                  <div
                    className={`upload-area ${dragActive === doc.id ? "drag-active" : ""}`}
                    onDragEnter={(e) => handleDrag(e, doc.id)}
                    onDragLeave={(e) => handleDrag(e, doc.id)}
                    onDragOver={(e) => handleDrag(e, doc.id)}
                    onDrop={(e) => handleDrop(e, doc.id)}
                  >
                    <input
                      type="file"
                      id={doc.id}
                      className="file-input"
                      multiple={doc.multiple}
                      accept={allowedFormats.map((f) => `.${f}`).join(",")}
                      onChange={(e) => handleFileSelect(e, doc.id)}
                      disabled={isSubmitting}
                    />
                    <label htmlFor={doc.id} className="upload-placeholder">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2v12M2 12h20M7 7l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="upload-text">
                        Перетащите файл сюда или нажмите для выбора
                      </span>
                    </label>
                  </div>

                  {/* Uploaded Files */}
                  {uploadedFiles[doc.id]?.length > 0 && (
                    <div className="uploaded-files">
                      {uploadedFiles[doc.id].map((file, idx) => (
                        <div key={idx} className="file-item">
                          <div className="file-info">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M10 2H4a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V6l-4-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div>
                              <p className="file-name">{file.name}</p>
                              <p className="file-size">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                          <button type="button" onClick={() => removeFile(doc.id, idx)} className="btn-remove" title="Удалить файл" disabled={isSubmitting}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Error Message */}
                  {errors[doc.id] && (
                    <div className="error-message">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 14c3.3 0 6-2.7 6-6s-2.7-6-6-6-6 2.7-6 6 2.7 6 6 6zM8 5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      {errors[doc.id]}
                    </div>
                  )}

                  {/* Status Indicator */}
                  {uploadedFiles[doc.id]?.length > 0 && (
                    <div className="status-success">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M14 4l-8.5 8.5-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Готово к отправке
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn--primary btn--lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Загрузка..." : "Отправить документы"}
              </button>
              <p className="required-note">
                * Все поля помечены как обязательные
              </p>
            </div>
          </form>
        )}

        {/* User Info */}
        {user && (
          <div className="user-info">
            <p>
              <strong>Загружено как:</strong> {user.fullName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page_documents;
