import api from "@/lib/axios";

type HandleResponse<T> = {
  status: boolean;
  code: number;
  data: T;
  message?: string;
};

type UserResponse = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
};

type MasterDataResponse = {
  id: number;
  name: string;
};

type QueueResponse = {
  id: number;
  name: string;
  userId: number;
  typeOfQueueId: number;
  typeOfAnimalId: number;
  meetTime: Date;
  createdAt: Date;
  updatedAt: Date;
  user: UserResponse;
  typeOfQueue: MasterDataResponse;
  typeOfAnimal: MasterDataResponse;
};

const getQueuesByUserId = async (
  id: number,
): Promise<HandleResponse<QueueResponse[]>> => {
  try {
    const res = await api.get<HandleResponse<QueueResponse[]>>(
      `/queue/user/${id}`,
    );

    return res.data;
  } catch (error) {
    return error.response?.data || { message: "Something went wrong" };
  }
};

const changePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string,
): Promise<HandleResponse<{ message: string }>> => {
  try {
    const res = await api.post<HandleResponse<{ message: string }>>(
      `/user/${userId}/change-password`,
      {
        currentPassword,
        newPassword,
      },
    );

    return res.data;
  } catch (error) {
    return error.response?.data || { message: "Something went wrong" };
  }
};

const updateUser = async (
  userId: number,
  data: { email: string; firstname: string; lastname: string; phone: string },
): Promise<HandleResponse<UserResponse>> => {
  try {
    const res = await api.put<HandleResponse<UserResponse>>(
      `/user/${userId}`,
      data,
    );
    return res.data;
  } catch (error) {
    return error.response?.data || { message: "Something went wrong" };
  }
};

export const userService = {
  getQueuesByUserId,
  changePassword,
  updateUser,
};
