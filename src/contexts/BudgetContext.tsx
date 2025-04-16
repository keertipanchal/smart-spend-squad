
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

// Types for our state
export type UserType = "student" | "working";
export type Category = {
  id: string;
  name: string;
  isEssential: boolean;
  icon?: string;
};

export type Expense = {
  id: string;
  amount: number;
  categoryId: string;
  date: string;
  note?: string;
};

export type BudgetState = {
  isOnboarded: boolean;
  currency: string;
  userType: UserType | null;
  balance: number;
  monthlyIncome: number;
  categories: Category[];
  expenses: Expense[];
  emergencyMode: boolean;
  motivationalQuotes: string[];
  currentQuote: string;
};

// Initial categories
const defaultCategories: Category[] = [
  { id: "food", name: "Food", isEssential: true },
  { id: "housing", name: "Housing", isEssential: true },
  { id: "utilities", name: "Utilities", isEssential: true },
  { id: "transportation", name: "Transportation", isEssential: true },
  { id: "healthcare", name: "Healthcare", isEssential: true },
  { id: "entertainment", name: "Entertainment", isEssential: false },
  { id: "shopping", name: "Shopping", isEssential: false },
  { id: "education", name: "Education", isEssential: true },
];

// Motivational quotes
const motivationalQuotes = [
  "Save a little today for a lot tomorrow.",
  "The best time to start saving was yesterday. The second best time is now.",
  "Small savings add up to big results.",
  "Financial freedom is a mental, emotional and educational process.",
  "Budget your money and live within your means.",
  "Don't save what's left after spending, spend what's left after saving.",
];

// Initial state
const initialState: BudgetState = {
  isOnboarded: false,
  currency: "$",
  userType: null,
  balance: 0,
  monthlyIncome: 0,
  categories: defaultCategories,
  expenses: [],
  emergencyMode: false,
  motivationalQuotes,
  currentQuote: motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)],
};

// Action types
type BudgetAction =
  | { type: "COMPLETE_ONBOARDING"; payload: Omit<BudgetState, "isOnboarded" | "expenses" | "emergencyMode" | "motivationalQuotes" | "currentQuote"> }
  | { type: "ADD_EXPENSE"; payload: Omit<Expense, "id"> }
  | { type: "DELETE_EXPENSE"; payload: string }
  | { type: "TOGGLE_EMERGENCY_MODE" }
  | { type: "ADD_CATEGORY"; payload: Omit<Category, "id"> }
  | { type: "DELETE_CATEGORY"; payload: string }
  | { type: "UPDATE_BALANCE"; payload: number }
  | { type: "UPDATE_MONTHLY_INCOME"; payload: number }
  | { type: "REFRESH_QUOTE" };

// Reducer function
const budgetReducer = (state: BudgetState, action: BudgetAction): BudgetState => {
  switch (action.type) {
    case "COMPLETE_ONBOARDING":
      return {
        ...state,
        ...action.payload,
        isOnboarded: true,
      };
    case "ADD_EXPENSE":
      const newExpense = {
        ...action.payload,
        id: Date.now().toString(),
      };
      return {
        ...state,
        balance: state.balance - action.payload.amount,
        expenses: [newExpense, ...state.expenses],
      };
    case "DELETE_EXPENSE":
      const expenseToDelete = state.expenses.find(e => e.id === action.payload);
      if (!expenseToDelete) return state;
      
      return {
        ...state,
        balance: state.balance + expenseToDelete.amount,
        expenses: state.expenses.filter(expense => expense.id !== action.payload),
      };
    case "TOGGLE_EMERGENCY_MODE":
      return {
        ...state,
        emergencyMode: !state.emergencyMode,
      };
    case "ADD_CATEGORY":
      return {
        ...state,
        categories: [
          ...state.categories,
          { ...action.payload, id: Date.now().toString() },
        ],
      };
    case "DELETE_CATEGORY":
      // Only delete if no expenses are using this category
      if (state.expenses.some(expense => expense.categoryId === action.payload)) {
        return state;
      }
      return {
        ...state,
        categories: state.categories.filter(
          category => category.id !== action.payload
        ),
      };
    case "UPDATE_BALANCE":
      return {
        ...state,
        balance: action.payload,
      };
    case "UPDATE_MONTHLY_INCOME":
      return {
        ...state,
        monthlyIncome: action.payload,
      };
    case "REFRESH_QUOTE":
      let newQuote = state.currentQuote;
      // Ensure we get a different quote
      while (newQuote === state.currentQuote) {
        newQuote = state.motivationalQuotes[
          Math.floor(Math.random() * state.motivationalQuotes.length)
        ];
      }
      return {
        ...state,
        currentQuote: newQuote,
      };
    default:
      return state;
  }
};

