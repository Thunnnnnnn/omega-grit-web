import api from "@/lib/axios";
import { Queue } from "@/types/queue";

type HandleResponse<T> = {
  status: boolean;
  code: number;
  data: T;
  message?: string;
};

type AddQueueRequest = {
  userId: number;
  typeOfQueueId: number;
  typeOfAnimalId: number;
  meetTime: string;
};

type AddQueueResponse = {
  id: number;
  name: string;
  userId: number;
  typeOfQueueId: number;
  typeOfAnimalId: number;
  meetTime: string;
  createdAt: string;
  updatedAt: string;
};

type UpdateQueueRequest = {
  typeOfQueueId: number;
  typeOfAnimalId: number;
  meetTime: string;
};

const addQueue = async (
  data: AddQueueRequest,
): Promise<HandleResponse<AddQueueResponse>> => {
  try {
    const res = await api.post<HandleResponse<AddQueueResponse>>(
      "/queue",
      data,
    );
    return res.data;
  } catch (error) {
    return error.response?.data || { message: "Something went wrong" };
  }
};

const deleteQueue = async (
  id: number,
): Promise<HandleResponse<{ message: string }>> => {
  try {
    const res = await api.delete<HandleResponse<{ message: string }>>(
      `/queue/${id}`,
    );
    return res.data;
  } catch (error) {
    return error.response?.data || { message: "Something went wrong" };
  }
};

const getQueueById = async (
  id: number,
): Promise<HandleResponse<AddQueueResponse>> => {
  try {
    const res = await api.get<HandleResponse<AddQueueResponse>>(`/queue/${id}`);
    return res.data;
  } catch (error) {
    return error.response?.data || { message: "Something went wrong" };
  }
};

const updateQueue = async (
  id: number,
  data: UpdateQueueRequest,
): Promise<HandleResponse<AddQueueResponse>> => {
  try {
    const res = await api.put<HandleResponse<AddQueueResponse>>(
      `/queue/${id}`,
      data,
    );
    return res.data;
  } catch (error) {
    return error.response?.data || { message: "Something went wrong" };
  }
};

export const queueService = {
  addQueue,
  deleteQueue,
  getQueueById,
  updateQueue,
};
