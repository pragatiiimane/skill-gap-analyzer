import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, TrendingUp } from "lucide-react";

interface TrendingSkillCardProps {
  skill: string;
  rank: number;
  demandLevel: "Hot" | "Rising" | "Stable";
  jobsAvailable: number;
  growth: number; // percentage
}

const demandColors = {
  Hot: "bg-red-100 text-red-800",
  Rising: "bg-orange-100 text-orange-800",
  Stable: "bg-blue-100 text-blue-800",
};

const demandIcons = {
  Hot: Flame,
  Rising: TrendingUp,
  Stable: TrendingUp,
};

export default function TrendingSkillCard({
  skill,
  rank,
  demandLevel,
  jobsAvailable,
  growth,
}: TrendingSkillCardProps) {
  const DemandIcon = demandIcons[demandLevel];

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow group">
      <CardContent className="pt-4">
        {/* Rank badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {skill}
            </h3>
            <p className="text-xs text-muted-foreground">#{rank} Trending</p>
          </div>
          <Badge className="bg-primary/10 text-primary text-lg font-bold px-3 py-1">
            #{rank}
          </Badge>
        </div>

        {/* Demand badge */}
        <Badge className={`${demandColors[demandLevel]} text-xs mb-3`}>
          <DemandIcon className="h-3 w-3 mr-1" />
          {demandLevel}
        </Badge>

        {/* Stats */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Jobs Available:</span>
            <span className="font-semibold text-foreground">{jobsAvailable.toLocaleString()}+</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="text-muted-foreground">Growth:</span>
            <span className="font-semibold text-green-600">
              +{growth}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Market Demand</span>
            <span className="text-xs font-semibold">{Math.min(growth, 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all"
              style={{ width: `${Math.min(growth, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
