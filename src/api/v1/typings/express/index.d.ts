import { User } from '../../features/users/types'

declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, 'password'> & { password?: string }
    }
  }
}
