export class Product {
  constructor(objProduct) {
    this.title = objProduct.title;
    this.description = objProduct.description;
    this.price = objProduct.price;
    this.thumbnail = objProduct.thumbnail;
    this.code = objProduct.code;
    this.stock = objProduct.stock;
  }

  toPojo() {
    const pojo = {
      id: this.id,
      title: this.title,
      price: this.price,
      description: this.description,
      thumbnail: this.thumbnail,
      stock: this.stock,
      code: this.code,
    };
    return pojo;
  }
}
