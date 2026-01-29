import React from "react";
import { Switch } from "react-router-dom";
import AdminRoute from "../../components/routes/AdminRoute";
import AdminProductListScreen from "../../screens/admin/AdminProductListScreen";
import AdminAddProductScreen from "../../screens/admin/AdminAddProductScreen";
import AdminEditProductScreen from "../../screens/admin/AdminEditProductScreen";
import IntegrationScreen from "../../screens/shop/IntegrationScreen";
import AdminCategoryScreen from "../../screens/admin/AdminCategoryScreen";
import AdminFeatureScreen from "../../screens/admin/AdminFeatureScreen";
import AdminSupplierScreen from "../../screens/admin/AdminSupplierScreen";
import AdminOrderScreen from "../../screens/admin/AdminOrderScreen";
import AdminStatisticScreen from "../../screens/admin/AdminStatisticScreen";
import NotFound from "../../screens/404/NotFound";

const AdminRoutes = () => (
  <Switch>
    <AdminRoute exact path="/admin/products" component={AdminProductListScreen} />
    <AdminRoute exact path="/admin/products/add" component={AdminAddProductScreen} />
    <AdminRoute exact path="/admin/products/:id/edit" component={AdminEditProductScreen} />
    <AdminRoute exact path="/admin/categories" component={AdminCategoryScreen} />
    <AdminRoute exact path="/admin/features" component={AdminFeatureScreen} />
    <AdminRoute exact path="/admin/suppliers" component={AdminSupplierScreen} />
    <AdminRoute exact path="/admin/orders" component={AdminOrderScreen} />
    <AdminRoute exact path="/admin/statistics" component={AdminStatisticScreen} />
    <AdminRoute exact path="/admin/integration" component={IntegrationScreen} />
    <AdminRoute component={NotFound} />
  </Switch>
);

export default AdminRoutes;
