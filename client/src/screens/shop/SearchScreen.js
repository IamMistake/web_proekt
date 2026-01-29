import React, { useMemo, useState } from "react";
import demoProducts from "../../data/demoProducts";
import ProductCard from "../../components/common/ProductCard";
import { useCart } from "../../context/CartContext";

const SearchScreen = () => {
  const { addItem } = useCart();
  const [filters, setFilters] = useState({
    category: "all",
    min: "",
    max: "",
    brand: "",
    availability: "all",
  });

  const filtered = useMemo(() => {
    return demoProducts.filter((product) => {
      if (filters.category !== "all" && product.category !== filters.category) return false;
      if (filters.min && product.price < Number(filters.min)) return false;
      if (filters.max && product.price > Number(filters.max)) return false;
      if (filters.brand && !product.productNo.toLowerCase().includes(filters.brand.toLowerCase())) return false;
      if (filters.availability === "in" && product.stock <= 0) return false;
      if (filters.availability === "out" && product.stock > 0) return false;
      return true;
    });
  }, [filters]);

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
              <option value="Процесори">Процесори</option>
              <option value="Графички картички">Графички картички</option>
              <option value="Складирање">Складирање</option>
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
