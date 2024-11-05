import { useRouter } from 'next/navigation';

export const isAuthenticated = () => {
  const router = useRouter();
  const token = localStorage.getItem('accessToken');

  if (!token) {
    router.push('/login');
    return false;
  }

  return true;
};
