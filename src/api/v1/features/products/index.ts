import ProductControllers from './controllers'
import ProductMiddlewares from './middlewares'
import ProductServices from './services'
import ProductValidations from './validations'

class Product {
  services: ProductServices
  validations: ProductValidations
  controllers: ProductControllers
  middlewares: ProductMiddlewares

  constructor() {
    this.services = new ProductServices()
    this.validations = new ProductValidations()
    this.controllers = new ProductControllers()
    this.middlewares = new ProductMiddlewares()
  }
}

const product = new Product()

export default product
