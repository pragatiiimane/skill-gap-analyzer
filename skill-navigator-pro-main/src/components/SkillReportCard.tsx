import { TrendingUp, Clock, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SkillReportCardProps {
  title: string;
  role: string;
  matchPercentage: number;
  date: string;
  skills: string[];
  onClick: () => void;
}

export default function SkillReportCard({
  title,
  role,
  matchPercentage,
  date,
  skills,
  onClick,
}: SkillReportCardProps) {
  return (
    <Card
      className="overflow-hidden hover:shadow-lg hover:scale-105 transition-all cursor-pointer group"
      onClick={onClick}
    >
      {/* Thumbnail-like header */}
      <div className="relative h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-2xl font-bold text-primary">{matchPercentage.toFixed(0)}%</p>
          <p className="text-xs text-muted-foreground">Match Score</p>
        </div>
        <Badge className="absolute top-2 right-2 bg-green-500">Completed</Badge>
      </div>

      {/* Card content */}
      <CardContent className="pt-4">
        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">{role}</p>

        {/* Skills preview */}
        <div className="flex flex-wrap gap-1 mt-3">
          {skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{skills.length - 3}
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{date}</span>
        </div>
      </CardContent>
    </Card>
  );
}
