const demoProducts = [
  {
    id: "demo-1",
    category: "Процесори",
    productNo: "AMD Ryzen 9 7950X",
    price: 54990,
    stock: 15,
    image: "https://via.placeholder.com/400x300/667eea/fff?text=AMD+Ryzen",
    specs: [
      { key: "Код", value: "RY9-7950X" },
      { key: "Јадра", value: "16" },
      { key: "Фреквенција", value: "4.5 GHz" },
    ],
    description: "Високи перформанси за професионални и гејминг апликации.",
  },
  {
    id: "demo-2",
    category: "Графички картички",
    productNo: "NVIDIA GeForce RTX 4090",
    price: 149990,
    stock: 3,
    image: "https://via.placeholder.com/400x300/764ba2/fff?text=RTX+4090",
    specs: [
      { key: "Код", value: "RTX-4090" },
      { key: "VRAM", value: "24GB" },
      { key: "Интерфејс", value: "PCIe 4.0" },
    ],
    description: "Екстремна графичка моќ за најнови игри и AI задачи.",
  },
  {
    id: "demo-3",
    category: "Складирање",
    productNo: "SSD 1TB NVMe",
    price: 9990,
    stock: 22,
    image: "https://via.placeholder.com/400x300/10b981/fff?text=SSD+1TB",
    specs: [
      { key: "Код", value: "SSD-1TB" },
      { key: "Интерфејс", value: "M.2" },
      { key: "Брзина", value: "3500 MB/s" },
    ],
    description: "Брзо складирање за секојдневна работа и игри.",
  },
];

export default demoProducts;
