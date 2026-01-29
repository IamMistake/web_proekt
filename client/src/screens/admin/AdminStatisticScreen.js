import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import apiService from "../../services/apiService";

const AdminStatisticScreen = () => {
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await apiService.getStatistics("type=topSellStatistic&populateProducts=yes&maxCount=5");
        setDataPoints(res.data || []);
      } catch (error) {
        setDataPoints([]);
      }
    };
    loadStats();
  }, []);

  const chartData = {
    labels: dataPoints.map((item) => item.product?.productNo || "Н/А"),
    datasets: [
      {
        label: "Вкупна продажба",
        backgroundColor: "rgba(79, 70, 229, 0.6)",
        data: dataPoints.map((item) => item.totalSellQuantity || 0),
      },
    ],
  };

  return (
    <div className="container-main">
      <div className="page-header">
        <h1>Статистика</h1>
      </div>
      {dataPoints.length === 0 ? (
        <div className="alert alert-info">Нема податоци за статистика.</div>
      ) : (
        <div className="chart-card">
          <Bar data={chartData} />
        </div>
      )}
    </div>
  );
};

export default AdminStatisticScreen;
