
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
  AlertTriangle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ErrorBoundary from "@/components/ErrorBoundary";

const COMMON_ROUTES = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About Us" },
  { path: "/docs", label: "Documentation" },
  { path: "/create-agent", label: "Create Agent" },
  { path: "/workflows", label: "Workflows" },
  { path: "/templates", label: "Templates" }
];

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    // Log and capture the error details
    const errorMessage = `404 Error: User attempted to access non-existent route: ${location.pathname}`;
    console.error(errorMessage);
    setErrorDetails(errorMessage);
    
    // Could send this to an error logging service in production
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would redirect to a search results page
    // For now, we'll just redirect to the docs page
    if (searchQuery.trim()) {
      navigate(`/docs?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

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

            <Card className="mb-8 card-gradient shadow-lg">
              <CardHeader>
                <CardTitle>Looking for something?</CardTitle>
                <CardDescription>
                  Try searching or check out some of our popular pages below.
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {COMMON_ROUTES.map((route) => (
                    <Button
                      key={route.path}
                      variant="outline"
                      className="justify-start text-left"
                      asChild
                    >
                      <Link to={route.path}>{route.label}</Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between flex-wrap gap-2">
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
              </CardFooter>
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
