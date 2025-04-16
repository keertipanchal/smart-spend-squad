
import React from "react";
import { useBudget } from "@/contexts/BudgetContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";

const COLORS = ["#7E69AB", "#4CAF50", "#F44336", "#FFC107", "#2196F3", "#FF9800", "#9C27B0", "#795548"];

const SpendingChart: React.FC = () => {
  const { state, getMonthlySpent } = useBudget();
  
  // Calculate monthly spending by category
  const monthlySpent = getMonthlySpent();
  const now = new Date();
  
  // Process data for chart
  const chartData = state.categories
    .map(category => {
      const categorySpent = state.expenses
        .filter(e => {
          const expenseDate = new Date(e.date);
          return e.categoryId === category.id && 
                expenseDate.getMonth() === now.getMonth() &&
                expenseDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, e) => sum + e.amount, 0);
      
      return {
        name: category.name,
        value: categorySpent,
        isEssential: category.isEssential
      };
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);
  
  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">No spending data to display</p>
        <p className="text-xs text-muted-foreground">Add expenses to see your spending breakdown</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                stroke={entry.isEssential ? "#4CAF50" : "none"}
                strokeWidth={entry.isEssential ? 2 : 0}
              />
            ))}
          </Pie>
          <Legend />
          <Tooltip 
            formatter={(value) => [`${state.currency}${Number(value).toFixed(2)}`, 'Amount']}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-2 text-center">
        <div className="flex justify-center items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-budget-green rounded-full"></div>
            <span className="text-xs">Essential</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-budget-red rounded-full"></div>
            <span className="text-xs">Non-essential</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingChart;
