import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.username === process.env.ADMIN_USERNAME && 
            credentials?.password === process.env.ADMIN_PASSWORD) {
          return { id: "1", name: "Admin" }
        }
        return null
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/admin/login'
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 