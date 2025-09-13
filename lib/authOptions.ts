export const authOptions = {
  providers: [
    {
      id: "authentik",
      name: "Authentik",
      type: "openid-connect",
      issuer: process.env.OIDC_ISSUER,
      clientId: process.env.OIDC_CLIENT_ID,
      clientSecret: process.env.OIDC_CLIENT_SECRET,
      authorization: { params: { scope: "openid profile email" } },
    },
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = { ...session.user, email: token.email };
      return session;
    },
  },
};
