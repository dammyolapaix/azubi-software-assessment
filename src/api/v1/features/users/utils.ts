import { compare, hash } from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import env from '../../env'
import { SessionUser } from './types'

export default class UserUtils {
  private SALT_ROUNDS = 10
  private key = new TextEncoder().encode(env.AUTH_SECRET)

  hashPassword = (password: string) => hash(password, this.SALT_ROUNDS)

  comparePasswords = (plainTextPassword: string, hashedPassword: string) =>
    compare(plainTextPassword, hashedPassword)

  isPasswordStrong = (password: string): boolean => {
    // Define your complexity criteria
    const hasUpperCase = /[A-Z]/.test(password) // Check for at least one uppercase letter
    const hasLowerCase = /[a-z]/.test(password) // Check for at least one lowercase letter
    const hasNumbers = /\d/.test(password) // Check for at least one digit
    const hasSpecialChars = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(password) // Check for at least one special character
    const has8CharactersOrMore = password.length >= 8 // Check for at least 8 characters

    //   Check if all complexity criteria are met
    return (
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChars &&
      has8CharactersOrMore
    )
  }

  signToken = async (payload: SessionUser) =>
    await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(this.key)

  verifyToken = async (input: string) => {
    const { payload } = await jwtVerify(input, this.key, {
      algorithms: ['HS256'],
    })

    return payload as SessionUser
  }
}
