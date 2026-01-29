import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";

const emailRegex = /^\S+@\S+\.\S+$/;

const AdminSupplierScreen = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ email: "", name: "", middleName: "", surName: "", address: "" });
  const [errors, setErrors] = useState({});

  const loadSuppliers = async (value = "") => {
    try {
      const res = await apiService.querySuppliers(value || " ");
      setSuppliers(res.data || []);
    } catch (error) {
      setSuppliers([]);
    }
  };

  useEffect(() => {
    loadSuppliers(" ");
  }, []);

  const validate = () => {
    const nextErrors = {};
    if (!emailRegex.test(form.email)) {
      nextErrors.email = "Внесете валидна е-пошта.";
    }
    if (form.name.trim().length < 3) {
      nextErrors.name = "Името е задолжително.";
    }
    if (form.address.trim().length < 3) {
      nextErrors.address = "Адресата е задолжителна.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    await apiService.addSupplier(form);
    setForm({ email: "", name: "", middleName: "", surName: "", address: "" });
    loadSuppliers(search || " ");
  };

  return (
    <div className="container-main">
      <div className="page-header">
        <h1>Добавувачи</h1>
      </div>

      <div className="row">
        <div className="col-md-5">
          <div className="card-soft">
            <h5 className="page-section-title">Додади добавувач</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Е-пошта</label>
                <input
                  className="form-control"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>
              <div className="mb-3">
                <label className="form-label">Име</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <small className="text-danger">{errors.name}</small>}
              </div>
              <div className="mb-3">
                <label className="form-label">Средно име</label>
                <input
                  className="form-control"
                  value={form.middleName}
                  onChange={(e) => setForm({ ...form, middleName: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Презиме</label>
                <input
                  className="form-control"
                  value={form.surName}
                  onChange={(e) => setForm({ ...form, surName: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Адреса</label>
                <input
                  className="form-control"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
                {errors.address && <small className="text-danger">{errors.address}</small>}
              </div>
              <button className="btn btn-primary" type="submit">
                Зачувај
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card-soft">
            <div className="d-flex justify-content-between mb-2">
              <h5 className="page-section-title">Листа</h5>
              <input
                className="form-control w-50"
                placeholder="Пребарај"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  loadSuppliers(e.target.value);
                }}
              />
            </div>
            <ul className="list-group list-group-flush">
              {suppliers.map((supplier) => (
                <li key={supplier._id} className="list-group-item">
                  <div className="fw-bold">{supplier.name}</div>
                  <div className="text-muted small">{supplier.email} • {supplier.address}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupplierScreen;
