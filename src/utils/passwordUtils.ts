import bcrypt from "bcryptjs";

export const compareString = async (userPassword: string, password: string) => {
  const isMatch = await bcrypt.compare(userPassword, password);
  return isMatch;
};

export const hashString = async (useValue: string) => {
  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(useValue, salt);
  return hashedPassword;
};
