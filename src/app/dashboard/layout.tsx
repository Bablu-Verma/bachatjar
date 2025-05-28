import React, { ReactNode } from "react";
import { InternalProvider } from "./internal_provider";
import DashboardUI from "./_components/DashboardUI";

interface LayoutProps {
  children: ReactNode;
}
const InternalLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <InternalProvider>
      <DashboardUI children1={children} />
    </InternalProvider>
  );
};

export default InternalLayout;
