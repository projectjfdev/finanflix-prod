import { IUser } from "@/interfaces/user";

declare module "next-auth" {
  interface Session {
    user: IUser;
  }
}
