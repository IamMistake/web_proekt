import React, { useEffect, useMemo, useState } from "react";
import apiService from "../../services/apiService";
import { formatCurrency } from "../../utils/formatters";

const quantityRegex = /^\d+$/;
const priceRegex = /^\d+(\.\d{1,2})?$/;

const AdminOrderScreen = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const res = await apiService.querySuppliers(" ");
        setSuppliers(res.data || []);
      } catch (error) {
        setSuppliers([]);
      }
    };
    loadSuppliers();
  }, []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
    [items]
  );

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

  const addItem = (product) => {
    setItems((prev) => [...prev, {
      productId: product._id,
      name: product.productNo,
      price: product.price,
      quantity: 1,
    }]);
  };

  const validate = () => {
    const nextErrors = {};
    if (!supplierId) {
      nextErrors.supplierId = "Изберете добавувач.";
    }
    if (!address.trim()) {
      nextErrors.address = "Внесете адреса.";
    }
    if (items.length === 0) {
      nextErrors.items = "Додадете барем еден производ.";
    }
    items.forEach((item, index) => {
      if (!quantityRegex.test(String(item.quantity)) || Number(item.quantity) < 1) {
        nextErrors[`quantity-${index}`] = "Количината мора да биде >= 1.";
      }
      if (!priceRegex.test(String(item.price)) || Number(item.price) <= 0) {
        nextErrors[`price-${index}`] = "Цената мора да биде > 0.";
      }
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    const payload = {
      supplierId,
      type: "procurement",
      items: items.map((item) => ({
        productId: item.productId,
        price: Number(item.price),
        quantity: Number(item.quantity),
      })),
      orderTotalPrice: Number(total.toFixed(2)),
      address,
    };
    await apiService.addOrder(payload);
    setSupplierId("");
    setItems([]);
    setAddress("");
    setProductSearch("");
    setProducts([]);
  };

  return (
    <div className="container-main">
      <div className="page-header">
        <h1>Нова набавка</h1>
      </div>

      <div className="row">
        <div className="col-md-5">
          <div className="card-soft">
            <h5 className="page-section-title">Детали за нарачка</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Добавувач</label>
                <select className="form-select" value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
                  <option value="">Избери</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
                {errors.supplierId && <small className="text-danger">{errors.supplierId}</small>}
              </div>
              <div className="mb-3">
                <label className="form-label">Адреса</label>
                <input
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                {errors.address && <small className="text-danger">{errors.address}</small>}
              </div>
              <div className="mb-3">
                <label className="form-label">Пребарај производ</label>
                <input
                  className="form-control"
                  value={productSearch}
                  onChange={(e) => queryProducts(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Резултати</label>
                <div className="list-group">
                  {products.map((product) => (
                    <button
                      type="button"
                      key={product._id}
                      className="list-group-item list-group-item-action"
                      onClick={() => addItem(product)}
                    >
                      {product.productNo}
                    </button>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary" type="submit">
                Креирај набавка
              </button>
              {errors.items && <small className="text-danger d-block mt-2">{errors.items}</small>}
            </form>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card-soft">
            <h5 className="page-section-title">Ставки</h5>
            {items.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="d-flex gap-2 mb-2 align-items-center">
                <div className="flex-grow-1">{item.name}</div>
                <input
                  className="form-control"
                  style={{ width: 120 }}
                  value={item.price}
                  onChange={(e) => {
                    const next = [...items];
                    next[index].price = e.target.value;
                    setItems(next);
                  }}
                />
                <input
                  className="form-control"
                  style={{ width: 80 }}
                  value={item.quantity}
                  onChange={(e) => {
                    const next = [...items];
                    next[index].quantity = e.target.value;
                    setItems(next);
                  }}
                />
                <button
                  className="btn btn-outline-danger"
                  type="button"
                  onClick={() => setItems(items.filter((_, i) => i !== index))}
                >
                  <i className="fas fa-trash" />
                </button>
                {errors[`price-${index}`] && <small className="text-danger">{errors[`price-${index}`]}</small>}
                {errors[`quantity-${index}`] && <small className="text-danger">{errors[`quantity-${index}`]}</small>}
              </div>
            ))}
            <div className="fw-bold mt-3">Вкупно: {formatCurrency(total)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderScreen;
