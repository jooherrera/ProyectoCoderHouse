import { error } from "console";
import { Carts } from "./carts.js";
import fs from "fs";

//Manager de Carts con la ruta a la Base de datos y al arreglo de carts

class CartsManager {
  #ruta;
  #arrayCarts;

  constructor() {
    this.#ruta = `../../dataBase/DataBaseCarts.json`;
    this.#arrayCarts = [];
    if (fs.existsSync(this.#ruta)) {
      this.#arrayCarts = JSON.parse(fs.readFileSync(this.#ruta));
    } else {
      this.#arrayCarts = [];
      fs.writeFileSync(this.#ruta, JSON.stringify(this.#arrayCarts));
    }
  }

  //Agrega un producto al carts, si ya existe en el carro lo suma, sino lo agrega en sumarProductoAlArreglo, si no encuentra el ID tira un Error de ID invalido
  async addProductsCartsByCId(cID, idProduct) {
    try {
      for (let index = 0; index < this.#arrayCarts.length; index++) {
        if (this.#arrayCarts[index].cID == cID) {
          var cartPorID = this.#arrayCarts[index];
          break;
        }
      }
      if (cartPorID) {
        await this.sumarProductoAlArreglo(idProduct, cartPorID);
        await fs.promises.writeFile(
          this.#ruta,
          JSON.stringify(this.#arrayCarts)
        );
        return cartPorID;
      } else {
        throw error("ID INVALIDO");
      }
    } catch (error) {
      throw error("Error al sumar producto");
    }
  }

  //Si existe el producto lo suma, sino agrega el producto con el ID del producto y un quantity en 1
  async sumarProductoAlArreglo(idProduct, cartPorID) {
    const productoCart = cartPorID.productos.find(
      (element) => element.id === idProduct
    );

    if (productoCart) {
      productoCart.quantity++;
      return `Se Sumo +1 al producto ${idProduct} en el Carro ${idProduct}`;
    } else {
      const nuevoProductCart = {
        id: idProduct,
        quantity: 1,
      };
      cartPorID.productos.push(nuevoProductCart);
      return `Se Agrego el producto ${idProduct} en el Carro ${idProduct}`;
    }
  }

  //Crea un nuevo Carts vacio con un ID aleatorio y lo agrega a al archivo de carts
  async createCarts() {
    try {
      const newCarts = new Carts();
      this.#arrayCarts.push(newCarts);
      await fs.promises.writeFile(this.#ruta, JSON.stringify(this.#arrayCarts));
      return `Carts con ID ${newCarts.cID} Creado`;
    } catch (error) {
      return error;
    }
  }

  //devuelve el arreglo de Carts
  async getArrayCast() {
    return [...this.#arrayCarts];
  }

  //devuelve el arreglo de productos del cID especifico, si no lo encuentra tira Error
  async getArraysByCId(cID) {
    let cartPorID = this.#arrayCarts.find((element) => element.cID === cID);
    if (cartPorID) {
      return [...cartPorID.productos];
    } else {
      throw error("ID INVALIDO");
    }
  }
  async deleateCarts(cID) {}
}

export const cartsManager = new CartsManager();
