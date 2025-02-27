
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Brain, Plus, List, X, Settings, Github, LifeBuoy, Book } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-full border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center mr-6">
            <Brain className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-semibold">AgentCreator</span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/20 to-primary/5 p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <Brain className="h-6 w-6 text-primary" />
                          <div className="mt-4 mb-2 text-lg font-medium">
                            Niche Agent Creator
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Create custom AI agents for any niche using powerful language models
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/models" title="Models" Icon={Settings}>
                      Explore and manage language models
                    </ListItem>
                    <ListItem href="/templates" title="Templates" Icon={Book}>
                      Browse pre-built agent templates
                    </ListItem>
                    <ListItem href="/agents" title="My Agents" Icon={Brain}>
                      Manage your created AI agents
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/templates" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Templates
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/documentation" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Documentation
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="hidden md:flex">
            <Link to="/documentation">
              <Book className="mr-2 h-4 w-4" />
              Docs
            </Link>
          </Button>
          <Button asChild className="hidden md:flex">
            <Link to="/create">
              <Plus className="mr-2 h-4 w-4" />
              New Agent
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <List className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              to="/create"
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-secondary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Plus className="h-5 w-5" />
              <span>New Agent</span>
            </Link>
            <Link
              to="/templates"
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-secondary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Book className="h-5 w-5" />
              <span>Templates</span>
            </Link>
            <Link
              to="/agents"
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-secondary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Brain className="h-5 w-5" />
              <span>My Agents</span>
            </Link>
            <Link
              to="/documentation"
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-secondary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LifeBuoy className="h-5 w-5" />
              <span>Documentation</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

interface ListItemProps {
  className?: string;
  title: string;
  href: string;
  children: React.ReactNode;
  Icon: React.ComponentType<{ className?: string }>;
}

const ListItem = ({ className, title, children, href, Icon }: ListItemProps) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
        >
          <div className="flex items-center">
            <Icon className="h-4 w-4 mr-2 text-primary" />
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
};

export default Header;
