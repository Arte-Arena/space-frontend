import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/validate-token`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            router.push('/auth/login');
          }
        } catch (error) {
          setIsAuthenticated(false);
          router.push('/auth/login');
        }
      } else {
        setIsAuthenticated(false);
        router.push('/auth/login');
      }
    };

    validateToken();
  }, []);

  return isAuthenticated;
};
