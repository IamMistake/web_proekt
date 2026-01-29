class Review {
  constructor({ _id, customerId, productId, rating, comment }) {
    this.id = _id;
    this.customerId = customerId;
    this.productId = productId;
    this.rating = rating;
    this.comment = comment;
  }
}

export default Review;
