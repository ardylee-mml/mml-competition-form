import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const { auth, handlers: { GET, POST } } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/admin/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('Auth attempt:', {
          provided: credentials?.username,
          expected: process.env.ADMIN_USERNAME
        });
        
        if (credentials?.username === process.env.ADMIN_USERNAME && 
            credentials?.password === process.env.ADMIN_PASSWORD) {
          return { id: "1", name: "Admin" }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user }
    },
    async session({ session, token }) {
      return session
    }
  }
}) 