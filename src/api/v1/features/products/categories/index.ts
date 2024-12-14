import CategoryControllers from './controllers'
import CategoryServices from './services'
import CategoryValidations from './validations'

class Category {
  services: CategoryServices
  validations: CategoryValidations
  controllers: CategoryControllers

  constructor() {
    this.services = new CategoryServices()
    this.validations = new CategoryValidations()
    this.controllers = new CategoryControllers()
  }
}

const category = new Category()

export default category
