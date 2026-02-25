import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Lightbulb, ExternalLink } from "lucide-react";

interface Recommendation {
  skill: string;
  courses: { name: string; platform: string; url: string }[];
  projects: string[];
  roadmap: { month1: string; month2: string; month3: string };
}

export default function RecommendationsList({ recommendations }: { recommendations: Recommendation[] }) {
  if (recommendations.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" /> Learning Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {recommendations.map((rec, i) => (
            <AccordionItem key={i} value={`rec-${i}`}>
              <AccordionTrigger className="text-sm font-medium capitalize">{rec.skill}</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">📚 Courses</p>
                  <div className="space-y-2">
                    {rec.courses.map((course, ci) => (
                      <a
                        key={ci}
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-md border border-border p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium">{course.name}</p>
                          <p className="text-xs text-muted-foreground">{course.platform}</p>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">💡 Project Ideas</p>
                  <ul className="space-y-1">
                    {rec.projects.map((project, pi) => (
                      <li key={pi} className="flex items-start gap-2 text-sm">
                        <Lightbulb className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />
                        <span>{typeof project === "string" ? project : (project as any).name || JSON.stringify(project)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
