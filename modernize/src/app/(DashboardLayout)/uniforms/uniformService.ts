import { ApiResponse, Player, Sketch, UniformData } from "./types";

export const uniformService = {
  getUniformsByBudgetId: async (
    budgetId: string | number,
  ): Promise<ApiResponse> => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token is missing");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/orcamento/uniformes-go/${budgetId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch uniforms data");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching uniforms:", error);
      throw error;
    }
  },

  updatePlayerData: async (
    budgetId: string | number,
    updates?: Array<{ sketch_id: string; players: Player[] }>,
    editable?: boolean
  ): Promise<boolean> => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token is missing");
      }

      const budgetIdInt = typeof budgetId === 'string' ? parseInt(budgetId, 10) : budgetId;
      
      if (isNaN(budgetIdInt) || budgetIdInt <= 0) {
        throw new Error("BudgetID inválido");
      }

      const requestData: {
        budget_id: number;
        updates?: Array<{ sketch_id: string; players: Player[] }>;
        editable?: boolean;
      } = {
        budget_id: budgetIdInt
      };

      if (updates && updates.length > 0) {
        requestData.updates = updates;
      }

      let url = `${process.env.NEXT_PUBLIC_API}/api/orcamento/uniformes-go`;
      if (editable === true) {
        url += '?editable=true';
        requestData.editable = true;
      }

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Falha ao atualizar dados dos jogadores"
        );
      }

      return true;
    } catch (error) {
      console.error("Erro ao atualizar dados dos jogadores:", error);
      throw error;
    }
  },
};
