import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";

const titleRegex = /^.{3,}$/;

const AdminCategoryScreen = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    level: "main",
    isSpecial: false,
    showOnHomePage: false,
    parentList: [],
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const loadCategories = async () => {
    try {
      const res = await apiService.getAdminCategories();
      setCategories(res.data || []);
    } catch (error) {
      setCategories([]);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const validate = () => {
    const nextErrors = {};
    if (!titleRegex.test(form.title)) {
      nextErrors.title = "Насловот мора да има минимум 3 карактери.";
    }
    if ((form.level === "main" || form.isSpecial) && !image) {
      nextErrors.image = "Потребна е слика.";
    }
    if ((form.level === "second" || form.level === "third") && form.parentList.length === 0) {
      nextErrors.parentList = "Изберете барем една родителска категорија.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    const payload = {
      title: form.title,
      isMainCategory: form.level === "main",
      isSecondLevelCategory: form.level === "second",
      isThirdLevelCategory: form.level === "third",
      isSpecial: form.isSpecial,
      showOnHomePage: form.showOnHomePage,
      parentList: form.parentList,
      childrenList: [],
    };

    const formData = new FormData();
    if (image) {
      formData.append("image", image);
    }
    formData.append("jsonText", JSON.stringify(payload));

    await apiService.addCategory(formData);
    setForm({
      title: "",
      level: "main",
      isSpecial: false,
      showOnHomePage: false,
      parentList: [],
    });
    setImage(null);
    loadCategories();
  };

  const toggleParent = (id) => {
    setForm((prev) => {
      const exists = prev.parentList.includes(id);
      return {
        ...prev,
        parentList: exists ? prev.parentList.filter((item) => item !== id) : [...prev.parentList, id],
      };
    });
  };

  return (
    <div className="container-main">
      <div className="page-header">
        <h1>Категории</h1>
      </div>

      <div className="row">
        <div className="col-md-5">
          <div className="card-soft">
            <h5 className="page-section-title">Додади категорија</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Назив</label>
                <input
                  className="form-control"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                {errors.title && <small className="text-danger">{errors.title}</small>}
              </div>
              <div className="mb-3">
                <label className="form-label">Ниво</label>
                <select
                  className="form-select"
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                >
                  <option value="main">Главна</option>
                  <option value="second">Второ ниво</option>
                  <option value="third">Трето ниво</option>
                </select>
              </div>
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={form.isSpecial}
                  onChange={(e) => setForm({ ...form, isSpecial: e.target.checked })}
                />
                <label className="form-check-label">Специјална категорија</label>
              </div>
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={form.showOnHomePage}
                  onChange={(e) => setForm({ ...form, showOnHomePage: e.target.checked })}
                />
                <label className="form-check-label">Прикажи на почетна</label>
              </div>
              <div className="mb-3">
                <label className="form-label">Слика</label>
                <input type="file" className="form-control" onChange={(e) => setImage(e.target.files[0])} />
                {errors.image && <small className="text-danger">{errors.image}</small>}
              </div>
              {(form.level === "second" || form.level === "third") && (
                <div className="mb-3">
                  <label className="form-label">Родителски категории</label>
                  {categories.map((cat) => (
                    <div className="form-check" key={cat._id}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={form.parentList.includes(cat._id)}
                        onChange={() => toggleParent(cat._id)}
                      />
                      <label className="form-check-label">{cat.title}</label>
                    </div>
                  ))}
                  {errors.parentList && <small className="text-danger">{errors.parentList}</small>}
                </div>
              )}
              <button className="btn btn-primary" type="submit">
                Зачувај
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card-soft">
            <h5 className="page-section-title">Листа на категории</h5>
            <ul className="list-group list-group-flush">
              {categories.map((cat) => (
                <li key={cat._id} className="list-group-item d-flex justify-content-between">
                  <span>{cat.title}</span>
                  <span className="text-muted small">
                    {cat.isSpecial ? "Special" : cat.isMainCategory ? "Main" : cat.isSecondLevelCategory ? "Second" : "Third"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoryScreen;
