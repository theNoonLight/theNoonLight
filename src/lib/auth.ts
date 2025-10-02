import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // Temporarily remove the Supabase adapter to fix the schema error
  // We'll handle user storage manually in the callbacks
  callbacks: {
    async signIn({ user, account }) {
      // Store user in Supabase manually
      if (account?.provider === "google" && user.email) {
        try {
          const { createClient } = await import("@supabase/supabase-js");
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
          );

          // Check if user exists, if not create them
          const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("email", user.email)
            .single();

          if (!existingUser) {
            await supabase.from("users").insert({
              email: user.email,
              name: user.name,
              image: user.image,
              created_at: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error("Error storing user:", error);
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
};
