import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import apiService from "../../services/apiService";
import demoProducts from "../../data/demoProducts";
import { formatCurrency } from "../../utils/formatters";

const CompareScreen = () => {
  const { isAuthenticated, role } = useSelector((state) => state.authReducer);
  const [products, setProducts] = useState([]);
  const [selection, setSelection] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated && role === "customer") {
        try {
          const productsRes = await apiService.getCustomerProducts("");
          const mappedProducts = (productsRes.data || []).map((item) => ({
            id: item._id,
            category: (item.category || []).length > 0 ? item.category[0]?.title || "Категорија" : "",
            productNo: item.productNo,
            price: item.price,
            stock: item.stockStatus?.stockQuantity || 0,
            specs: item.specs || [],
            image: item.imageList?.[0]
              ? `/api/product/images/${item.imageList[0].imageId}`
              : "https://via.placeholder.com/400x300/667eea/fff?text=Product",
          }));
          setProducts(mappedProducts);
          setSelection([
            mappedProducts[0]?.id,
            mappedProducts[1]?.id,
            mappedProducts[2]?.id,
          ].filter(Boolean));
        } catch (error) {
          if (error.response?.status === 401) {
            setProducts([]);
            return;
          }
          setProducts(demoProducts);
          setSelection([demoProducts[0]?.id, demoProducts[1]?.id, demoProducts[2]?.id].filter(Boolean));
        }
      } else {
        try {
          const productsRes = await apiService.getPublicProducts("");
          const mappedProducts = (productsRes.data || []).map((item) => ({
            id: item._id,
            category: (item.category || []).length > 0 ? item.category[0]?.title || "Категорија" : "",
            productNo: item.productNo,
            price: item.price,
            stock: item.stockStatus?.stockQuantity || 0,
            specs: item.specs || [],
            image: item.imageList?.[0]
              ? `/api/product/images/${item.imageList[0].imageId}`
              : "https://via.placeholder.com/400x300/667eea/fff?text=Product",
          }));
          setProducts(mappedProducts);
          setSelection([
            mappedProducts[0]?.id,
            mappedProducts[1]?.id,
            mappedProducts[2]?.id,
          ].filter(Boolean));
        } catch (error) {
          setProducts(demoProducts);
          setSelection([demoProducts[0]?.id, demoProducts[1]?.id, demoProducts[2]?.id].filter(Boolean));
        }
      }
    };
    loadData();
  }, [isAuthenticated, role]);

  const selectedProducts = useMemo(
    () => selection.map((id) => products.find((item) => item.id === id)),
    [selection, products]
  );

  const specs = useMemo(() => {
    const keys = new Set();
    selectedProducts.forEach((product) => product?.specs?.forEach((spec) => keys.add(spec.key)));
    return Array.from(keys);
  }, [selectedProducts]);

  return (
    <div className="container-main">
      <h1>Споредување на производи</h1>
      <div className="card-soft mb-3">
        <div className="d-flex gap-2 flex-wrap">
          {selection.map((value, index) => (
            <select
              key={index}
              className="form-select"
              value={value}
              onChange={(e) => {
                const next = [...selection];
                next[index] = e.target.value;
                setSelection(next);
              }}
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.productNo}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Спецификација</th>
              {selectedProducts.map((product) => (
                <th key={product?.id}>{product?.productNo}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Цена</th>
              {selectedProducts.map((product) => (
                <td key={`${product?.id}-price`}>{formatCurrency(product?.price)}</td>
              ))}
            </tr>
            {specs.map((specKey) => (
              <tr key={specKey}>
                <th>{specKey}</th>
                {selectedProducts.map((product) => (
                  <td key={`${product?.id}-${specKey}`}>
                    {product?.specs?.find((spec) => spec.key === specKey)?.value || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareScreen;
