import UserControllers from './controllers'
import UserMiddlewares from './middlewares'
import UserServices from './services'
import UserUtils from './utils'
import UserValidations from './validations'

class User {
  utils: UserUtils
  services: UserServices
  controllers: UserControllers
  middlewares: UserMiddlewares
  validations: UserValidations

  constructor() {
    this.utils = new UserUtils()
    this.services = new UserServices()
    this.controllers = new UserControllers()
    this.middlewares = new UserMiddlewares()
    this.validations = new UserValidations()
  }
}

const user = new User()

export default user
