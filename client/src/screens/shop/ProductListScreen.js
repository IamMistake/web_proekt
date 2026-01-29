import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import apiService from "../../services/apiService";
import demoProducts from "../../data/demoProducts";
import ProductCard from "../../components/common/ProductCard";
import { useCart } from "../../context/CartContext";

const ProductListScreen = () => {
  const { isAuthenticated, role } = useSelector((state) => state.authReducer);
  const history = useHistory();
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated && role === "admin") {
        history.push("/admin/products");
        return;
      }
      if (isAuthenticated && role === "customer") {
        try {
          const [categoriesRes, productsRes] = await Promise.all([
            apiService.getCustomerCategories(),
            apiService.getCustomerProducts(""),
          ]);
          setCategories(categoriesRes.data || []);
          setProducts(
            (productsRes.data || []).map((item) => ({
              id: item._id,
              category: (item.category || []).length > 0 ? "Категорија" : "",
              productNo: item.productNo,
              price: item.price,
              stock: item.stockStatus?.stockQuantity || 0,
              image: item.imageList?.[0]
                ? `/api/product/images/${item.imageList[0].imageId}`
                : "https://via.placeholder.com/400x300/667eea/fff?text=Product",
            }))
          );
        } catch (error) {
          if (error.response?.status === 401) {
            setProducts([]);
            return;
          }
          setProducts(demoProducts);
        }
      } else {
        setProducts(demoProducts);
      }
    };
    loadData();
  }, [isAuthenticated, role, history]);

  const filteredProducts = useMemo(() => {
    let data = [...products];
    if (search.trim()) {
      const query = search.toLowerCase();
      data = data.filter((item) => item.productNo.toLowerCase().includes(query));
    }
    if (category !== "all") {
      data = data.filter((item) => item.category === category);
    }
    if (sort === "price") {
      data.sort((a, b) => a.price - b.price);
    }
    if (sort === "stock") {
      data.sort((a, b) => b.stock - a.stock);
    }
    return data;
  }, [products, search, category, sort]);

  return (
    <div className="container-main">
      <div className="page-header">
        <h1>Производи</h1>
        <div>
          {role === "admin" && (
            <Link className="btn btn-primary" to="/admin/products/add">
              <i className="fas fa-plus me-1" />Додади производ
            </Link>
          )}
        </div>
      </div>

      {!isAuthenticated && (
        <div className="alert alert-warning">
          Прикажани се демо податоци. Најавете се за целосен пристап.
        </div>
      )}
      {isAuthenticated && role === "customer" && products.length === 0 && (
        <div className="alert alert-info">
          Нема достапни производи или немате пристап.
        </div>
      )}

      <div className="card-soft mb-3">
        <div className="row g-2 align-items-end">
          <div className="col-md-6">
            <label className="form-label">Пребарај</label>
            <input
              className="form-control"
              placeholder="Пребарај производи..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Категорија</label>
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">Сите</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.title}>
                  {cat.title}
                </option>
              ))}
              <option value="Процесори">Процесори</option>
              <option value="Графички картички">Графички картички</option>
              <option value="Складирање">Складирање</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">Сортирај</label>
            <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="latest">Најнови</option>
              <option value="price">Цена</option>
              <option value="stock">Достапност</option>
            </select>
          </div>
          <div className="col-md-1">
            <button className="btn btn-primary w-100" type="button">
              <i className="fas fa-filter" />
            </button>
          </div>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={addItem} />
        ))}
      </div>
    </div>
  );
};

export default ProductListScreen;
