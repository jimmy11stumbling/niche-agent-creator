
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  FileQuestion, 
  Home, 
  ArrowLeft, 
  Search, 
  RefreshCw, 
  AlertTriangle,
  HelpCircle,
  Mail,
  ExternalLink
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const COMMON_ROUTES = [
  { path: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
  { path: "/about", label: "About Us", icon: <HelpCircle className="h-4 w-4" /> },
  { path: "/docs", label: "Documentation", icon: <FileQuestion className="h-4 w-4" /> },
  { path: "/create-agent", label: "Create Agent", icon: <ExternalLink className="h-4 w-4" /> },
  { path: "/workflows", label: "Workflows", icon: <RefreshCw className="h-4 w-4" /> },
  { path: "/templates", label: "Templates", icon: <FileQuestion className="h-4 w-4" /> }
];

const HELP_RESOURCES = [
  { title: "Documentation", description: "Browse our detailed docs", link: "/docs", icon: <FileQuestion className="h-12 w-12 text-primary" /> },
  { title: "Tutorials", description: "Step-by-step guides", link: "/tutorials", icon: <HelpCircle className="h-12 w-12 text-primary" /> },
  { title: "Support", description: "Contact our support team", link: "/contact", icon: <Mail className="h-12 w-12 text-primary" /> }
];

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Log and capture the error details
    const errorMessage = `404 Error: User attempted to access non-existent route: ${location.pathname}`;
    console.error(errorMessage);
    setErrorDetails(errorMessage);
    
    // Could send this to an error logging service in production
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real implementation, this would redirect to a search results page
      toast({
        title: "Searching...",
        description: `Looking for "${searchQuery}" in our documentation`,
      });
      navigate(`/docs?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const getPathSuggestion = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('work') || path.includes('flow')) {
      return '/workflows';
    } else if (path.includes('agent') || path.includes('ai')) {
      return '/create-agent';
    } else if (path.includes('doc') || path.includes('help')) {
      return '/docs';
    } else if (path.includes('temp') || path.includes('example')) {
      return '/templates';
    }
    return null;
  };

  const pathSuggestion = getPathSuggestion();

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
              <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
              <p className="text-xl text-muted-foreground mb-2">Page Not Found</p>
              <p className="text-muted-foreground">
                Oops! The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            <Tabs defaultValue="search" className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="search">Search</TabsTrigger>
                <TabsTrigger value="popular">Popular Pages</TabsTrigger>
                <TabsTrigger value="help">Help Resources</TabsTrigger>
              </TabsList>
              
              <TabsContent value="search">
                <Card className="card-gradient shadow-lg">
                  <CardHeader>
                    <CardTitle>Looking for something?</CardTitle>
                    <CardDescription>
                      Try searching our site to find what you're looking for.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                      <Input
                        type="text"
                        placeholder="Search for pages, docs, or features..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit">
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="popular">
                <Card className="card-gradient shadow-lg">
                  <CardHeader>
                    <CardTitle>Popular Pages</CardTitle>
                    <CardDescription>
                      Check out some of our most visited pages.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {COMMON_ROUTES.map((route) => (
                        <Button
                          key={route.path}
                          variant="outline"
                          className="justify-start text-left"
                          asChild
                        >
                          <Link to={route.path} className="flex items-center gap-2">
                            {route.icon}
                            {route.label}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="help">
                <Card className="card-gradient shadow-lg">
                  <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                    <CardDescription>
                      Here are some resources that might help you.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {HELP_RESOURCES.map((resource, index) => (
                        <Link 
                          key={index} 
                          to={resource.link}
                          className="block p-4 border rounded-lg hover:bg-primary/5 transition-colors text-center"
                        >
                          <div className="flex justify-center mb-2">
                            {resource.icon}
                          </div>
                          <h3 className="font-medium mb-1">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {pathSuggestion && (
              <Alert className="mb-6 bg-primary/5 border-primary/20">
                <HelpCircle className="h-4 w-4" />
                <AlertTitle>Did you mean to visit:</AlertTitle>
                <AlertDescription>
                  <Button variant="link" asChild className="p-0">
                    <Link to={pathSuggestion} className="font-medium">
                      {pathSuggestion}
                    </Link>
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <Card className="mb-8 card-gradient shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-between flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleGoBack}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Go Back
                  </Button>
                  <Button onClick={handleRefresh} variant="secondary">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Page
                  </Button>
                  <Button asChild>
                    <Link to="/">
                      <Home className="mr-2 h-4 w-4" />
                      Back to Home
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {errorDetails && process.env.NODE_ENV !== 'production' && (
              <Alert className="mb-6 bg-primary/5 border-primary/20">
                <FileQuestion className="h-4 w-4" />
                <AlertTitle>Error Details (Development Only)</AlertTitle>
                <AlertDescription>
                  <code className="text-xs">{errorDetails}</code>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default NotFound;
