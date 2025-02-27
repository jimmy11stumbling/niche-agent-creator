
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TemplatesGallery from "@/components/TemplatesGallery";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Search, Filter } from "lucide-react";

const TemplatesPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const handleTemplateSelect = (template: any) => {
    toast({
      title: "Template Selected",
      description: `Starting with the "${template.name}" template.`,
    });
    navigate("/create");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-2">Agent Templates</h1>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Browse our library of pre-configured templates to jump-start your agent creation
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search templates..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-48 flex items-center">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="programming">Programming</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="cooking">Cooking</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TemplatesGallery onSelectTemplate={handleTemplateSelect} />
          
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Don't see what you're looking for? Create a custom agent from scratch.
            </p>
            <Button asChild>
              <a href="/create">Create Custom Agent</a>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TemplatesPage;
