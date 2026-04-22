import { User } from "./user";

export type Queue = {
  id: number;
  name: string;
  typeOfQueue: {
    id: number;
    name: string;
  };
  typeOfAnimal: {
    id: number;
    name: string;
  };
  meetTime: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user: User;
};
