import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')
      if (isOnAdmin) {
        if (isLoggedIn) return true
        return false
      }
      return true
    },
  },
  pages: {
    signIn: '/admin/login',
  },
} satisfies NextAuthConfig 