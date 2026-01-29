import React from "react";
import { Route, Switch } from "react-router-dom";
import ProductListScreen from "../../screens/shop/ProductListScreen";
import ProductDetailScreen from "../../screens/shop/ProductDetailScreen";
import CartScreen from "../../screens/shop/CartScreen";
import CompareScreen from "../../screens/shop/CompareScreen";
import SearchScreen from "../../screens/shop/SearchScreen";
import IntegrationScreen from "../../screens/shop/IntegrationScreen";
import NotFound from "../../screens/404/NotFound";

const ShopRoutes = () => (
  <Switch>
    <Route exact path="/products" component={ProductListScreen} />
    <Route exact path="/products/:id" component={ProductDetailScreen} />
    <Route exact path="/cart" component={CartScreen} />
    <Route exact path="/compare" component={CompareScreen} />
    <Route exact path="/search" component={SearchScreen} />
    <Route exact path="/integration" component={IntegrationScreen} />
    <Route component={NotFound} />
  </Switch>
);

export default ShopRoutes;
