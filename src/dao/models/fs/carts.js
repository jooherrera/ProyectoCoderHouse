import { v4 as uuidv4 } from "uuid";

export class Carts {
  constructor() {
    this.cID = uuidv4();
    this.productos = [];
  }

  sumarProductoAlArreglo(id) {
    const productoCart = this.productos.find((element) => element.id === id);

    if (productoCart) {
      productoCart.quantity++;
      console.log(`Se Sumo +1 al producto ${id} en el Carro ${this.cID}`);
    } else {
      const nuevoProductCart = {
        id: id,
        quantity: 1,
      };
      this.productos.push(nuevoProductCart);
      console.log(`Se Agrego el producto ${id} en el Carro ${this.cID}`);
    }
    return this.getArrayProductsCast();
  }

  async getArrayProductsCast() {
    return [...this.productos];
  }
}
