import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";

interface Recommendation {
  skill: string;
  roadmap: { month1: string; month2: string; month3: string };
}

export default function RoadmapView({ recommendations }: { recommendations: Recommendation[] }) {
  if (recommendations.length === 0) return null;

  // Aggregate roadmap by month
  const month1Tasks = recommendations.map((r) => r.roadmap.month1);
  const month2Tasks = recommendations.map((r) => r.roadmap.month2);
  const month3Tasks = recommendations.map((r) => r.roadmap.month3);

  const months = [
    { label: "Month 1", subtitle: "Foundations", tasks: month1Tasks, color: "bg-blue-50 text-blue-700 border-blue-200" },
    { label: "Month 2", subtitle: "Building", tasks: month2Tasks, color: "bg-green-50 text-green-700 border-green-200" },
    { label: "Month 3", subtitle: "Application", tasks: month3Tasks, color: "bg-purple-50 text-purple-700 border-purple-200" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" /> 3-Month Learning Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {months.map((month, i) => (
            <div key={i} className="relative">
              <div className={`rounded-lg border p-4 ${month.color}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold">{month.label}</span>
                  <span className="text-xs opacity-70">{month.subtitle}</span>
                </div>
                <ul className="space-y-2">
                  {month.tasks.slice(0, 5).map((task, ti) => (
                    <li key={ti} className="text-xs leading-relaxed flex items-start gap-1.5">
                      <ArrowRight className="h-3 w-3 mt-0.5 shrink-0 opacity-60" />
                      <span>{task}</span>
                    </li>
                  ))}
                  {month.tasks.length > 5 && (
                    <li className="text-xs opacity-60">+{month.tasks.length - 5} more...</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
