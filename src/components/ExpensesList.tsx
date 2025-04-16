
import React from "react";
import { useBudget } from "@/contexts/BudgetContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { Trash2 } from "lucide-react";

const ExpensesList: React.FC = () => {
  const { state, deleteExpense, getCategoryById } = useBudget();
  
  // Sort expenses by date (newest first)
  const sortedExpenses = [...state.expenses].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  if (sortedExpenses.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No expenses recorded yet.</p>
          <p className="text-sm">
            Track your spending by adding your first expense.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Note</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedExpenses.map((expense) => {
              const category = getCategoryById(expense.categoryId);
              return (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">
                    {format(parseISO(expense.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {category?.name}
                      {category?.isEssential && (
                        <Badge variant="outline" className="ml-2 text-xs bg-budget-green/10 text-budget-green border-budget-green/20">
                          Essential
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {expense.note || "-"}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    <span className="currency-symbol">{state.currency}</span>
                    {expense.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteExpense(expense.id)}
                    >
                      <Trash2 className="h-4 w-4 text-budget-red" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ExpensesList;
