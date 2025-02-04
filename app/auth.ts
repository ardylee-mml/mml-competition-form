import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const { auth, handlers: { GET, POST } } = NextAuth({
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
  ]
}) 