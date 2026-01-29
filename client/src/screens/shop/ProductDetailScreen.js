import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import apiService from "../../services/apiService";
import demoProducts from "../../data/demoProducts";
import { useCart } from "../../context/CartContext";
import PriceTag from "../../components/common/PriceTag";
import StockBadge from "../../components/common/StockBadge";

const ProductDetailScreen = () => {
  const { id } = useParams();
  const { isAuthenticated, role } = useSelector((state) => state.authReducer);
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("specs");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      if (isAuthenticated && role === "customer") {
        try {
          const res = await apiService.getCustomerProducts(`productId=${id}`);
          const item = res.data?.[0];
          if (item) {
            setProduct({
              id: item._id,
              category: "Категорија",
              productNo: item.productNo,
              price: item.price,
              stock: item.stockStatus?.stockQuantity || 0,
              image: item.imageList?.[0]
                ? `/api/product/images/${item.imageList[0].imageId}`
                : "https://via.placeholder.com/800x600/667eea/fff?text=Product",
              specs: item.specifications?.map((spec) => ({ key: spec.key, value: spec.value })) || [],
              description: item.keyProperties || "-",
            });
            return;
          }
        } catch (error) {
          // fallback below
        }
      }
      const fallback = demoProducts.find((item) => item.id === id) || demoProducts[0];
      setProduct(fallback);
    };
    loadProduct();
  }, [id, isAuthenticated, role]);

  if (!product) {
    return null;
  }

  return (
    <div className="container-main">
      <nav aria-label="breadcrumb" style={{ "--bs-breadcrumb-divider": ">" }}>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">Почетна</li>
          <li className="breadcrumb-item">Производи</li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.productNo}
          </li>
        </ol>
      </nav>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card product-card">
            <img src={product.image} className="product-image" alt={product.productNo} />
          </div>
        </div>

        <div className="col-md-6">
          <h2>{product.productNo}</h2>
          <div className="text-muted">SKU: {product.id}</div>
          <div className="my-3 d-flex align-items-center gap-3">
            <PriceTag value={product.price} />
          </div>
          <div className="mb-3">
            <StockBadge quantity={product.stock} />
          </div>

          <div className="d-flex align-items-center gap-2 mb-3">
            <label className="me-2">Количина:</label>
            <div className="input-group" style={{ width: 140 }}>
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <input
                type="number"
                className="form-control text-center"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={() => addItem(product, quantity)}>
              <i className="fas fa-shopping-cart me-1" />Додади во кошничка
            </button>
          </div>

          <hr />
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "specs" ? "active" : ""}`}
                type="button"
                onClick={() => setActiveTab("specs")}
              >
                Спецификации
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "desc" ? "active" : ""}`}
                type="button"
                onClick={() => setActiveTab("desc")}
              >
                Опис
              </button>
            </li>
          </ul>
          <div className="tab-content mt-3">
            <div className={`tab-pane fade ${activeTab === "specs" ? "show active" : ""}`} id="specs">
              <table className="table table-sm">
                <tbody>
                  {product.specs?.map((spec) => (
                    <tr key={spec.key}>
                      <th>{spec.key}</th>
                      <td>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`tab-pane fade ${activeTab === "desc" ? "show active" : ""}`} id="desc">
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailScreen;
