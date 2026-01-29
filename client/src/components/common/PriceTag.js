import React from "react";
import { formatCurrency } from "../../utils/formatters";

const PriceTag = ({ value, currency = "MKD" }) => (
  <div className="price-current">{formatCurrency(value, currency)}</div>
);

export default PriceTag;
