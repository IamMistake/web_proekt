import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";

const priceRegex = /^\d+(\.\d{1,2})?$/;

const AdminAddProductScreen = ({ history }) => {
  const [form, setForm] = useState({
    productNo: "",
    brand: "",
    keyProperties: "",
    price: "",
    category: "",
    stockQuantity: "",
    specs: [{ key: "", value: "" }],
  });
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await apiService.getAdminCategories();
        setCategories(res.data || []);
      } catch (error) {
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  const validate = () => {
    const nextErrors = {};
    if (form.productNo.trim().length < 3) {
      nextErrors.productNo = "Името е задолжително.";
    }
    if (!priceRegex.test(form.price) || Number(form.price) <= 0) {
      nextErrors.price = "Внесете цена поголема од 0.";
    }
    if (!form.category) {
      nextErrors.category = "Изберете категорија.";
    }
    if (!images.length) {
      nextErrors.images = "Потребна е барем една слика.";
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
      productNo: form.productNo,
      brand: form.brand,
      keyProperties: form.keyProperties,
      price: Number(form.price),
      stockStatus: { stockQuantity: Number(form.stockQuantity) || 0, isOnOrder: false },
      category: [form.category],
      mainImageIndex: 0,
      specifications: form.specs.filter((spec) => spec.key && spec.value),
    };

    const formData = new FormData();
    images.forEach((image) => formData.append("images[]", image));
    formData.append("jsonText", JSON.stringify(payload));

    await apiService.addProductAdmin(formData);
    history.push("/admin/products");
  };

  return (
    <div className="container-main">
      <div className="page-header">
        <h1>Додади производ</h1>
      </div>
      <div className="card-soft">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Име на производ</label>
              <input
                className="form-control"
                value={form.productNo}
                onChange={(e) => setForm({ ...form, productNo: e.target.value })}
              />
              {errors.productNo && <small className="text-danger">{errors.productNo}</small>}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">SKU</label>
              <input
                className="form-control"
                value={form.keyProperties}
                onChange={(e) => setForm({ ...form, keyProperties: e.target.value })}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Категорија</label>
              <select
                className="form-select"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Избери</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.title}
                  </option>
                ))}
              </select>
              {errors.category && <small className="text-danger">{errors.category}</small>}
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Производител</label>
              <input
                className="form-control"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Цена (ден)</label>
              <input
                type="number"
                className="form-control"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              {errors.price && <small className="text-danger">{errors.price}</small>}
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">На залиха</label>
              <input
                type="number"
                className="form-control"
                value={form.stockQuantity}
                onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
              />
            </div>
            <div className="col-md-8 mb-3">
              <label className="form-label">Слики</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                multiple
                onChange={(e) => setImages(Array.from(e.target.files))}
              />
              {errors.images && <small className="text-danger">{errors.images}</small>}
            </div>
          </div>

          <hr />
          <h5>Технички спецификации</h5>
          {form.specs.map((spec, index) => (
            <div key={`spec-${index}`} className="d-flex gap-2 mb-2">
              <input
                className="form-control"
                placeholder="Клуч"
                value={spec.key}
                onChange={(e) => {
                  const next = [...form.specs];
                  next[index].key = e.target.value;
                  setForm({ ...form, specs: next });
                }}
              />
              <input
                className="form-control"
                placeholder="Вредност"
                value={spec.value}
                onChange={(e) => {
                  const next = [...form.specs];
                  next[index].value = e.target.value;
                  setForm({ ...form, specs: next });
                }}
              />
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => {
                  const next = form.specs.filter((_, idx) => idx !== index);
                  setForm({ ...form, specs: next.length ? next : [{ key: "", value: "" }] });
                }}
              >
                <i className="fas fa-trash" />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline-primary mt-2"
            onClick={() => setForm({ ...form, specs: [...form.specs, { key: "", value: "" }] })}
          >
            <i className="fas fa-plus me-1" />Додади спецификација
          </button>

          <div className="mt-4 d-flex gap-2">
            <button className="btn btn-secondary" type="button" onClick={() => history.push("/admin/products")}
            >
              Назад
            </button>
            <button className="btn btn-primary" type="submit">
              Зачувај
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProductScreen;
