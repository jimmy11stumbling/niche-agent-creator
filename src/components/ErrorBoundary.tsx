
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
    
    // You could also send to a logging service like Sentry here
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default error UI
      return (
        <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
          <Alert variant="destructive" className="mb-4 max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              {this.state.error?.message || "An unexpected error occurred."}
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={this.handleReset}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            
            <Button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              Refresh Page
            </Button>
          </div>
          
          {process.env.NODE_ENV !== 'production' && this.state.errorInfo && (
            <details className="mt-4 p-4 bg-slate-100 rounded-md text-xs overflow-auto max-w-2xl">
              <summary className="text-sm font-medium cursor-pointer mb-2">
                Error Details (Development Only)
              </summary>
              <pre className="whitespace-pre-wrap">
                {this.state.error && this.state.error.toString()}
              </pre>
              <pre className="whitespace-pre-wrap mt-2 text-slate-600">
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
