import axios from "axios";
import { server } from "../Context/Server";

export const AllEmployeeService = async (details) => {
  try {
    const config = {
      withCredentials: true,
    };
    const { data } = await axios.get(`${server}/employee/all`, config);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const DeleteEmployeeService = async (id) => {
  try {
    const config = {
      withCredentials: true,
    };
    const { data } = await axios.delete(
      `${server}/employee/delete/${id}`,
      config
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const AddEmployeeService = async (details) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    };
    const { data } = await axios.post(
      `${server}/employee/add`,
      details,
      config
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const GetEmployeeService = async (id) => {
  try {
    const config = {
      withCredentials: true,
    };
    const { data } = await axios.get(`${server}/employee/${id}`, config);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const updateProfileService = async (id, details) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    const { data } = await axios.put(
      `${server}/employee/update/${id}`,
      details,
      config
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const updatePhotoService = async (id, details) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    };
    const { data } = await axios.put(
      `${server}/employee/profile/${id}`,
      details,
      config
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const DashboardService = async () => {
  try {
    const config = {
      withCredentials: true,
    };
    const { data } = await axios.get(
      `${server}/employee/dashboard/graph`,
      config
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};
