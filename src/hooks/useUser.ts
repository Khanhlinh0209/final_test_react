import { useEffect, useState } from "react";
import { userService } from "../services/userService";
import type { Employee, EmployeePayload } from "../types/user";

export function useUser(isEnabled: boolean) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    if (!isEnabled) {
      setEmployees([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await userService.getEmployees();
      setEmployees(data);
    } catch {
      setError("Cannot fetch employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isEnabled) {
      setEmployees([]);
      setError(null);
      setLoading(false);
      return;
    }

    void fetchEmployees();
  }, [isEnabled]);

  const createEmployee = async (payload: EmployeePayload) => {
    if (!isEnabled) {
      return;
    }

    setMutating(true);
    setError(null);
    try {
      await userService.createEmployee(payload);
      await fetchEmployees();
    } catch {
      setError("Cannot create employee.");
    } finally {
      setMutating(false);
    }
  };

  const updateEmployee = async (id: string, payload: EmployeePayload) => {
    if (!isEnabled) {
      return;
    }

    setMutating(true);
    setError(null);
    try {
      await userService.updateEmployee(id, payload);
      await fetchEmployees();
    } catch {
      setError("Cannot update employee.");
    } finally {
      setMutating(false);
    }
  };

  const deleteEmployee = async (id: string) => {
    if (!isEnabled) {
      return;
    }

    setMutating(true);
    setError(null);
    try {
      await userService.deleteEmployee(id);
      await fetchEmployees();
    } catch {
      setError("Cannot delete employee.");
    } finally {
      setMutating(false);
    }
  };

  return {
    employees,
    loading,
    mutating,
    error,
    refetchEmployees: fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
}
