import api from "@/lib/axios";

type HandleResponse<T> = {
  status: boolean;
  code: number;
  data: T;
  message?: string;
};

type LoginResponse = {
  accessToken: string;
  user: UserLoginResponse;
};

type UserLoginResponse = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
};

type RegisterData = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phone: string;
};

type UserResponse = {
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
};

const login = async (
  email: string,
  password: string,
): Promise<HandleResponse<LoginResponse>> => {
  try {
    const res = await api.post<HandleResponse<LoginResponse>>("/auth/login", {
      email,
      password,
    });

    return res.data;
  } catch (error) {
    return error.response?.data || { message: "Something went wrong" };
  }
};

const register = async (
  data: RegisterData,
): Promise<HandleResponse<UserResponse>> => {
  try {
    const res = await api.post<HandleResponse<UserResponse>>("/user", data);
    return res.data;
  } catch (error) {
    return error.response?.data || { message: "Something went wrong" };
  }
};

export const authService = { login, register };
