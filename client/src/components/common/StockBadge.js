import React from "react";
import { stockStatusLabel } from "../../utils/formatters";

const StockBadge = ({ quantity }) => {
  const status = stockStatusLabel(quantity);
  return <span className={`pill ${status.variant}`}>{status.text} ({quantity})</span>;
};

export default StockBadge;
