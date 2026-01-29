import React from "react";
import { Line } from "react-chartjs-2";
import exchangeRateService from "../../services/exchangeRateService";
import { formatCurrency } from "../../utils/formatters";

const IntegrationScreen = () => {
  const rates = exchangeRateService.getRates();
  const mkdPrice = 54990;
  const eurPrice = exchangeRateService.convertFromMkd(mkdPrice, "EUR").toFixed(2);
  const usdPrice = exchangeRateService.convertFromMkd(mkdPrice, "USD").toFixed(2);

  const chartData = {
    labels: ["Пон", "Вто", "Сре", "Чет", "Пет", "Саб", "Нед"],
    datasets: [
      {
        label: "TechStore",
        data: [54000, 54500, 54990, 54700, 55200, 54990, 54850],
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        tension: 0.3,
      },
      {
        label: "Competitor A",
        data: [56000, 55800, 56500, 56300, 56200, 56000, 55900],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="container-main">
      <h1>Интеграција</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card-soft">
            <h5>Модел: AMD Ryzen 9 7950X</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between">
                TechStore <span className="text-primary">{formatCurrency(mkdPrice)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                Цена во EUR <span>{eurPrice} EUR</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                Цена во USD <span>{usdPrice} USD</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                Курс (MKD/EUR) <span>{rates.EUR}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                Курс (MKD/USD) <span>{rates.USD}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-6">
          <div className="chart-card">
            <h6>Историја на цена</h6>
            <Line data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationScreen;
