import { useState, useEffect, useMemo } from "react";

interface User {
  id: number;
  name: string;
  role_id: number;
}

const useFetchUsersByRole = (role: string | undefined) => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [isLoadingUsers, setIsLoading] = useState(true);
  const [errorUsers, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsers = async (role:  string | undefined) => {
      try {
        setIsLoading(true);
        setError(null);

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("Usuário não autenticado.");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/user-role/get-users-by-role?role=${role}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!res.ok) throw new Error("Erro ao buscar usuários.");

        const json = await res.json();
        setUsers(json); // Salva os usuários retornados
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers(role);
  }, [role]); // A dependência de 'role' vai disparar a busca sempre que o valor de 'role' mudar.

  return useMemo(
    () => ({ users, isLoadingUsers, errorUsers }),
    [users, isLoadingUsers, errorUsers]
  );
};

export default useFetchUsersByRole;
