import React, { ReactNode } from 'react'
import AuthProvider from './auth_provider';

interface LayoutProps {
    children: ReactNode;
  }
  
const AuthLayout:React.FC<LayoutProps> = ({ children }) => {

  return (
    <AuthProvider>{children}</AuthProvider>
  )
}

export default AuthLayout