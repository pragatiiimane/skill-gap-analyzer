import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface Props {
  result: {
    extractedSkills: string[];
    matchingSkills: string[];
    missingSkills: string[];
    similarityScore: number;
  };
}

export default function MatchResults({ result }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Skill Breakdown</CardTitle>
        <p className="text-xs text-muted-foreground">
          Cosine similarity: {(result.similarityScore * 100).toFixed(1)}% • {result.extractedSkills.length} skills extracted
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-600" /> Matching Skills ({result.matchingSkills.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.matchingSkills.map((skill) => (
              <Badge key={skill} className="bg-green-100 text-green-800 border-green-300">
                {skill}
              </Badge>
            ))}
            {result.matchingSkills.length === 0 && (
              <p className="text-xs text-muted-foreground italic">No matching skills found</p>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
            <XCircle className="h-4 w-4 text-red-600" /> Missing Skills ({result.missingSkills.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.missingSkills.map((skill) => (
              <Badge key={skill} className="bg-red-100 text-red-800 border-red-300">
                {skill}
              </Badge>
            ))}
            {result.missingSkills.length === 0 && (
              <p className="text-xs text-muted-foreground italic">You have all required skills! 🎉</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
