import { connectDB } from './dbConfig';
import { AuthOptions, Account } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import Users from '../models/userModel';
import bcrypt from 'bcryptjs';
import GoogleProvider from 'next-auth/providers/google';
import DiscordProvider from 'next-auth/providers/discord';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        await connectDB();
        try {
          const user = await Users.findOne({ email: credentials.email });
          if (!user) throw Error('Invalid credentials');
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
            if (isPasswordCorrect) {
              // return {password, ...userWithoutPass} = user;
              return user;
            }
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string, // Corregido aquí
      // definir scopes para obtener info de los usuarios de discord por ej email
      authorization: {
        params: {
          scope: 'identify email',
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  // pages: {
  //   signIn: "/login",
  // },
  debug: true,
  callbacks: {
    async jwt({ token, user, session, trigger }: any) {
      if (trigger === 'update') {
        token = { ...token, ...session };
      }
      if (user) token.user = user;

      return token;
    },

    session: async ({ session, token }: { session: any; token: any }) => {
      try {
        if (token && token.user && token.user.email) {
          await connectDB();
          // console.log(token.user.id); // ESTO NOS TRAE EL ID DE DISCORD
          // Busca el usuario en la BD y con el .lean() parsea todo el JSON para adaptarlo a que sea un token
          // Por las dudas tambien decimos que el id sea string con el metodo toString()
          const myUser = await Users.findOne({
            email: token.user.email,
          }).lean();

          // Validar que el usuario exista
          if (myUser) {
            session.user = {
              //  ...session.user,
              ...myUser,
              //  id: myUser._id.toString(),
            };
          } else {
            console.warn('User not found in database for session:', token.user.email);
          }
        } else {
          console.warn('Token does not contain user email:', token);
        }
      } catch (error) {
        console.error('Error fetching user from database:', error);
      }

      return session;
    },
    async signIn({ user, account }: { user: any; account: Account | null }) {
      if (account?.provider == 'credentials') {
        const existingUser = await Users.findById(user._id ?? '');
        if (!existingUser?.verified) {
          return false;
        }
        return true;
      }
      // Loguearse con Google
      if (account?.provider === 'google') {
        const { email } = user;
        try {
          await connectDB();
          const existingUser = await Users.findOne({ email });
          if (!existingUser) {
            const newUser = new Users({
              email: user.email,
              username: user.name,
              profileImage: user.image,
            });
            await newUser.save();
            return true;
          }
          return true;
        } catch (error) {
          console.log(error);
          return false; // Devuelve false en caso de error
        }
      }

      // Loguearse con discord
      if (account?.provider === 'discord') {
        const { email } = user;
        try {
          await connectDB();
          const existingUser = await Users.findOne({ email });
          if (!existingUser) {
            const newUser = new Users({
              email: user.email,
              username: user.name,
              profileImage: {
                url: user.image,
                public_id: crypto.randomUUID(),
              },
            });
            await newUser.save();
            return true;
          }
          return true;
        } catch (error) {
          console.log(error);
          return false; // Devuelve false en caso de error
        }
      }

      return false; // Devuelve false si no se cumple ninguna condición
    },
  },
};
