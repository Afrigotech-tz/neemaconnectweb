import { RBACContext, RBACContextType } from "@/contexts/RBACContext";
import { useContext } from "react";

export const useRBAC = (): RBACContextType => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};