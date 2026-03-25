import { useCrud } from "./useCrud";
import { userService } from "../services/userService";
import type { Employee, EmployeePayload } from "../types/user";

export function useEmployee(isEnabled: boolean) {
  const {
    items: employees,
    loading,
    mutating,
    error,
    refetch: refetchEmployees,
    createItem: createEmployee,
    updateItem: updateEmployee,
    deleteItem: deleteEmployee,
  } = useCrud<Employee, EmployeePayload, EmployeePayload, string>({
    service: userService,
    enabled: isEnabled,
    messages: {
      fetch: "Cannot fetch employees.",
      create: "Cannot create employee.",
      update: "Cannot update employee.",
      delete: "Cannot delete employee.",
    },
    optimistic: {
      create: (current, payload) => [
        ...current,
        {
          id: `temp-${Date.now()}`,
          fullName: payload.fullName,
          department: payload.department,
          gender: payload.gender,
        },
      ],
      update: (current, id, payload) =>
        current.map((employee) =>
          employee.id === id
            ? {
              ...employee,
              ...payload,
            }
            : employee,
        ),
      delete: (current, id) => current.filter((employee) => employee.id !== id),
    },
  });

  return {
    employees,
    loading,
    mutating,
    error,
    refetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
}
