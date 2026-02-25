import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";

interface Props {
  result: {
    matchingSkills: string[];
    missingSkills: string[];
    matchPercentage: number;
  };
}

export default function SkillRadarChart({ result }: Props) {
  const matchLevel = result.matchPercentage >= 80 ? "Excellent" : result.matchPercentage >= 60 ? "Good" : result.matchPercentage >= 40 ? "Fair" : "Needs Work";
  const matchColor = result.matchPercentage >= 80 ? "bg-green-100 text-green-800 border-green-300" : result.matchPercentage >= 60 ? "bg-blue-100 text-blue-800 border-blue-300" : result.matchPercentage >= 40 ? "bg-yellow-100 text-yellow-800 border-yellow-300" : "bg-red-100 text-red-800 border-red-300";
  const progressColor = result.matchPercentage >= 80 ? "bg-green-500" : result.matchPercentage >= 60 ? "bg-blue-500" : result.matchPercentage >= 40 ? "bg-yellow-500" : "bg-red-500";

  return (
    <Card className="border border-slate-200 bg-white shadow-xl">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900">Skills Assessment</CardTitle>
            <p className="text-sm text-slate-600 mt-1">Your skills vs job requirements</p>
          </div>
          <div className={`px-6 py-3 rounded-lg border-2 ${matchColor}`}>
            <p className="text-2xl font-bold">{result.matchPercentage.toFixed(0)}%</p>
            <p className="text-xs font-semibold">{matchLevel} Match</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-slate-700">Overall Match Progress</p>
            <p className="text-xs text-slate-500">{result.matchPercentage.toFixed(0)}%</p>
          </div>
          <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
            <div
              className={`h-full ${progressColor} transition-all duration-500`}
              style={{ width: `${result.matchPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 border border-green-300 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-green-700">{result.matchingSkills.length}</p>
            <p className="text-xs text-green-600 font-semibold mt-1 uppercase">Skills Matched</p>
          </div>
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-red-700">{result.missingSkills.length}</p>
            <p className="text-xs text-red-600 font-semibold mt-1 uppercase">Skills Needed</p>
          </div>
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-blue-700">{result.matchingSkills.length + result.missingSkills.length}</p>
            <p className="text-xs text-blue-600 font-semibold mt-1 uppercase">Total Skills</p>
          </div>
        </div>

        {/* Skills comparison */}
        <div className="grid grid-cols-2 gap-6">
          {/* Your Skills */}
          <div>
            <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Your Skills ({result.matchingSkills.length})
            </h3>
            <div className="space-y-2">
              {result.matchingSkills.length > 0 ? (
                result.matchingSkills.map((skill) => (
                  <Badge key={skill} className="bg-green-100 text-green-800 hover:bg-green-200 text-sm py-2 px-3 block text-center">
                    ✓ {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-slate-500 italic">No matched skills yet</p>
              )}
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
              <Circle className="h-5 w-5" />
              Skills Needed ({result.missingSkills.length})
            </h3>
            <div className="space-y-2">
              {result.missingSkills.length > 0 ? (
                result.missingSkills.map((skill) => (
                  <Badge key={skill} className="bg-red-100 text-red-800 hover:bg-red-200 text-sm py-2 px-3 block text-center">
                    ○ {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-slate-500 italic">Perfect match!</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
