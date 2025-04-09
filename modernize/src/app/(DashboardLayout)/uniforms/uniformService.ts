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

  allowUniformEditing: async (budgetId: string | number): Promise<boolean> => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token is missing");
      }

      const budgetIdInt = typeof budgetId === 'string' ? parseInt(budgetId, 10) : budgetId;
      
      if (isNaN(budgetIdInt) || budgetIdInt <= 0) {
        throw new Error("BudgetID inválido");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/orcamento/uniformes-go/permitir-edicao`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ budget_id: budgetIdInt }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Falha ao permitir edição do uniforme"
        );
      }

      return true;
    } catch (error) {
      console.error("Erro ao permitir edição do uniforme:", error);
      throw error;
    }
  },

  updatePlayerData: async (
    uniformId: string,
    sketchId: string,
    updatedPlayers: Player[],
  ): Promise<boolean> => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token is missing");
      }

      // Prepare the data to update (only updating players array for the specific sketch)
      const updateData = {
        sketch_id: sketchId,
        players: updatedPlayers,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/orcamento/uniformes-go/${uniformId}/players`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updateData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update player data");
      }

      return true;
    } catch (error) {
      console.error("Error updating player data:", error);
      throw error;
    }
  },

  updateAllPlayerData: async (
    uniformId: string,
    sketches: { sketchId: string; players: Player[] }[],
  ): Promise<boolean> => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token is missing");
      }

      // Usar Promise.all para executar todas as atualizações em paralelo
      const updatePromises = sketches.map((sketch) =>
        uniformService.updatePlayerData(
          uniformId,
          sketch.sketchId,
          sketch.players,
        ),
      );

      // Aguardar que todas as atualizações sejam concluídas
      await Promise.all(updatePromises);

      return true;
    } catch (error) {
      console.error("Error updating multiple sketches:", error);
      throw error;
    }
  },
};
