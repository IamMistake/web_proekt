import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";
import ModalDialog from "../../components/common/ModalDialog";

const AdminFeatureScreen = () => {
  const [features, setFeatures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    featureType: "category",
    categoryId: "",
    productId: "",
    brand: "",
  });
  const [errors, setErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadData = async () => {
    try {
      const [featureRes, categoryRes] = await Promise.all([
        apiService.getFeatures(),
        apiService.getAdminCategories(),
      ]);
      setFeatures(featureRes.data.featuresList || []);
      setCategories(categoryRes.data || []);
    } catch (error) {
      setFeatures([]);
      setCategories([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const queryProducts = async (value) => {
    setProductSearch(value);
    if (!value) {
      setProducts([]);
      return;
    }
    try {
      const res = await apiService.queryProductsAdmin(value);
      setProducts(res.data.productList || []);
    } catch (error) {
      setProducts([]);
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!image) {
      nextErrors.image = "Потребна е слика.";
    }
    if (form.featureType === "category" || form.featureType === "categoryWithBrand") {
      if (!form.categoryId) {
        nextErrors.categoryId = "Изберете категорија.";
      }
    }
    if (form.featureType === "product" && !form.productId) {
      nextErrors.productId = "Изберете производ.";
    }
    if (form.featureType === "categoryWithBrand" && form.brand.trim().length < 2) {
      nextErrors.brand = "Внесете бренд.";
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
      featureType: form.featureType,
      categoryId: form.categoryId || undefined,
      brand: form.brand || undefined,
      productId: form.productId || undefined,
    };
    const formData = new FormData();
    formData.append("image", image);
    formData.append("jsonText", JSON.stringify(payload));
    await apiService.addFeature(formData);
    setForm({ featureType: "category", categoryId: "", productId: "", brand: "" });
    setImage(null);
    setProductSearch("");
    setProducts([]);
    loadData();
  };

  return (
    <div className="container-main">
      <div className="page-header">
        <h1>Фичери</h1>
      </div>

      <div className="row">
        <div className="col-md-5">
          <div className="card-soft">
            <h5 className="page-section-title">Додади фичер</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Тип</label>
                <select
                  className="form-select"
                  value={form.featureType}
                  onChange={(e) => setForm({ ...form, featureType: e.target.value })}
                >
                  <option value="category">Категорија</option>
                  <option value="product">Производ</option>
                  <option value="categoryWithBrand">Категорија + бренд</option>
                </select>
              </div>
              {(form.featureType === "category" || form.featureType === "categoryWithBrand") && (
                <div className="mb-3">
                  <label className="form-label">Категорија</label>
                  <select
                    className="form-select"
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  >
                    <option value="">Избери</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && <small className="text-danger">{errors.categoryId}</small>}
                </div>
              )}
              {form.featureType === "categoryWithBrand" && (
                <div className="mb-3">
                  <label className="form-label">Бренд</label>
                  <input
                    className="form-control"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  />
                  {errors.brand && <small className="text-danger">{errors.brand}</small>}
                </div>
              )}
              {form.featureType === "product" && (
                <div className="mb-3">
                  <label className="form-label">Производ</label>
                  <input
                    className="form-control mb-2"
                    placeholder="Пребарај производ"
                    value={productSearch}
                    onChange={(e) => queryProducts(e.target.value)}
                  />
                  <select
                    className="form-select"
                    value={form.productId}
                    onChange={(e) => setForm({ ...form, productId: e.target.value })}
                  >
                    <option value="">Избери</option>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.productNo}
                      </option>
                    ))}
                  </select>
                  {errors.productId && <small className="text-danger">{errors.productId}</small>}
                </div>
              )}
              <div className="mb-3">
                <label className="form-label">Слика</label>
                <input type="file" className="form-control" onChange={(e) => setImage(e.target.files[0])} />
                {errors.image && <small className="text-danger">{errors.image}</small>}
              </div>
              <button className="btn btn-primary" type="submit">
                Зачувај
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card-soft">
            <h5 className="page-section-title">Листа на фичери</h5>
            <ul className="list-group list-group-flush">
              {features.map((feature) => (
                <li key={feature._id} className="list-group-item d-flex justify-content-between">
                  <div>
                    <div className="fw-bold">{feature.featureType}</div>
                    <div className="text-muted small">{feature.brand || feature.categoryId?.title || feature.productId?.productNo || "-"}</div>
                  </div>
                  <button className="btn btn-sm btn-danger" onClick={() => setConfirmDelete(feature)}>
                    Избриши
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <ModalDialog
        show={Boolean(confirmDelete)}
        title="Избриши фичер"
        body={confirmDelete ? "Дали сакате да го избришете фичерот?" : ""}
        onClose={() => setConfirmDelete(null)}
        onConfirm={async () => {
          if (confirmDelete) {
            await apiService.deleteFeature(confirmDelete._id);
            loadData();
          }
          setConfirmDelete(null);
        }}
        confirmLabel="Избриши"
      />
    </div>
  );
};

export default AdminFeatureScreen;
