import React from "react";
import { Link } from "react-router-dom";
import PriceTag from "./PriceTag";
import StockBadge from "./StockBadge";
import { truncate } from "../../utils/formatters";

const ProductCard = ({ product, onAdd, showActions = true }) => (
  <div className="product-card">
    <img className="product-image" src={product.image} alt={product.productNo} />
    <div className="product-body">
      <div className="text-muted small">{product.category}</div>
      <h5>{truncate(product.productNo, 40)}</h5>
      <PriceTag value={product.price} />
      <div className="mt-2">
        <StockBadge quantity={product.stock} />
      </div>
      {showActions && (
        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-primary flex-grow-1" onClick={() => onAdd(product)}>
            Додади
          </button>
          <Link className="btn btn-outline-secondary" to={`/products/${product.id}`}>
            Детали
          </Link>
        </div>
      )}
    </div>
  </div>
);

export default ProductCard;
