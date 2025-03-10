
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Brain, Globe, Plus, LayoutDashboard, FileCode, Workflow, Rocket } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="border-b bg-background/70 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Brain className="h-6 w-6 text-primary" />
          <span>AgentCreator</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/templates"
            className="text-sm transition-colors hover:text-primary"
          >
            Templates
          </Link>
          <Link
            to="/workflows"
            className="text-sm transition-colors hover:text-primary"
          >
            Workflows
          </Link>
          <Link
            to="/data-analysis"
            className="text-sm transition-colors hover:text-primary"
          >
            Data Analysis
          </Link>
          <Link
            to="/docs"
            className="text-sm transition-colors hover:text-primary"
          >
            Documentation
          </Link>
          <Link
            to="/mvp"
            className="text-sm transition-colors hover:text-primary"
          >
            MVP
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size={isMobile ? "icon" : "default"}
            onClick={() => navigate("/create-agent")}
            className="hidden sm:flex"
          >
            {isMobile ? <Plus className="h-5 w-5" /> : "Create Agent"}
          </Button>
          <Button
            size={isMobile ? "icon" : "default"}
            onClick={() => navigate("/templates")}
          >
            {isMobile ? <FileCode className="h-5 w-5" /> : "Templates"}
          </Button>
          <button
            onClick={toggleMenu}
            className="md:hidden bg-transparent p-2"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-background border-b shadow-lg">
          <div className="container mx-auto py-4 px-4 space-y-4">
            <Link
              to="/create-agent"
              className="flex items-center p-2 rounded-lg hover:bg-secondary"
              onClick={closeMenu}
            >
              <Plus className="mr-2 h-5 w-5 text-primary" />
              <span>Create Agent</span>
            </Link>
            <Link
              to="/templates"
              className="flex items-center p-2 rounded-lg hover:bg-secondary"
              onClick={closeMenu}
            >
              <FileCode className="mr-2 h-5 w-5 text-primary" />
              <span>Templates</span>
            </Link>
            <Link
              to="/workflows"
              className="flex items-center p-2 rounded-lg hover:bg-secondary"
              onClick={closeMenu}
            >
              <Workflow className="mr-2 h-5 w-5 text-primary" />
              <span>Workflows</span>
            </Link>
            <Link
              to="/data-analysis"
              className="flex items-center p-2 rounded-lg hover:bg-secondary"
              onClick={closeMenu}
            >
              <LayoutDashboard className="mr-2 h-5 w-5 text-primary" />
              <span>Data Analysis</span>
            </Link>
            <Link
              to="/docs"
              className="flex items-center p-2 rounded-lg hover:bg-secondary"
              onClick={closeMenu}
            >
              <Globe className="mr-2 h-5 w-5 text-primary" />
              <span>Documentation</span>
            </Link>
            <Link
              to="/mvp"
              className="flex items-center p-2 rounded-lg hover:bg-secondary"
              onClick={closeMenu}
            >
              <Rocket className="mr-2 h-5 w-5 text-primary" />
              <span>MVP</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
