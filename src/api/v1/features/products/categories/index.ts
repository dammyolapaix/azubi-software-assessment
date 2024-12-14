import CategoryControllers from './controllers'
import CategoryMiddlewares from './middlewares'
import CategoryServices from './services'
import CategoryValidations from './validations'

class Category {
  services: CategoryServices
  validations: CategoryValidations
  controllers: CategoryControllers
  middlewares: CategoryMiddlewares

  constructor() {
    this.services = new CategoryServices()
    this.validations = new CategoryValidations()
    this.controllers = new CategoryControllers()
    this.middlewares = new CategoryMiddlewares()
  }
}

const category = new Category()

export default category
