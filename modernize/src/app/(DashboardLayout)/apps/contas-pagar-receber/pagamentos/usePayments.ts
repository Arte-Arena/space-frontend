import { useState } from 'react';
import { Payment, mockPayments } from './types';

export const usePayments = () => {
  const [budgetId, setBudgetId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState('');

  const handleSearch = () => {
    if (!budgetId.trim()) {
      setError('Por favor, insira um ID de orçamento válido');
      return;
    }

    setIsLoading(true);
    setError('');
    setSearchPerformed(true);

    // Simulando uma chamada à API
    setTimeout(() => {
      const foundPayments = mockPayments[budgetId] || [];
      setPayments(foundPayments);
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudgetId(e.target.value);
    setSearchPerformed(false);
    setError('');
  };

  return {
    budgetId,
    isLoading,
    searchPerformed,
    payments,
    error,
    handleSearch,
    handleInputChange,
  };
};