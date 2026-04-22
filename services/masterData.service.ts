import api from "@/lib/axios";

type HandleResponse<T> = {
  status: boolean;
  code: number;
  data: T;
  message?: string;
};

type MasterDataResponse = {
  id: number;
  name: string;
};

const typeOfAnimal = async (): Promise<
  HandleResponse<MasterDataResponse[]>
> => {
  try {
    const res =
      await api.get<HandleResponse<MasterDataResponse[]>>("/type-of-animal");

    return res.data;
  } catch (error) {
    return error.response?.data || { message: "Something went wrong" };
  }
};

const typeOfQueue = async (): Promise<HandleResponse<MasterDataResponse[]>> => {
  try {
    const res =
      await api.get<HandleResponse<MasterDataResponse[]>>("/type-of-queue");

    return res.data;
  } catch (error) {
    return error.response?.data || { message: "Something went wrong" };
  }
};

export const masterDataService = { typeOfAnimal, typeOfQueue };
