import React, { useMemo, useState } from "react";
import demoProducts from "../../data/demoProducts";
import { formatCurrency } from "../../utils/formatters";

const CompareScreen = () => {
  const [selection, setSelection] = useState([
    demoProducts[0]?.id,
    demoProducts[1]?.id,
    demoProducts[2]?.id,
  ]);

  const selectedProducts = useMemo(
    () => selection.map((id) => demoProducts.find((item) => item.id === id)),
    [selection]
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
              {demoProducts.map((product) => (
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
