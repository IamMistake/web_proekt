class Order {
  constructor({ _id, customerId, items, orderTotalPrice, date, address }) {
    this.id = _id;
    this.customerId = customerId;
    this.items = items || [];
    this.orderTotalPrice = orderTotalPrice;
    this.date = date;
    this.address = address;
  }
}

export default Order;
