import axios from "axios";

const api = axios.create({
  baseURL: "/",
});

const setToken = (token) => {
  if (token) {
    api.defaults.headers.common.token = token;
  } else {
    delete api.defaults.headers.common.token;
  }
};

const apiService = {
  setToken,
  adminLogin: (payload) => api.post("/api/admin-auth/auth", payload),
  adminRegister: (payload) => api.post("/api/admin-auth/register/", payload),
  customerLogin: (payload) => api.post("/api/customer/auth/signin", payload),
  customerRegister: (payload) => api.post("/api/customer/auth/signup", payload),
  getAdminCategories: () => api.get("/api/category/"),
  addCategory: (formData) => api.post("/api/category/", formData),
  queryCategories: (search, showOnlySpecial = false) => api.get(
    `/api/category/query?searched=${encodeURIComponent(search)}&showOnlySpecial=${showOnlySpecial}`
  ),
  queryProductsAdmin: (search) => api.post(`/api/product/query?search=${encodeURIComponent(search)}`),
  getProductsAdmin: (categoryId) => api.get(`/api/product/product?categoryId=${categoryId || ""}`),
  deleteProductAdmin: (productId) => api.delete(`/api/product/product/${productId}`),
  addProductAdmin: (formData) => api.post("/api/product/product/", formData),
  addImage: (formData) => api.post("/api/product/add-image/", formData),
  getFeatures: () => api.get("/api/feature/feature/"),
  addFeature: (formData) => api.post("/api/feature/feature/", formData),
  deleteFeature: (featureId) => api.delete(`/api/feature/feature/${featureId}`),
  addSupplier: (payload) => api.post("/api/supplier/supplier/", payload),
  querySuppliers: (search) => api.get(`/api/supplier/query?search=${encodeURIComponent(search)}`),
  addOrder: (payload) => api.post("/api/order/order/", payload),
  getStatistics: (params) => api.get(`/api/statistic/statistic?${params}`),
  getPublicCategories: () => api.get("/api/customer/public/categories"),
  getPublicProducts: (params) => api.get(`/api/customer/public/product/get?${params}`),
  queryPublicProducts: (search) => api.post(`/api/customer/public/product/query?search=${encodeURIComponent(search)}`),
  getProcurementOrders: () => api.get("/api/order/procurement"),
  getCustomerCategories: () => api.get("/api/customer/categories"),
  getCustomerProducts: (params) => api.get(`/api/customer/product/get?${params}`),
  addCustomerOrder: (payload) => api.post("/api/customer/order/add", payload),
  addToFavorites: (productId) => api.post(`/api/customer/product/addToFav/${productId}`),
};

export default apiService;
