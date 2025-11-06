import axios from "@/lib/axios";
import type { User } from "@/types/user";

export const getUsers = async (): Promise<User[]> => {
    const response = await axios.get<User[]>("/users");
    return response.data;
};