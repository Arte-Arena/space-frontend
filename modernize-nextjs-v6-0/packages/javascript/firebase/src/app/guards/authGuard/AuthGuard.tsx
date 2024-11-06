import { redirect, usePathname } from "next/navigation";
import useAuth from './UseAuth';
import { useEffect } from 'react';

const AuthGuard = ({ children }: any) => {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      redirect('/auth/auth1/login');
    }
  }, [isAuthenticated, pathname]);

  return children;
};

export default AuthGuard;
