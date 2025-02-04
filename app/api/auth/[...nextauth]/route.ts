import NextAuth from 'next-auth'
import type { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (credentials?.username === process.env.ADMIN_USERNAME && 
              credentials?.password === process.env.ADMIN_PASSWORD) {
            return { id: "1", name: "Admin", email: "admin@example.com" }
          }
          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/admin/login'
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 