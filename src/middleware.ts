// import { getToken } from 'next-auth/jwt';
// import { NextResponse } from 'next/server';

// export default async function middleware(req) {
//   const token = await getToken({ req, secret: process.env.JWT_SECRET });
//   const { pathname, origin } = req.nextUrl;

//   if (pathname.includes('api/auth') || token) {
//     return NextResponse.next();
//   }

//   if (!token && pathname !== '/login') {
//     return NextResponse.redirect(`${origin}/login`);
//   }
// }

// withAuth

import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: async ({ req, token }) => {
      const pathname = req.nextUrl.pathname;

      if (token) return true;

      return false;
    },
  },
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: ['/'],
};
