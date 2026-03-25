import { axiosClient } from "./axiosClient";
import type { Employee, EmployeePayload } from "../types/user";

export const userService = {
  getEmployees: async (): Promise<Employee[]> => {
    const { data } = await axiosClient.get<Employee[]>("/employees");
    return data;
  },
  createEmployee: async (payload: EmployeePayload): Promise<Employee> => {
    const { data } = await axiosClient.post<Employee>("/employees", payload);
    return data;
  },
  updateEmployee: async (id: string, payload: EmployeePayload): Promise<Employee> => {
    const { data } = await axiosClient.put<Employee>(`/employees/${id}`, payload);
    return data;
  },
  deleteEmployee: async (id: string): Promise<void> => {
    await axiosClient.delete(`/employees/${id}`);
  },
};
