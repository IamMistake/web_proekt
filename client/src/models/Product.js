class Product {
  constructor({
    _id,
    brand,
    productNo,
    keyProperties,
    price,
    stockStatus,
    category,
    imageList,
  }) {
    this.id = _id;
    this.brand = brand;
    this.productNo = productNo;
    this.keyProperties = keyProperties;
    this.price = price;
    this.stockStatus = stockStatus || { stockQuantity: 0 };
    this.category = category || [];
    this.imageList = imageList || [];
  }
}

export default Product;
