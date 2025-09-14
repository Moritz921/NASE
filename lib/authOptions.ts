import AuthentikProvider from "next-auth/providers/authentik";

export const authOptions = {
  providers: [
    AuthentikProvider({
      issuer: process.env.OIDC_ISSUER,
      clientId: process.env.OIDC_CLIENT_ID!,
      clientSecret: process.env.OIDC_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      // Gruppen ins Token übernehmen
      if (profile && profile.groups) {
        token.groups = profile.groups;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        email: token.email,
        groups: token.groups ?? [],
      };
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  }
};
