export interface IEmailWelcome extends Document {
  lastName: string;
  firstName: string;
  email: string;
  username: string;
  token: string;
  expires?: Date;
}

export interface IPasswordReset extends Document {
  email: string;
  token: string;
  expires?: Date;
}
