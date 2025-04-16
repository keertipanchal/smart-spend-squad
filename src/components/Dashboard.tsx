
import React, { useState } from "react";
import { useBudget } from "@/contexts/BudgetContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  PlusCircle, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  RefreshCw,
  Wallet,
  PiggyBank,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import AddExpense from "./AddExpense";
import ExpensesList from "./ExpensesList";

const Dashboard: React.FC = () => {
  const { 
    state, 
    toggleEmergencyMode, 
    refreshQuote,
    getTotalSpent,
    getMonthlySpent,
    getDailyBudget
  } = useBudget();
  
  const [showAddExpense, setShowAddExpense] = useState(false);
  
  const totalSpent = getTotalSpent();
  const monthlySpent = getMonthlySpent();
  const dailyBudget = getDailyBudget();
  
  // Calculate percentages for progress bars
  const monthlySpentPercentage = Math.min(
    100,
    (monthlySpent / state.monthlyIncome) * 100 || 0
  );
  
  const balancePercentage = Math.min(
    100,
    (state.balance / state.monthlyIncome) * 100 || 0
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-budget-purple">Your Budget Dashboard</h1>
          <p className="text-muted-foreground">
            {format(new Date(), "EEEE, MMMM do, yyyy")}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button
            variant={state.emergencyMode ? "default" : "outline"}
            className={state.emergencyMode ? "bg-destructive text-white" : ""}
            onClick={toggleEmergencyMode}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            {state.emergencyMode ? "Emergency Mode ON" : "Enable Emergency Mode"}
          </Button>
          
          <Button 
            onClick={() => setShowAddExpense(true)}
            className="bg-budget-purple hover:bg-budget-purple-dark"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>
      
      {/* Quote card */}
      <Card className="mb-6">
        <CardContent className="p-4 flex justify-between items-center">
          <p className="italic text-budget-purple">"{state.currentQuote}"</p>
          <Button variant="ghost" size="sm" onClick={refreshQuote}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
      
      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Wallet className="mr-2 h-4 w-4 text-budget-purple" />
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className="currency-symbol">{state.currency}</span>
              {state.balance.toFixed(2)}
            </div>
            <Progress value={balancePercentage} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingDown className="mr-2 h-4 w-4 text-budget-red" />
              Monthly Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className="currency-symbol">{state.currency}</span>
              {monthlySpent.toFixed(2)}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                of {state.currency}{state.monthlyIncome.toFixed(2)}
              </span>
            </div>
            <Progress value={monthlySpentPercentage} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-budget-green" />
              Daily Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className="currency-symbol">{state.currency}</span>
              {dailyBudget > 0 ? dailyBudget.toFixed(2) : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Recommended daily spending
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs section */}
      <Tabs defaultValue="expenses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="expenses">Recent Expenses</TabsTrigger>
          <TabsTrigger value="summary">Monthly Summary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="expenses" className="space-y-4">
          <ExpensesList />
        </TabsContent>
        
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Income:</span>
                  <span className="font-medium">
                    <span className="currency-symbol">{state.currency}</span>
                    {state.monthlyIncome.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Spent:</span>
                  <span className="font-medium">
                    <span className="currency-symbol">{state.currency}</span>
                    {monthlySpent.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remaining:</span>
                  <span className="font-medium">
                    <span className="currency-symbol">{state.currency}</span>
                    {(state.monthlyIncome - monthlySpent).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Spending by Category</h4>
                <div className="space-y-2">
                  {state.categories.map(category => {
                    const categorySpent = state.expenses
                      .filter(e => {
                        const expenseDate = new Date(e.date);
                        const now = new Date();
                        return e.categoryId === category.id && 
                               expenseDate.getMonth() === now.getMonth() &&
                               expenseDate.getFullYear() === now.getFullYear();
                      })
                      .reduce((sum, e) => sum + e.amount, 0);
                    
                    if (categorySpent === 0) return null;
                    
                    const percentage = (categorySpent / monthlySpent) * 100;
                    
                    return (
                      <div key={category.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{category.name}</span>
                          <span>
                            <span className="currency-symbol">{state.currency}</span>
                            {categorySpent.toFixed(2)} 
                            <span className="text-xs text-muted-foreground ml-1">
                              ({percentage.toFixed(1)}%)
                            </span>
                          </span>
                        </div>
                        <Progress value={percentage} className="h-1" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Expense Dialog */}
      <AddExpense open={showAddExpense} onOpenChange={setShowAddExpense} />
    </div>
  );
};

export default Dashboard;
