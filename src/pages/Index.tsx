
import React from "react";
import { useBudget } from "@/contexts/BudgetContext";
import Onboarding from "@/components/Onboarding";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const { state } = useBudget();

  return (
    <div 
      className="min-h-screen bg-background"
      style={{
        backgroundImage: state.isOnboarded 
          ? "url('https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=10')" 
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="min-h-screen backdrop-blur-sm bg-background/95">
        {state.isOnboarded ? <Dashboard /> : <Onboarding />}
      </div>
    </div>
  );
};

export default Index;
