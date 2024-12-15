import CartControllers from './controllers'
import CartMiddlewares from './middlewares'
import CartServices from './services'
import CartValidations from './validations'

class Cart {
  validations: CartValidations
  services: CartServices
  middlewares: CartMiddlewares
  controllers: CartControllers

  constructor() {
    this.validations = new CartValidations()
    this.services = new CartServices()
    this.middlewares = new CartMiddlewares()
    this.controllers = new CartControllers()
  }
}

const cart = new Cart()

export default cart
