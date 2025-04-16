
import React, { useState } from "react";
import { useBudget } from "@/contexts/BudgetContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Shield, TrendingDown, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const EmergencyModeCard: React.FC = () => {
  const { 
    state, 
    toggleEmergencyMode, 
    setEmergencyBudget,
    getMonthlySpent,
    getRemainingEmergencyBudget
  } = useBudget();
  
  const [showBudgetSettings, setShowBudgetSettings] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState(
    state.emergencyBudget ?? Math.round(state.monthlyIncome * 0.7)
  );
  
  const monthlySpent = getMonthlySpent();
  const remainingBudget = getRemainingEmergencyBudget();
  const budgetPercentage = state.monthlyIncome > 0 
    ? Math.round((budgetAmount / state.monthlyIncome) * 100) 
    : 0;
  
  const handleToggle = () => {
    toggleEmergencyMode(budgetAmount);
    setShowBudgetSettings(false);
  };
  
  const handleBudgetChange = (value: number[]) => {
    setBudgetAmount(value[0]);
  };
  
  const handleBudgetSave = () => {
    setEmergencyBudget(budgetAmount);
    setShowBudgetSettings(false);
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
          
          <p className="text-sm text-muted-foreground mb-2">
            {state.emergencyMode 
              ? 'Only essential spending allowed. Save more by avoiding unnecessary expenses.'
              : 'Enable emergency mode to limit spending to essential categories only.'}
          </p>
          
          {state.emergencyMode && state.emergencyBudget !== null && (
            <div className="mb-3 p-2 bg-destructive/10 rounded-md">
              <div className="flex justify-between text-sm">
                <span>Emergency Budget:</span>
                <span className="font-medium">{state.currency}{state.emergencyBudget}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Spent This Month:</span>
                <span className="font-medium">{state.currency}{monthlySpent.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Remaining:</span>
                <span className={remainingBudget && remainingBudget < state.emergencyBudget * 0.2 ? 'text-destructive' : ''}>
                  {state.currency}{remainingBudget?.toFixed(2)}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              variant={state.emergencyMode ? "destructive" : "outline"}
              size="sm"
              className="flex-1"
              onClick={handleToggle}
            >
              {state.emergencyMode ? (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Disable
                </>
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Enable
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBudgetSettings(!showBudgetSettings)}
            >
              <DollarSign className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {showBudgetSettings && (
        <div className="mt-3 pt-3 border-t">
          <h4 className="text-sm font-medium mb-2">Emergency Budget Limit</h4>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Slider 
                defaultValue={[budgetAmount]} 
                max={state.monthlyIncome} 
                step={10}
                onValueChange={handleBudgetChange}
              />
              <div className="w-20 flex-shrink-0">
                <Input
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(Number(e.target.value))}
                  className="h-8"
                />
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{budgetPercentage}% of monthly income</span>
              <span>{state.currency}{budgetAmount} max spending</span>
            </div>
            
            <Button 
              onClick={handleBudgetSave}
              size="sm" 
              className="w-full"
            >
              Set Budget Limit
            </Button>
          </div>
        </div>
      )}
      
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
