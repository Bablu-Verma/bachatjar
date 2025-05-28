import React, { ReactNode } from 'react'
import UserProvider from './user_provider';


interface LayoutProps {
    children: ReactNode;
  }
  
const UserLayout:React.FC<LayoutProps> = ({ children }) => {

  return (
    <UserProvider>{children}</UserProvider>
  )
}

export default UserLayout