# 🍽️ MealPlan - Smart Meal Planning Application

A modern, full-stack web application for intelligent meal planning and recipe management. Built with React, TypeScript, and Firebase, featuring drag-and-drop meal planning, automated shopping list generation, and a comprehensive recipe database.

![MealPlan App](https://img.shields.io/badge/React-18.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-10.0-orange?logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?logo=tailwind-css)

## ✨ Key Features

### 🎯 **Intelligent Meal Planning**

- **Drag-and-Drop Interface**: Intuitive weekly meal planning with visual drag-and-drop functionality
- **Recipe Management**: Save, organize, and categorize recipes from around the world
- **Smart Suggestions**: AI-powered recipe recommendations based on user preferences
- **Weekly Calendar View**: Visual calendar interface for easy meal scheduling

### 🛒 **Automated Shopping Lists**

- **Smart Ingredient Aggregation**: Automatically combines ingredients from multiple recipes
- **Interactive Shopping List**: Drag to reorder, check off items, and exclude unwanted ingredients
- **Print-Ready Format**: Beautiful, compact shopping lists optimized for printing
- **Real-time Updates**: Shopping list updates automatically as you modify your meal plan

### 🔍 **Advanced Recipe Search**

- **Global Recipe Database**: Access thousands of recipes from various cuisines
- **Advanced Filtering**: Filter by cuisine, category, dietary restrictions, and more
- **Recipe Details**: Complete instructions, ingredients, nutritional info, and cooking videos
- **Personal Recipe Creation**: Add custom recipes with full ingredient and instruction support

### 🎨 **Modern User Experience**

- **Responsive Design**: Fully responsive interface that works on desktop, tablet, and mobile
- **Real-time Authentication**: Secure user authentication with Firebase Auth
- **Cloud Storage**: All data synced across devices using Firebase Firestore
- **Offline Support**: Core functionality works offline with local storage

## 🛠️ Technical Stack

### **Frontend**

- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for modern, responsive styling
- **React DnD** for smooth drag-and-drop interactions
- **Headless UI** for accessible, unstyled UI components
- **Lucide React** for beautiful, consistent icons

### **Backend & Database**

- **Firebase Firestore** for real-time NoSQL database
- **Firebase Authentication** for secure user management
- **Firebase Hosting** for production deployment
- **External Recipe API** integration for comprehensive recipe database

### **Development Tools**

- **TypeScript** for enhanced developer experience and type safety
- **ESLint & Prettier** for code quality and formatting
- **React Router** for client-side routing
- **React Toastify** for user notifications

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/mealplan.git
   cd mealplan
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Firebase**

   - Create a Firebase project
   - Enable Authentication and Firestore
   - Copy your Firebase config to `src/firebase.tsx`

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📱 Features in Detail

### **Smart Shopping List Generation**

```typescript
// Automatically aggregates ingredients from meal plans
function exportShoppingList(plan: Plan, recipes: Recipe[]): ShoppingListItem[] {
  const ingredientMap = new Map<string, string[]>();

  // Aggregate ingredients from all recipes in the plan
  for (const day of plan.days) {
    for (const meal of day.meals) {
      const recipe = recipeMap.get(meal.recipeId);
      if (!recipe) continue;

      for (const ing of recipe.ingredients) {
        const nameKey = ing.name.trim().toLowerCase();
        if (!ingredientMap.has(nameKey)) {
          ingredientMap.set(nameKey, []);
        }
        ingredientMap.get(nameKey)!.push(ing.amount.trim());
      }
    }
  }

  return buildShoppingList(ingredientMap);
}
```

### **Drag-and-Drop Meal Planning**

- **Visual Interface**: Intuitive grid-based weekly planner
- **Real-time Updates**: Instant feedback during drag operations
- **State Management**: Efficient state updates with React hooks
- **Accessibility**: Full keyboard navigation and screen reader support

### **Responsive Design System**

- **Mobile-First**: Optimized for all screen sizes
- **Component Library**: Reusable UI components with consistent styling
- **Dark Mode Ready**: Built with theming support
- **Performance Optimized**: Lazy loading and efficient rendering

## 🏗️ Architecture

### **Component Structure**

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   ├── Header.tsx      # Navigation and user controls
│   ├── RecipeCard.tsx  # Recipe display component
│   └── ShoppingListPopup.tsx # Interactive shopping list
├── pages/              # Main application pages
│   ├── MealPlan.tsx    # Weekly meal planning interface
│   ├── RecipeSearch.tsx # Recipe discovery and search
│   └── SavedRecipes.tsx # User's saved recipes
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── utils/              # Utility functions and helpers
```

### **Data Flow**

1. **User Authentication** → Firebase Auth
2. **Recipe Data** → External API + Firestore
3. **Meal Plans** → Firestore with real-time sync
4. **Shopping Lists** → Generated from meal plans
5. **User Preferences** → Local storage + Firestore

## 🎯 Key Technical Achievements

### **Performance Optimizations**

- **Lazy Loading**: Components and routes loaded on demand
- **Memoization**: React.memo and useMemo for expensive operations
- **Efficient Re-renders**: Optimized component structure
- **Bundle Optimization**: Tree shaking and code splitting

### **User Experience**

- **Smooth Animations**: CSS transitions and micro-interactions
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Skeleton screens and progress indicators
- **Accessibility**: WCAG 2.1 AA compliance

### **Code Quality**

- **Type Safety**: 100% TypeScript coverage
- **Component Testing**: Unit tests for critical components
- **Code Documentation**: Comprehensive JSDoc comments
- **Consistent Styling**: ESLint and Prettier configuration

## 🚀 Deployment

### **Production Build**

```bash
npm run build
```

### **Firebase Deployment**

```bash
npm run deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [https://mealplanapi.onrender.com](https://mealplanapi.onrender.com)
- **GitHub Repository**: [https://github.com/lucy-c1/mealplan](https://github.com/lucy-c1/mealplan)

## 📞 Contact

- **Email**: lucychen7728@gmail.com
- **LinkedIn**: [https://linkedin.com/in/lucy-c1](https://linkedin.com/in/lucy-c1)
- **GitHub**: [https://github.com/lucy-c1](https://github.com/lucy-c1)

---

⭐ **Star this repository if you found it helpful!**
