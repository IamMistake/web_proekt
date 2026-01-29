export const formatCurrency = (value, currency = "MKD") => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }
  return new Intl.NumberFormat("mk-MK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value));
};

export const formatDate = (value) => {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleDateString("mk-MK");
};

export const truncate = (value, length = 60) => {
  if (!value) {
    return "";
  }
  return value.length > length ? `${value.slice(0, length)}...` : value;
};

export const capitalize = (value) => {
  if (!value) {
    return "";
  }
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
};

export const stockStatusLabel = (quantity) => {
  if (quantity > 10) {
    return { text: "На залиха", variant: "success" };
  }
  if (quantity > 0) {
    return { text: "Малку на залиха", variant: "warn" };
  }
  return { text: "Нема", variant: "danger" };
};

export const formatPhone = (value) => {
  if (!value) {
    return "-";
  }
  return value.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
};
