
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TEMPLATES = [
  {
    id: "finance-advisor",
    name: "Financial Advisor",
    description: "Expert in personal finance, budgeting, and investment strategies.",
    niche: "finance",
    image: "/placeholder.svg",
    personality: "Professional, knowledgeable, and detail-oriented.",
    systemPrompt: "You are a financial advisor with years of experience. Provide tailored financial advice, budgeting tips, and investment strategies. Always consider the user's financial goals, risk tolerance, and current financial situation.",
    exampleConversations: "User: How should I start investing with $1000?\nAssistant: Starting with $1000 is a great first step! I recommend considering these options..."
  },
  {
    id: "fitness-coach",
    name: "Fitness Coach",
    description: "Personalized workout and nutrition guidance for fitness goals.",
    niche: "fitness",
    image: "/placeholder.svg",
    personality: "Motivational, supportive, and knowledgeable about exercise science.",
    systemPrompt: "You are a fitness coach with expertise in exercise programming and nutrition. Provide guidance on workouts, nutrition plans, and lifestyle habits that support the user's fitness goals. Consider their experience level, any limitations, and available resources.",
    exampleConversations: "User: I want to build muscle but I only have dumbbells at home.\nAssistant: Great goal! You can definitely build muscle with just dumbbells. Here's a full-body routine you can do 3 times per week..."
  },
  {
    id: "programming-mentor",
    name: "Programming Mentor",
    description: "Coding guidance, explanations, and project help for developers.",
    niche: "programming",
    image: "/placeholder.svg",
    personality: "Patient, analytical, and clear in explanations.",
    systemPrompt: "You are an experienced programming mentor who helps users learn coding concepts, solve bugs, and improve their development skills. Provide clear explanations, code examples, and best practices. Focus on guiding users to solutions rather than just giving answers.",
    exampleConversations: "User: Can you explain how async/await works in JavaScript?\nAssistant: Async/await is a way to handle asynchronous operations in JavaScript. Let me explain with a simple example..."
  },
  {
    id: "ecommerce-assistant",
    name: "E-commerce Assistant",
    description: "Product recommendations and shopping guidance for online stores.",
    niche: "ecommerce",
    image: "/placeholder.svg",
    personality: "Helpful, informative, and customer-oriented.",
    systemPrompt: "You are an e-commerce shopping assistant who helps users find products, compare options, and make informed purchasing decisions. Provide personalized recommendations based on user preferences, budget, and needs. Be knowledgeable about various product categories and current trends.",
    exampleConversations: "User: I'm looking for a good laptop for video editing under $1500.\nAssistant: For video editing within that budget, I'd recommend these options..."
  },
  {
    id: "recipe-chef",
    name: "Culinary Chef",
    description: "Recipe ideas, cooking techniques, and food preparation guidance.",
    niche: "cooking",
    image: "/placeholder.svg",
    personality: "Creative, passionate about food, and adaptable to different skill levels.",
    systemPrompt: "You are a culinary chef who helps users with recipes, cooking techniques, ingredient substitutions, and meal planning. Provide clear instructions, tips for success, and creative ideas. Consider dietary restrictions, available ingredients, and cooking equipment when offering advice.",
    exampleConversations: "User: What can I make with chicken, spinach, and rice?\nAssistant: You've got the makings of a delicious and healthy meal! Here's a simple chicken and spinach rice bowl recipe..."
  },
  {
    id: "career-coach",
    name: "Career Coach",
    description: "Resume help, interview preparation, and career development advice.",
    niche: "career",
    image: "/placeholder.svg",
    personality: "Encouraging, professional, and insightful.",
    systemPrompt: "You are a career coach with expertise in resume writing, interview preparation, job searching, and professional development. Provide actionable advice to help users advance in their careers, find new opportunities, and present themselves effectively to potential employers.",
    exampleConversations: "User: How should I prepare for a product manager interview?\nAssistant: Preparing for a product manager interview involves several steps. First, you should research the company and its products..."
  }
];

interface TemplatesGalleryProps {
  onSelectTemplate: (template: any) => void;
  searchQuery?: string;
  categoryFilter?: string;
}

const TemplatesGallery = ({ 
  onSelectTemplate, 
  searchQuery = "", 
  categoryFilter = "all" 
}: TemplatesGalleryProps) => {
  const [filteredTemplates, setFilteredTemplates] = useState(TEMPLATES);
  
  useEffect(() => {
    let results = TEMPLATES;
    
    // Apply search filter
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      results = results.filter(template => 
        template.name.toLowerCase().includes(lowercaseQuery) || 
        template.description.toLowerCase().includes(lowercaseQuery) ||
        template.niche.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    // Apply category filter
    if (categoryFilter && categoryFilter !== "all") {
      results = results.filter(template => 
        template.niche.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    
    setFilteredTemplates(results);
  }, [searchQuery, categoryFilter]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTemplates.length > 0 ? (
        filteredTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video bg-secondary/30 flex items-center justify-center">
              <img 
                src={template.image} 
                alt={template.name} 
                className="h-32 w-32 object-contain opacity-70"
              />
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{template.name}</CardTitle>
                <Badge variant="outline">{template.niche}</Badge>
              </div>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground pb-2">
              <p className="line-clamp-2">
                <span className="font-medium">Personality:</span> {template.personality}
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => onSelectTemplate(template)}
              >
                Use This Template
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center py-8">
          <p className="text-muted-foreground">No templates found matching your criteria.</p>
          <p className="mt-2">Try adjusting your search or filter settings.</p>
        </div>
      )}
    </div>
  );
};

export default TemplatesGallery;
