import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const ShopNavbar = ({ role, onLogout }) => {
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/products">
          <i className="fas fa-microchip me-2" />TechStore
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <span className="nav-link">{role === "guest" ? "Guest" : role === "admin" ? "Admin" : "Customer"}</span>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/products">
                Производи
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/search">
                Пребарај
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/compare">
                Спореди
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/cart">
                <i className="fas fa-shopping-cart" /> Кошничка ({cartCount})
              </NavLink>
            </li>
            <li className="nav-item">
              {role === "guest" ? (
                <NavLink className="nav-link" to="/auth">
                  <i className="fas fa-user-circle" />
                </NavLink>
              ) : (
                <button className="btn btn-link nav-link" type="button" onClick={onLogout}>
                  Одјава
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default ShopNavbar;
