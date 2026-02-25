import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ArrowRight } from "lucide-react";

interface RecommendedSkillCardProps {
  skill: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  coursesAvailable: number;
  popularity: number; // 1-100
  onClick: () => void;
}

const difficultyColors = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-yellow-100 text-yellow-800",
  Advanced: "bg-red-100 text-red-800",
};

export default function RecommendedSkillCard({
  skill,
  difficulty,
  coursesAvailable,
  popularity,
  onClick,
}: RecommendedSkillCardProps) {
  return (
    <Card
      className="overflow-hidden hover:shadow-md hover:scale-102 transition-all cursor-pointer group"
      onClick={onClick}
    >
      {/* Header with icon */}
      <div className="h-28 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center group-hover:from-blue-100 group-hover:to-purple-100 transition-colors">
        <BookOpen className="h-10 w-10 text-blue-500 group-hover:scale-110 transition-transform" />
      </div>

      {/* Content */}
      <CardContent className="pt-4">
        <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
          {skill}
        </h3>

        {/* Difficulty badge */}
        <Badge className={`${difficultyColors[difficulty]} mt-2 text-xs`}>
          {difficulty}
        </Badge>

        {/* Stats */}
        <div className="space-y-2 mt-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Courses Available:</span>
            <span className="font-semibold text-foreground">{coursesAvailable}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Popularity:</span>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i < Math.ceil(popularity / 20)
                      ? "bg-yellow-400"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Learn button indicator */}
        <div className="flex items-center gap-2 mt-4 text-xs text-primary font-medium group-hover:gap-3 transition-all">
          <span>Explore</span>
          <ArrowRight className="h-3 w-3" />
        </div>
      </CardContent>
    </Card>
  );
}
