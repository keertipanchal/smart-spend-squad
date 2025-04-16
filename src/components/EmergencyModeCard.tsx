
import React from "react";
import { useBudget } from "@/contexts/BudgetContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Shield, TrendingDown } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const EmergencyModeCard: React.FC = () => {
  const { state, toggleEmergencyMode } = useBudget();
  
  const handleToggle = () => {
    toggleEmergencyMode();
  };
  
  return (
    <Card className={`p-4 ${state.emergencyMode ? 'bg-red-50 border-red-200' : ''}`}>
      <div className="flex items-start gap-3">
        <div className={`rounded-full p-2 ${state.emergencyMode ? 'bg-destructive/20' : 'bg-secondary'}`}>
          {state.emergencyMode ? (
            <AlertTriangle className="h-6 w-6 text-destructive" />
          ) : (
            <Shield className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className={`font-semibold mb-1 ${state.emergencyMode ? 'text-destructive' : ''}`}>
            {state.emergencyMode ? 'Emergency Mode Active' : 'Budget Protection'}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-3">
            {state.emergencyMode 
              ? 'Only essential spending allowed. Save more by avoiding unnecessary expenses.'
              : 'Enable emergency mode to limit spending to essential categories only.'}
          </p>
          
          <Button
            variant={state.emergencyMode ? "destructive" : "outline"}
            size="sm"
            className="w-full"
            onClick={handleToggle}
          >
            {state.emergencyMode ? (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Disable Emergency Mode
              </>
            ) : (
              <>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Enable Emergency Mode
              </>
            )}
          </Button>
        </div>
      </div>
      
      {state.emergencyMode && (
        <div className="mt-3 pt-3 border-t border-destructive/20">
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingDown className="h-3 w-3 mr-1 text-destructive" />
            Focus on essential categories like food, housing, and utilities.
          </div>
        </div>
      )}
    </Card>
  );
};

export default EmergencyModeCard;
