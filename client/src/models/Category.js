class Category {
  constructor({ _id, title, isMainCategory, isSpecial }) {
    this.id = _id;
    this.title = title;
    this.isMainCategory = isMainCategory;
    this.isSpecial = isSpecial;
  }
}

export default Category;
