
import React, { useState } from "react";
import { useBudget, UserType, Category } from "@/contexts/BudgetContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Trash2 } from "lucide-react";

const currencies = [
  { symbol: "₹", name: "Indian Rupee" },
  { symbol: "$", name: "US Dollar" },
  { symbol: "€", name: "Euro" },
  { symbol: "£", name: "British Pound" },
  { symbol: "¥", name: "Japanese Yen" },
  { symbol: "₿", name: "Bitcoin" },
];

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

const Onboarding: React.FC = () => {
  const { completeOnboarding } = useBudget();
  const [step, setStep] = useState<string>("currency");
  
  const [currency, setCurrency] = useState<string>("$");
  const [userType, setUserType] = useState<UserType>("student");
  const [balance, setBalance] = useState<string>("0");
  const [monthlyIncome, setMonthlyIncome] = useState<string>("0");
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [newCategory, setNewCategory] = useState<string>("");
  const [isEssential, setIsEssential] = useState<boolean>(false);

  const addCustomCategory = () => {
    if (newCategory.trim()) {
      setCategories([
        ...categories,
        {
          id: Date.now().toString(),
          name: newCategory.trim(),
          isEssential,
        },
      ]);
      setNewCategory("");
      setIsEssential(false);
    }
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  const handleFinish = () => {
    completeOnboarding({
      currency,
      userType,
      balance: parseFloat(balance) || 0,
      monthlyIncome: parseFloat(monthlyIncome) || 0,
      categories,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md mx-auto animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-budget-purple">
            Welcome to Smart Spend Squad
          </CardTitle>
          <CardDescription className="text-center">
            Let's get your budget set up in a few simple steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={step} onValueChange={setStep}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="currency">Currency</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="money">Money</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>

            <TabsContent value="currency" className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Select your preferred currency</Label>
                <Select
                  value={currency}
                  onValueChange={setCurrency}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c.symbol} value={c.symbol}>
                        {c.symbol} - {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full mt-4 bg-budget-purple hover:bg-budget-purple-dark" 
                onClick={() => setStep("profile")}
              >
                Next
              </Button>
            </TabsContent>

            <TabsContent value="profile" className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label>I am a...</Label>
                <RadioGroup 
                  value={userType} 
                  onValueChange={(value) => setUserType(value as UserType)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="working" id="working" />
                    <Label htmlFor="working">Working Professional</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setStep("currency")}
                >
                  Back
                </Button>
                <Button 
                  className="bg-budget-purple hover:bg-budget-purple-dark" 
                  onClick={() => setStep("money")}
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="money" className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="balance">Initial Balance</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 currency-symbol">
                    {currency}
                  </span>
                  <Input
                    id="balance"
                    type="number"
                    placeholder="0.00"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="income">
                  {userType === "student" ? "Monthly Pocket Money" : "Monthly Salary"}
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 currency-symbol">
                    {currency}
                  </span>
                  <Input
                    id="income"
                    type="number"
                    placeholder="0.00"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setStep("profile")}
                >
                  Back
                </Button>
                <Button 
                  className="bg-budget-purple hover:bg-budget-purple-dark" 
                  onClick={() => setStep("categories")}
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label>Spending Categories</Label>
                <p className="text-sm text-muted-foreground">
                  Add or remove categories to customize your budget. Essential categories
                  are necessary expenses that remain active in Emergency Mode.
                </p>
                
                <div className="mt-4 space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`essential-${category.id}`}
                          checked={category.isEssential}
                          onCheckedChange={(checked) => {
                            setCategories(categories.map(c => 
                              c.id === category.id ? {...c, isEssential: !!checked} : c
                            ));
                          }}
                        />
                        <Label htmlFor={`essential-${category.id}`} className="text-sm font-medium">
                          {category.name}
                          {category.isEssential && (
                            <span className="text-xs ml-2 text-budget-green">Essential</span>
                          )}
                        </Label>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4 text-budget-red" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-end space-x-2 mt-4">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="new-category">Add Custom Category</Label>
                    <Input
                      id="new-category"
                      placeholder="New category name"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                  </div>
                  <div className="flex-0 pb-0.5">
                    <Button
                      size="icon"
                      type="button"
                      onClick={addCustomCategory}
                      disabled={!newCategory.trim()}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox 
                    id="new-essential"
                    checked={isEssential}
                    onCheckedChange={(checked) => setIsEssential(!!checked)}
                  />
                  <Label htmlFor="new-essential" className="text-sm">
                    Mark as essential expense
                  </Label>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setStep("money")}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleFinish}
                  className="bg-budget-purple hover:bg-budget-purple-dark"
                >
                  Finish Setup
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-xs text-muted-foreground text-center">
            Your data is stored locally on your device and is not shared with anyone.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Onboarding;
