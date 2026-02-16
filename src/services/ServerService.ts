import axios from '@/lib/axios';

export interface ServerTimeResponse {
  serverTime: string;
  serverDate?: string;
}

export const getServerTime = async (): Promise<ServerTimeResponse> => {
  const res = await axios.get<ServerTimeResponse>('/system-config/server-time');
  return res.data;
};

const ServerService = {
  getServerTime,
};

export default ServerService;
