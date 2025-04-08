import { ApiResponse } from './types';

export const uniformService = {
  getUniformsByBudgetId: async (budgetId: string | number): Promise<ApiResponse> => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token is missing');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamento/uniformes-go/${budgetId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch uniforms data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching uniforms:', error);
      throw error;
    }
  }
}; 