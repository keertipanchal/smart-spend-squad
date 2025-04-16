
import React from "react";
import { useBudget } from "@/contexts/BudgetContext";
import Onboarding from "@/components/Onboarding";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const { state } = useBudget();

  return (
    <div className="min-h-screen bg-background">
      {state.isOnboarded ? <Dashboard /> : <Onboarding />}
    </div>
  );
};

export default Index;
