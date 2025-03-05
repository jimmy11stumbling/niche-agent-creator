
// Helper functions to generate domain-specific responses
export const generateFitnessResponse = (userMessage: string) => {
  const lowerCaseMessage = userMessage.toLowerCase();
  if (lowerCaseMessage.includes("workout") || lowerCaseMessage.includes("exercise")) {
    return "Based on your fitness goals, I recommend a balanced routine of cardio and strength training. For optimal results, aim for 3-4 strength sessions and 2-3 cardio sessions per week, with adequate rest days in between. Would you like me to suggest a specific workout plan?";
  } else if (lowerCaseMessage.includes("diet") || lowerCaseMessage.includes("nutrition")) {
    return "Nutrition is 80% of your fitness journey! Focus on whole foods, lean proteins, complex carbs, and healthy fats. For your specific goals, I'd recommend tracking your macronutrients and staying hydrated. Would you like a sample meal plan?";
  } else {
    return "From a fitness perspective, consistency is key. Make small, sustainable changes to your routine and diet that you can maintain long-term. Remember that rest and recovery are just as important as the workouts themselves. How can I help you get started?";
  }
};

export const generateFinanceResponse = (userMessage: string) => {
  const lowerCaseMessage = userMessage.toLowerCase();
  if (lowerCaseMessage.includes("invest") || lowerCaseMessage.includes("stock")) {
    return "When it comes to investing, diversification is crucial for managing risk. I'd recommend starting with a mix of index funds, bonds, and possibly some individual stocks if you're comfortable with research. Have you considered what your risk tolerance and time horizon are?";
  } else if (lowerCaseMessage.includes("budget") || lowerCaseMessage.includes("save")) {
    return "I'd recommend reviewing your spending and creating a detailed budget. The 50/30/20 rule is a good starting point: 50% for necessities, 30% for wants, and 20% for savings and debt repayment. Have you already identified areas where you might be able to reduce expenses?";
  } else {
    return "Financial health starts with having a clear understanding of your current situation. Let's start by examining your income, expenses, debts, and savings. From there, we can create a tailored plan to help you reach your financial goals. What specific aspect of your finances would you like to focus on?";
  }
};

export const generateCookingResponse = (userMessage: string) => {
  const lowerCaseMessage = userMessage.toLowerCase();
  if (lowerCaseMessage.includes("recipe") || lowerCaseMessage.includes("make")) {
    return "That recipe sounds delicious! For the best results, make sure to use fresh ingredients and proper technique. I recommend adding fresh herbs at the end for more vibrant flavor. Would you like alternative ingredient suggestions or tips on preparation methods?";
  } else if (lowerCaseMessage.includes("ingredient") || lowerCaseMessage.includes("substitute")) {
    return "You can substitute ingredients based on what you have available. For example, yogurt can replace sour cream, honey can replace sugar (use 3/4 the amount), and different vegetables with similar cooking times can be swapped. What specific ingredient are you looking to replace?";
  } else {
    return "Cooking is both an art and a science! For better results, try balancing flavors (sweet, salty, sour, bitter, umami) and textures in your dishes. Also, properly preheating your pan and not overcrowding it will help you achieve better browning and flavor development. What kind of dish are you planning to cook?";
  }
};

export const generateCodingResponse = (userMessage: string) => {
  const lowerCaseMessage = userMessage.toLowerCase();
  if (lowerCaseMessage.includes("error") || lowerCaseMessage.includes("bug")) {
    return "Based on the error description, this sounds like it could be a scope issue or possibly an asynchronous operation that's not completing as expected. I'd recommend adding some console.log statements to track the variable state throughout execution, and make sure any promises or callbacks are being handled correctly. Can you share the specific error message you're receiving?";
  } else if (lowerCaseMessage.includes("learn") || lowerCaseMessage.includes("start")) {
    return "For beginners in programming, I recommend starting with Python or JavaScript due to their readable syntax and widespread use. Focus on understanding core concepts like variables, data types, control flow, and functions before moving to more complex topics. Would you prefer interactive tutorials, video courses, or project-based learning?";
  } else {
    return "When designing your software architecture, consider the SOLID principles to create maintainable and scalable code. Break down the problem into smaller, reusable components, and think about how data will flow through your application. What specific functionality are you trying to implement?";
  }
};

export const generateGenericResponse = (userMessage: string, niche: string) => {
  return `I understand your question about ${userMessage.split(' ').slice(0, 3).join(' ')}... Based on my knowledge in ${niche || "this area"}, I'd suggest exploring different approaches to address this. The key factors to consider are timing, resources, and your specific goals. Would you like me to elaborate on any particular aspect?`;
};

// Fallback response generator when agent doesn't provide one
export const generateFallbackResponse = async (userMessage: string, niche: string = '') => {
  // Add artificial delay to simulate thinking
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const lowerCaseMessage = userMessage.toLowerCase();
  
  // Generate a response based on agent configuration
  if (niche.toLowerCase().includes("fitness")) {
    return generateFitnessResponse(userMessage);
  } else if (niche.toLowerCase().includes("finance")) {
    return generateFinanceResponse(userMessage);
  } else if (niche.toLowerCase().includes("cook") || niche.toLowerCase().includes("food")) {
    return generateCookingResponse(userMessage);
  } else if (niche.toLowerCase().includes("code") || niche.toLowerCase().includes("program")) {
    return generateCodingResponse(userMessage);
  } else {
    return generateGenericResponse(userMessage, niche);
  }
};
