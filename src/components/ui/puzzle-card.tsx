import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface PuzzleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "connection" | "developer" | "company";
  size?: "sm" | "md" | "lg";
}

const PuzzleCard = React.forwardRef<HTMLDivElement, PuzzleCardProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const variantClasses = {
      default: "bg-card border shadow-sm hover:shadow-md",
      connection: "bg-gradient-to-br from-card to-card/80 border-primary/20 shadow-puzzle hover:shadow-connection",
      developer: "bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/30 shadow-puzzle",
      company: "bg-gradient-to-br from-accent/5 to-primary/5 border-accent/30 shadow-puzzle"
    };

    const sizeClasses = {
      sm: "p-4",
      md: "p-6", 
      lg: "p-8"
    };

    return (
      <Card
        ref={ref}
        className={cn(
          "puzzle-piece transition-all duration-300 hover:-translate-y-1",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

PuzzleCard.displayName = "PuzzleCard";

const PuzzleCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardHeader
    ref={ref}
    className={cn("pb-3", className)}
    {...props}
  />
));

PuzzleCardHeader.displayName = "PuzzleCardHeader";

const PuzzleCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardContent
    ref={ref}
    className={cn("pt-0", className)}
    {...props}
  />
));

PuzzleCardContent.displayName = "PuzzleCardContent";

export { PuzzleCard, PuzzleCardHeader, PuzzleCardContent };