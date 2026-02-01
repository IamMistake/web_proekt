import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import apiService from "../../services/apiService";
import demoProducts from "../../data/demoProducts";
import ProductCard from "../../components/common/ProductCard";
import { useCart } from "../../context/CartContext";

const SearchScreen = () => {
  const { isAuthenticated, role } = useSelector((state) => state.authReducer);
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "all",
    min: "",
    max: "",
    brand: "",
    availability: "all",
  });

  useEffect(() => {
    const loadData = async () => {
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
              category: (item.category || []).length > 0 ? item.category[0]?.title || "Категорија" : "",
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
        try {
          const [categoriesRes, productsRes] = await Promise.all([
            apiService.getPublicCategories(),
            apiService.getPublicProducts(""),
          ]);
          setCategories(categoriesRes.data || []);
          setProducts(
            (productsRes.data || []).map((item) => ({
              id: item._id,
              category: (item.category || []).length > 0 ? item.category[0]?.title || "Категорија" : "",
              productNo: item.productNo,
              price: item.price,
              stock: item.stockStatus?.stockQuantity || 0,
              image: item.imageList?.[0]
                ? `/api/product/images/${item.imageList[0].imageId}`
                : "https://via.placeholder.com/400x300/667eea/fff?text=Product",
            }))
          );
        } catch (error) {
          setProducts(demoProducts);
        }
      }
    };
    loadData();
  }, [isAuthenticated, role]);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      if (filters.category !== "all" && product.category !== filters.category) return false;
      if (filters.min && product.price < Number(filters.min)) return false;
      if (filters.max && product.price > Number(filters.max)) return false;
      if (filters.brand && !product.productNo.toLowerCase().includes(filters.brand.toLowerCase())) return false;
      if (filters.availability === "in" && product.stock <= 0) return false;
      if (filters.availability === "out" && product.stock > 0) return false;
      return true;
    });
  }, [filters, products]);

  return (
    <div className="container-main">
      <h1>Напредно пребарување</h1>
      <div className="row">
        <div className="col-md-4">
          <div className="card-soft">
            <label className="form-label">Категорија</label>
            <select
              className="form-select mb-3"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="all">Сите</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>
            <label className="form-label">Цена (мин - макс)</label>
            <div className="d-flex gap-2 mb-3">
              <input
                className="form-control"
                placeholder="Мин"
                type="number"
                value={filters.min}
                onChange={(e) => setFilters({ ...filters, min: e.target.value })}
              />
              <input
                className="form-control"
                placeholder="Макс"
                type="number"
                value={filters.max}
                onChange={(e) => setFilters({ ...filters, max: e.target.value })}
              />
            </div>
            <label className="form-label">Производител</label>
            <input
              className="form-control mb-3"
              value={filters.brand}
              onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
            />
            <label className="form-label">Достапност</label>
            <select
              className="form-select mb-3"
              value={filters.availability}
              onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
            >
              <option value="all">Сите</option>
              <option value="in">На залиха</option>
              <option value="out">Нема</option>
            </select>
            <button className="btn btn-primary">Пребарај</button>
          </div>
        </div>
        <div className="col-md-8">
          <div className="products-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addItem} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchScreen;
