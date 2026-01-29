import React from "react";
import { NavLink, Link } from "react-router-dom";

const AdminNavbar = ({ onLogout }) => (
  <nav className="navbar navbar-expand-lg">
    <div className="container">
      <Link className="navbar-brand" to="/admin/products">
        <i className="fas fa-microchip me-2" />TechStore Admin
      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <span className="nav-link">Admin</span>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/products">
              Производи
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/categories">
              Категории
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/features">
              Фичери
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/suppliers">
              Добавувачи
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/orders">
              Набавки
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/products/add">
              Додади
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/integration">
              Интеграции
            </NavLink>
          </li>
          <li className="nav-item">
            <button className="btn btn-link nav-link" type="button" onClick={onLogout}>
              Одјава
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default AdminNavbar;
