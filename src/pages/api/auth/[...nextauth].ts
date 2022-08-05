import NextAuth, { Session, User } from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import { SPOTIFY_LOGIN_URL } from '../../../lib/spotify';

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      authorization: SPOTIFY_LOGIN_URL,
    }),
  ],
  pages: {
    // error: '/',
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.refresh_token;
      }
      return token;
    },

    async session(session: Session, user: User) {
      session.user = user;
      return session;
    },
  },
});
