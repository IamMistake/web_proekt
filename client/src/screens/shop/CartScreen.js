import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useCart } from "../../context/CartContext";
import ModalDialog from "../../components/common/ModalDialog";
import { formatCurrency } from "../../utils/formatters";
import apiService from "../../services/apiService";

const cardRegex = /^\d{16}$/;
const cvvRegex = /^\d{3}$/;
const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

const CartScreen = () => {
  const { items, updateQuantity, removeItem, clear } = useCart();
  const { isAuthenticated, role } = useSelector((state) => state.authReducer);
  const [step, setStep] = useState(1);
  const [modalItem, setModalItem] = useState(null);
  const [address, setAddress] = useState({ receiver: "", addressString: "", city: "" });
  const [payment, setPayment] = useState({ cardNumber: "", cvvCode: "", expiryDate: "", cardHolder: "" });
  const [errors, setErrors] = useState({});
  const [orderComplete, setOrderComplete] = useState(false);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const validatePayment = () => {
    const nextErrors = {};
    if (!cardRegex.test(payment.cardNumber)) {
      nextErrors.cardNumber = "Картичката мора да има 16 цифри.";
    }
    if (!cvvRegex.test(payment.cvvCode)) {
      nextErrors.cvvCode = "CVV мора да има 3 цифри.";
    }
    if (!expiryRegex.test(payment.expiryDate)) {
      nextErrors.expiryDate = "Форматот е MM/YY.";
    }
    if (payment.cardHolder.trim().length < 3) {
      nextErrors.cardHolder = "Внесете име на носител.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePay = async () => {
    if (!validatePayment()) {
      return;
    }
    if (!isAuthenticated || role !== "customer") {
      setErrors({ auth: "За плаќање потребна е најава како купувач." });
      return;
    }

    const payload = {
      type: "sell",
      items: items.map((item) => ({
        productId: item.id,
        price: item.price,
        quantity: item.quantity,
      })),
      orderTotalPrice: Number(total.toFixed(2)),
      address,
      cardNumber: payment.cardNumber,
      cvvCode: payment.cvvCode,
      expiryDate: payment.expiryDate,
      cardHolder: payment.cardHolder,
    };

    try {
      await apiService.addCustomerOrder(payload);
      clear();
      setOrderComplete(true);
      setStep(4);
    } catch (error) {
      setErrors({ auth: "Се појави грешка при плаќањето." });
    }
  };

  return (
    <div className="container-main">
      <h1>Кошничка</h1>
      <div className="stepper mb-3">
        {["Продукти", "Адреса", "Плаќање", "Потврда"].map((label, index) => (
          <div key={label} className={`step ${step === index + 1 ? "active" : ""}`}>
            {label}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          {items.length === 0 ? (
            <div className="alert alert-info">Немате додадено производи.</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="card-soft mb-3">
                <div className="d-flex gap-3 align-items-center">
                  <img src={item.image} alt={item.productNo} style={{ width: 100 }} />
                  <div className="flex-grow-1">
                    <h6>{item.productNo}</h6>
                    <div className="text-muted">{formatCurrency(item.price)}</div>
                  </div>
                  <div style={{ width: 160 }}>
                    <div className="input-group">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="form-control text-center"
                        value={item.quantity}
                        min="1"
                        onChange={(e) => updateQuantity(item.id, Math.max(1, Number(e.target.value)))}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <button className="btn btn-danger" onClick={() => setModalItem(item)}>
                      <i className="fas fa-trash" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          <div className="d-flex justify-content-end gap-3">
            <div className="fw-bold">Вкупно: {formatCurrency(total)}</div>
            <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!items.length}>
              Продолжи
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card-soft">
          <h5 className="page-section-title">Адреса за испорака</h5>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Примач</label>
              <input
                className="form-control"
                value={address.receiver}
                onChange={(e) => setAddress({ ...address, receiver: e.target.value })}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Град</label>
              <input
                className="form-control"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Адреса</label>
            <input
              className="form-control"
              value={address.addressString}
              onChange={(e) => setAddress({ ...address, addressString: e.target.value })}
            />
          </div>
          <div className="d-flex justify-content-between">
            <button className="btn btn-outline-secondary" onClick={() => setStep(1)}>
              Назад
            </button>
            <button className="btn btn-primary" onClick={() => setStep(3)}>
              Продолжи
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card-soft">
          <h5 className="page-section-title">Плаќање</h5>
          {errors.auth && <div className="alert alert-danger">{errors.auth}</div>}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Број на картичка</label>
              <input
                className="form-control"
                value={payment.cardNumber}
                onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value.replace(/\D/g, "") })}
                maxLength="16"
              />
              {errors.cardNumber && <small className="text-danger">{errors.cardNumber}</small>}
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">CVV</label>
              <input
                className="form-control"
                value={payment.cvvCode}
                onChange={(e) => setPayment({ ...payment, cvvCode: e.target.value.replace(/\D/g, "") })}
                maxLength="3"
              />
              {errors.cvvCode && <small className="text-danger">{errors.cvvCode}</small>}
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Важност</label>
              <input
                className="form-control"
                placeholder="MM/YY"
                value={payment.expiryDate}
                onChange={(e) => setPayment({ ...payment, expiryDate: e.target.value })}
              />
              {errors.expiryDate && <small className="text-danger">{errors.expiryDate}</small>}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Носител</label>
            <input
              className="form-control"
              value={payment.cardHolder}
              onChange={(e) => setPayment({ ...payment, cardHolder: e.target.value })}
            />
            {errors.cardHolder && <small className="text-danger">{errors.cardHolder}</small>}
          </div>
          <div className="d-flex justify-content-between">
            <button className="btn btn-outline-secondary" onClick={() => setStep(2)}>
              Назад
            </button>
            <button className="btn btn-primary" onClick={handlePay}>
              Плати {formatCurrency(total)}
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="card-soft text-center">
          {orderComplete ? (
            <div>
              <h4>Плаќањето е успешно!</h4>
              <p>Вашата нарачка е евидентирана.</p>
            </div>
          ) : (
            <div>
              <h4>Чекор за потврда</h4>
              <p>Продолжете за да ја завршите нарачката.</p>
            </div>
          )}
        </div>
      )}

      <ModalDialog
        show={Boolean(modalItem)}
        title="Отстрани производ"
        body={modalItem ? `Дали сакате да го отстраните ${modalItem.productNo}?` : ""}
        onClose={() => setModalItem(null)}
        onConfirm={() => {
          if (modalItem) {
            removeItem(modalItem.id);
          }
          setModalItem(null);
        }}
      />
    </div>
  );
};

export default CartScreen;
