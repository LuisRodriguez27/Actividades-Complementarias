
import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  initialRating?: number;
  totalStars?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StarRating({
  initialRating = 0,
  totalStars = 5,
  onChange,
  readOnly = false,
  size = "md",
  className,
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (starIndex: number) => {
    if (readOnly) return;
    const newRating = starIndex + 1;
    setRating(newRating);
    if (onChange) {
      onChange(newRating);
    }
  };

  const sizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const iconSize = sizes[size];

  return (
    <div className={cn("flex items-center", className)}>
      {[...Array(totalStars)].map((_, index) => {
        const isFilled =
          (hoverRating || rating) >= index + 1;
        
        return (
          <span
            key={index}
            className={cn(
              "cursor-pointer p-0.5 transition-colors",
              readOnly && "cursor-default",
              isFilled ? "text-amber-500" : "text-gray-300"
            )}
            onMouseEnter={() => !readOnly && setHoverRating(index + 1)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            onClick={() => handleClick(index)}
          >
            <Star
              size={iconSize}
              fill={isFilled ? "currentColor" : "none"}
              className={cn(
                "transition-transform",
                !readOnly && hoverRating === index + 1 && "scale-110"
              )}
            />
          </span>
        );
      })}
    </div>
  );
}
