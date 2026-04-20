export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type KeyOfUser = keyof User;
