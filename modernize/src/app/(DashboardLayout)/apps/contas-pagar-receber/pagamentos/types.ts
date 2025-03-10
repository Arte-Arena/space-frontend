export interface Payment {
  id: string;
  platform: 'Mercado Pago' | 'Banco Inter';
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data para desenvolvimento
export const mockPayments: Record<string, Payment[]> = {
  '12345': [
    {
      id: 'PAY001',
      platform: 'Mercado Pago',
      amount: 1500.00,
      createdAt: new Date('2024-02-25T10:00:00'),
      updatedAt: new Date('2024-02-25T10:00:00'),
    },
    {
      id: 'PAY002',
      platform: 'Banco Inter',
      amount: 750.50,
      createdAt: new Date('2024-02-24T15:30:00'),
      updatedAt: new Date('2024-02-24T16:00:00'),
    },
  ],
  '67890': [
    {
      id: 'PAY003',
      platform: 'Mercado Pago',
      amount: 2750.00,
      createdAt: new Date('2024-02-23T09:15:00'),
      updatedAt: new Date('2024-02-23T09:15:00'),
    },
  ],
};