// Create context
type BudgetContextType = {
  state: BudgetState;
  completeOnboarding: (data: Omit<BudgetState, "isOnboarded" | "expenses" | "emergencyMode" | "motivationalQuotes" | "currentQuote">) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;
  toggleEmergencyMode: () => void;
  addCategory: (category: Omit<Category, "id">) => void;
  deleteCategory: (id: string) => void;
  updateBalance: (balance: number) => void;
  updateMonthlyIncome: (income: number) => void;
  refreshQuote: () => void;
  getCategoryById: (id: string) => Category | undefined;
  getTotalSpent: () => number;
  getMonthlySpent: () => number;
  getDailyBudget: () => number;
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

// Provider component
export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage if exists
  const savedState = localStorage.getItem("budgetState");
  const [state, dispatch] = useReducer(
    budgetReducer,
    savedState ? JSON.parse(savedState) : initialState
  );

  const { toast } = useToast();

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("budgetState", JSON.stringify(state));
  }, [state]);

  // Helper functions
  const getCategoryById = (id: string): Category | undefined => {
    return state.categories.find(category => category.id === id);
  };

  const getTotalSpent = (): number => {
    return state.expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getMonthlySpent = (): number => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return state.expenses
      .filter(expense => new Date(expense.date) >= firstDayOfMonth)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getDailyBudget = (): number => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const remainingDays = daysInMonth - now.getDate() + 1;
    
    // Calculate spent so far this month
    const monthlySpent = getMonthlySpent();
    
    // Calculate remaining budget
    const remainingBudget = state.monthlyIncome - monthlySpent;
    
    // Daily budget is remaining budget divided by remaining days
    return remainingBudget / remainingDays;
  };

  // Actions
  const completeOnboarding = (data: Omit<BudgetState, "isOnboarded" | "expenses" | "emergencyMode" | "motivationalQuotes" | "currentQuote">) => {
    dispatch({ type: "COMPLETE_ONBOARDING", payload: data });
  };

  const addExpense = (expense: Omit<Expense, "id">) => {
    // Check if user is in emergency mode and trying to add non-essential expense
    const category = getCategoryById(expense.categoryId);
    
    if (state.emergencyMode && category && !category.isEssential) {
      toast({
        title: "Emergency Mode Active",
        description: `${category.name} is a non-essential expense. Are you sure you want to proceed?`,
        variant: "destructive",
      });
    }
    
    dispatch({ type: "ADD_EXPENSE", payload: expense });
    
    // Show low balance warning if balance drops below 20% of monthly income
    if (state.balance - expense.amount < state.monthlyIncome * 0.2) {
      toast({
        title: "Low Balance Warning",
        description: "Your balance is getting low. Consider enabling emergency mode.",
        variant: "destructive",
      });
    }
  };

  const deleteExpense = (id: string) => {
    dispatch({ type: "DELETE_EXPENSE", payload: id });
  };

  const toggleEmergencyMode = () => {
    dispatch({ type: "TOGGLE_EMERGENCY_MODE" });
    
    toast({
      title: state.emergencyMode ? "Emergency Mode Deactivated" : "Emergency Mode Activated",
      description: state.emergencyMode 
        ? "You can now spend on all categories." 
        : "Only essential expenses allowed. Stay strong!",
      variant: state.emergencyMode ? "default" : "destructive",
    });
  };

  const addCategory = (category: Omit<Category, "id">) => {
    dispatch({ type: "ADD_CATEGORY", payload: category });
  };

  const deleteCategory = (id: string) => {
    // Check if category is in use
    const inUse = state.expenses.some(expense => expense.categoryId === id);
    
    if (inUse) {
      toast({
        title: "Cannot Delete Category",
        description: "This category is being used by some expenses.",
        variant: "destructive",
      });
      return;
    }
    
    dispatch({ type: "DELETE_CATEGORY", payload: id });
  };

  const updateBalance = (balance: number) => {
    dispatch({ type: "UPDATE_BALANCE", payload: balance });
  };

  const updateMonthlyIncome = (income: number) => {
    dispatch({ type: "UPDATE_MONTHLY_INCOME", payload: income });
  };

  const refreshQuote = () => {
    dispatch({ type: "REFRESH_QUOTE" });
  };

  return (
    <BudgetContext.Provider
      value={{
        state,
        completeOnboarding,
        addExpense,
        deleteExpense,
        toggleEmergencyMode,
        addCategory,
        deleteCategory,
        updateBalance,
        updateMonthlyIncome,
        refreshQuote,
        getCategoryById,
        getTotalSpent,
        getMonthlySpent,
        getDailyBudget,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

// Hook for using the budget context
export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
};
