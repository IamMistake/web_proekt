import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiService from "../../services/apiService";
import ModalDialog from "../../components/common/ModalDialog";
import { formatCurrency } from "../../utils/formatters";

const AdminProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [modalProduct, setModalProduct] = useState(null);

  const loadProducts = async (query = "") => {
    try {
      const res = query
        ? await apiService.queryProductsAdmin(query)
        : await apiService.queryProductsAdmin("");
      const list = res.data.productList || [];
      setProducts(list);
    } catch (error) {
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts("");
  }, []);

  return (
    <div className="container-main">
      <div className="page-header">
        <h1>Производи</h1>
        <Link className="btn btn-primary" to="/admin/products/add">
          <i className="fas fa-plus me-1" />Додади производ
        </Link>
      </div>

      <div className="card-soft mb-3">
        <div className="row g-2 align-items-end">
          <div className="col-md-8">
            <label className="form-label">Пребарај</label>
            <input
              className="form-control"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                loadProducts(e.target.value);
              }}
            />
          </div>
          <div className="col-md-4">
            <button className="btn btn-primary w-100" type="button" onClick={() => loadProducts(search)}>
              Пребарај
            </button>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Производ</th>
              <th>Цена</th>
              <th>Акции</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.productNo}</td>
                <td>{formatCurrency(product.price)}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => setModalProduct(product)}>
                    Избриши
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalDialog
        show={Boolean(modalProduct)}
        title="Избриши производ"
        body={modalProduct ? `Дали сакате да го избришете ${modalProduct.productNo}?` : ""}
        onClose={() => setModalProduct(null)}
        onConfirm={async () => {
          if (modalProduct) {
            await apiService.deleteProductAdmin(modalProduct._id);
            loadProducts(search);
          }
          setModalProduct(null);
        }}
        confirmLabel="Избриши"
      />
    </div>
  );
};

export default AdminProductListScreen;
