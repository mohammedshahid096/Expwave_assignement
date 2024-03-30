import axios from "axios";
import { server } from "../Context/Server";

const loginServices = async (details) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    const { data } = await axios.post(`${server}/user/login`, details, config);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const myProfileService = async () => {
  try {
    const config = {
      withCredentials: true,
    };
    const { data } = await axios.get(`${server}/user/me`, config);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const LogoutService = async () => {
  try {
    const config = {
      withCredentials: true,
    };
    const { data } = await axios.get(`${server}/user/logout`, config);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export default loginServices;
