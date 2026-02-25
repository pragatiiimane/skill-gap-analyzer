import { useState, useEffect, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Brain, LogOut, Upload, Target, BookOpen, Zap, TrendingUp, FileText, X, MessageSquare, Flame, ChevronRight } from "lucide-react";
import SkillRadarChart from "@/components/SkillRadarChart";
import MatchResults from "@/components/MatchResults";
import RecommendationsList from "@/components/RecommendationsList";
import RoadmapView from "@/components/RoadmapView";
import AddRoleDialog from "@/components/AddRoleDialog";
import DownloadReportButton from "@/components/DownloadReportButton";
import FeedbackDialog from "@/components/FeedbackDialog";
import SkillReportCard from "@/components/SkillReportCard";
import RecommendedSkillCard from "@/components/RecommendedSkillCard";
import TrendingSkillCard from "@/components/TrendingSkillCard";

interface JobRole {
  id: string;
  title: string;
  description: string;
  required_skills: string[];
  category: string;
  user_id?: string | null;
}

interface AnalysisResult {
  extractedSkills: string[];
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  similarityScore: number;
  jobRole: string;
  aiSummary: string;
  recommendations: {
    skill: string;
    courses: { name: string; platform: string; url: string }[];
    projects: string[];
    roadmap: { month1: string; month2: string; month3: string };
  }[];
}

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [userProfile, setUserProfile] = useState<{ full_name: string | null; email: string | null } | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // PDF upload state
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  // Sample data for recommendations and trending
  const recommendedSkills = [
    { skill: "React", difficulty: "Intermediate" as const, courses: 145, popularity: 95 },
    { skill: "TypeScript", difficulty: "Intermediate" as const, courses: 98, popularity: 88 },
    { skill: "Node.js", difficulty: "Intermediate" as const, courses: 112, popularity: 92 },
    { skill: "GraphQL", difficulty: "Advanced" as const, courses: 67, popularity: 78 },
    { skill: "Docker", difficulty: "Advanced" as const, courses: 89, popularity: 85 },
    { skill: "AWS", difficulty: "Advanced" as const, courses: 156, popularity: 90 },
  ];

  const trendingSkills = [
    { skill: "AI/Machine Learning", rank: 1, demand: "Hot" as const, jobs: 8500, growth: 45 },
    { skill: "Cloud Architecture", rank: 2, demand: "Hot" as const, jobs: 7200, growth: 38 },
    { skill: "DevOps", rank: 3, demand: "Rising" as const, jobs: 6800, growth: 32 },
    { skill: "Data Engineering", rank: 4, demand: "Hot" as const, jobs: 5600, growth: 41 },
    { skill: "Kubernetes", rank: 5, demand: "Hot" as const, jobs: 4900, growth: 35 },
  ];

  const fetchRoles = useCallback(() => {
    if (user) {
      supabase.from("job_roles").select("*").order("title").then(({ data }) => {
        if (data) setJobRoles(data as JobRole[]);
      });
    }
  }, [user]);

  const fetchUserProfile = useCallback(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("full_name, email")
        .eq("user_id", user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setUserProfile(data);
          }
        });
    }
  }, [user]);

  useEffect(() => { 
    fetchRoles();
    fetchUserProfile();
  }, [fetchRoles, fetchUserProfile]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!validTypes.includes(selected.type) && !selected.name.endsWith(".pdf") && !selected.name.endsWith(".docx")) {
      toast({ title: "Invalid file", description: "Please upload a PDF or DOCX file.", variant: "destructive" });
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max file size is 10MB.", variant: "destructive" });
      return;
    }

    setFile(selected);
    setFileName(selected.name);
    setResumeText("");
    setResult(null);
  };

  const handleUploadAndParse = async () => {
    if (!file) return;
    setParsing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data: { session } } = await supabase.auth.getSession();
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/parse-resume`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to parse resume");

      if (!data.text?.trim()) {
        toast({ title: "Could not extract text", description: "The file might be image-based or encrypted. Try a different PDF.", variant: "destructive" });
      } else {
        setResumeText(data.text);
        toast({ title: "Resume parsed!", description: `Extracted ${data.charCount} characters from ${data.fileName}` });
      }
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setParsing(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setFileName("");
    setResumeText("");
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !selectedRole) {
      toast({ title: "Missing fields", description: "Please upload a resume and select a job role.", variant: "destructive" });
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      const response = await supabase.functions.invoke("analyze-resume", {
        body: { resumeText: resumeText.trim(), jobRoleId: selectedRole },
      });

      if (response.error) throw new Error(response.error.message);
      setResult(response.data as AnalysisResult);
      toast({ title: "Analysis complete!", description: `Match: ${response.data.matchPercentage.toFixed(1)}%` });
      
      // Show feedback dialog after 10 seconds
      setTimeout(() => setShowFeedbackDialog(true), 10000);
    } catch (err: any) {
      toast({ title: "Analysis failed", description: err.message, variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  // Group roles by category
  const categories = Array.from(new Set(jobRoles.map(r => r.category || "Other")));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Brain className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-bold text-foreground">SkillGap AI</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-foreground hidden sm:block">
              {userProfile?.full_name || "User"}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/feedback")}
              className="gap-2"
            >
              <MessageSquare className="h-4 w-4" /> Feedback
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-1" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-12">
        {/* Hero Section - Quick Upload CTA */}
        <section className="space-y-4">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-8 border border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Welcome back, {userProfile?.full_name || "User"}! 👋</h2>
                <p className="text-muted-foreground">Upload your resume to analyze your skills and get personalized recommendations.</p>
              </div>
              <Button size="lg" onClick={() => setShowUploadModal(!showUploadModal)}>
                <Upload className="mr-2 h-5 w-5" />
                Upload Resume
              </Button>
            </div>
          </div>

          {/* Upload Section - Collapsible */}
          {showUploadModal && (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Resume Upload Card */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" /> Upload Resume
                  </CardTitle>
                  <CardDescription>Upload your resume as PDF or DOCX</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!file ? (
                    <label className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border p-8 cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors">
                      <FileText className="h-10 w-10 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">Click to upload resume</p>
                        <p className="text-xs text-muted-foreground mt-1">PDF or DOCX • Max 10MB</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
                        <FileText className="h-8 w-8 text-primary shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{fileName}</p>
                          <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={clearFile} className="shrink-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {!resumeText ? (
                        <Button onClick={handleUploadAndParse} disabled={parsing} className="w-full">
                          {parsing ? (
                            <><div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2" /> Extracting text...</>
                          ) : (
                            <><Upload className="h-4 w-4 mr-2" /> Extract Text from Resume</>
                          )}
                        </Button>
                      ) : (
                        <div className="rounded-lg border border-border bg-accent/5 p-3">
                          <p className="text-xs font-medium text-accent mb-1">✓ Text extracted successfully</p>
                          <p className="text-xs text-muted-foreground">{resumeText.length} characters extracted</p>
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{resumeText.substring(0, 200)}...</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Target Role Card */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-accent" /> Target Role
                      </CardTitle>
                      <CardDescription className="mt-1">Select or create a role</CardDescription>
                    </div>
                    <AddRoleDialog onRoleCreated={fetchRoles} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a job role..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <div key={cat}>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{cat}</div>
                          {jobRoles
                            .filter((r) => (r.category || "Other") === cat)
                            .map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                <span>{role.title}</span>
                                {role.user_id && <span className="ml-2 text-xs text-muted-foreground">(Custom)</span>}
                              </SelectItem>
                            ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedRole && (
                    <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
                      <p className="text-sm font-medium">{jobRoles.find((r) => r.id === selectedRole)?.title}</p>
                      <p className="text-xs text-muted-foreground">{jobRoles.find((r) => r.id === selectedRole)?.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {jobRoles.find((r) => r.id === selectedRole)?.required_skills.map((skill) => (
                          <span key={skill} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button onClick={handleAnalyze} disabled={analyzing || !resumeText.trim() || !selectedRole} className="w-full">
                    {analyzing ? (
                      <><div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2" /> Analyzing...</>
                    ) : (
                      <><Zap className="h-4 w-4 mr-2" /> Analyze Skills</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </section>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-end">
              <DownloadReportButton 
                result={result} 
                onDownloadComplete={() => setShowFeedbackDialog(true)} 
              />
            </div>
            {result.aiSummary && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-primary mb-1">AI Career Coach</p>
                      <p className="text-sm text-foreground leading-relaxed">{result.aiSummary}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6 text-center">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="text-4xl font-bold text-primary">{result.matchPercentage.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground mt-2">Match Score</p>
                </CardContent>
              </Card>
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6 text-center">
                  <Zap className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <p className="text-4xl font-bold text-green-600">{result.matchingSkills.length}</p>
                  <p className="text-sm text-muted-foreground mt-2">Skills Matched</p>
                </CardContent>
              </Card>
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-6 text-center">
                  <BookOpen className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                  <p className="text-4xl font-bold text-orange-600">{result.missingSkills.length}</p>
                  <p className="text-sm text-muted-foreground mt-2">Skills to Learn</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <SkillRadarChart result={result} />
              <MatchResults result={result} />
            </div>

            <RecommendationsList recommendations={result.recommendations} />
            <RoadmapView recommendations={result.recommendations} />
          </div>
        )}

        {/* Skill Reports Section - Past Analyses */}
        {result && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                  Your Skill Reports
                </h2>
                <p className="text-muted-foreground text-sm mt-1">Your recent career analysis and skill assessments</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <SkillReportCard
                title={`Analysis: ${jobRoles.find((r) => r.id === selectedRole)?.title || "Role"}`}
                role={jobRoles.find((r) => r.id === selectedRole)?.title || "Unknown"}
                matchPercentage={result.matchPercentage}
                date={new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                skills={result.matchingSkills}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              />
            </div>
          </section>
        )}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-500" />
                Recommended Skills
              </h2>
              <p className="text-muted-foreground text-sm mt-1">Build these in-demand skills to advance your career</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedSkills.map((skill) => (
              <RecommendedSkillCard
                key={skill.skill}
                skill={skill.skill}
                difficulty={skill.difficulty}
                coursesAvailable={skill.courses}
                popularity={skill.popularity}
                onClick={() => toast({ title: `Learning: ${skill.skill}`, description: "Redirecting to courses..." })}
              />
            ))}
          </div>
        </section>

        {/* Trending Skills Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Flame className="h-6 w-6 text-orange-500" />
                Trending Skills
              </h2>
              <p className="text-muted-foreground text-sm mt-1">The most in-demand skills in the job market right now</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingSkills.map((skill) => (
              <TrendingSkillCard
                key={skill.skill}
                skill={skill.skill}
                rank={skill.rank}
                demandLevel={skill.demand}
                jobsAvailable={skill.jobs}
                growth={skill.growth}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Feedback Dialog */}
      <FeedbackDialog 
        isOpen={showFeedbackDialog} 
        onClose={() => setShowFeedbackDialog(false)} 
        userId={user.id}
        analysisType="dashboard"
      />
    </div>
  );
}
