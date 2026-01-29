import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import apiService from "../../services/apiService";
import ModalDialog from "../../components/common/ModalDialog";

const priceRegex = /^\d+(\.\d{1,2})?$/;

const AdminEditProductScreen = () => {
  const history = useHistory();
  const location = useLocation();
  const product = location.state?.product;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    productNo: product?.productNo || "",
    brand: product?.brand || "",
    keyProperties: product?.keyProperties || "",
    price: product?.price || "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (form.productNo.trim().length < 3) {
      nextErrors.productNo = "Името е задолжително.";
    }
    if (!priceRegex.test(String(form.price)) || Number(form.price) <= 0) {
      nextErrors.price = "Внесете цена поголема од 0.";
    }
    if (!images.length) {
      nextErrors.images = "Потребна е барем една слика.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  if (!product) {
    return (
      <div className="container-main">
        <div className="alert alert-warning">Недостасуваат податоци за производот.</div>
      </div>
    );
  }

  const handleSave = async (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    await apiService.deleteProductAdmin(product._id);
    const payload = {
      productNo: form.productNo,
      brand: form.brand,
      keyProperties: form.keyProperties,
      price: Number(form.price),
      stockStatus: product.stockStatus || { stockQuantity: 0, isOnOrder: false },
      category: product.category || [],
      mainImageIndex: 0,
      specifications: product.specifications || [],
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
        <h1>Измени производ</h1>
        <div>
          <button className="btn btn-danger me-2" type="button" onClick={() => setConfirmDelete(true)}>
            Избриши
          </button>
          <button className="btn btn-primary" type="button" onClick={handleSave}>
            Зачувај промени
          </button>
        </div>
      </div>

      <div className="alert alert-info">
        Измените ќе креираат нов производ бидејќи API нема PATCH/PUT endpoint.
      </div>

      <div className="card-soft">
        <form>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Име</label>
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
          <div className="mb-3">
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
          <div className="mb-3">
            <label className="form-label">Производител</label>
            <input
              className="form-control"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            />
          </div>
          <div className="row">
            <div className="col-md-3 mb-3">
              <label className="form-label">Цена</label>
              <input
                className="form-control"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              {errors.price && <small className="text-danger">{errors.price}</small>}
            </div>
          </div>
        </form>
      </div>

      <ModalDialog
        show={confirmDelete}
        title="Избриши производ"
        body={`Дали сакате да го избришете ${product.productNo}?`}
        onClose={() => setConfirmDelete(false)}
        onConfirm={async () => {
          await apiService.deleteProductAdmin(product._id);
          history.push("/admin/products");
        }}
        confirmLabel="Избриши"
      />
    </div>
  );
};

export default AdminEditProductScreen;
