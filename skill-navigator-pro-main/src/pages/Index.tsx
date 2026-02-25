import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Brain, ArrowRight, Zap, Target, BookOpen, TrendingUp, Sparkles } from "lucide-react";

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // If already logged in, go to dashboard
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Navigation */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">SkillGap AI</h1>
          </div>
          <Button onClick={() => navigate("/auth")} size="lg" className="gap-2">
            Sign In / Sign Up
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-20 space-y-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent leading-tight">
            Assess Your Skills, Advance Your Career
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your resume and get instant, AI-powered analysis of your skills. Discover gaps, get personalized learning paths, and land your dream job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="gap-2 text-base"
            >
              <Sparkles className="h-5 w-5" />
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/auth")}
              className="gap-2 text-base"
            >
              Learn More
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-border">
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">500+</p>
            <p className="text-muted-foreground mt-2">Technical Skills Tracked</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">100+</p>
            <p className="text-muted-foreground mt-2">Job Roles Analyzed</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">10K+</p>
            <p className="text-muted-foreground mt-2">Courses & Resources</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-4">Powerful Features</h3>
          <p className="text-muted-foreground text-lg">Everything you need to accelerate your career growth</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-card border border-border rounded-lg p-8 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-xl font-bold">Resume Analysis</h4>
            <p className="text-muted-foreground">
              Upload your resume and get instant skills extraction with AI-powered accuracy
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-card border border-border rounded-lg p-8 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
            <h4 className="text-xl font-bold">Skill Gap Analysis</h4>
            <p className="text-muted-foreground">
              Visual reports showing your skills vs. job requirements with detailed breakdowns
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-card border border-border rounded-lg p-8 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-green-500" />
            </div>
            <h4 className="text-xl font-bold">Learning Paths</h4>
            <p className="text-muted-foreground">
              Personalized 3-month roadmaps with curated courses and real-world projects
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-card border border-border rounded-lg p-8 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-purple-500" />
            </div>
            <h4 className="text-xl font-bold">Smart Recommendations</h4>
            <p className="text-muted-foreground">
              AI-powered course recommendations from top platforms (Coursera, Udemy, etc.)
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-card border border-border rounded-lg p-8 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-orange-500" />
            </div>
            <h4 className="text-xl font-bold">Trending Skills</h4>
            <p className="text-muted-foreground">
              Stay updated with market trends and high-demand skills in your industry
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-card border border-border rounded-lg p-8 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-cyan-500" />
            </div>
            <h4 className="text-xl font-bold">History & Reports</h4>
            <p className="text-muted-foreground">
              Track your progress over time and download detailed skill analysis reports
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="container py-20 bg-card/50 rounded-lg border border-border px-8 my-20 space-y-12">
        <div className="text-center">
          <h3 className="text-4xl font-bold mb-4">How It Works</h3>
          <p className="text-muted-foreground text-lg">Get started in just 3 simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Step 1 */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h4 className="text-xl font-bold">Upload Resume</h4>
            <p className="text-muted-foreground">
              Upload your PDF or DOCX resume. Our system will extract and analyze all your skills.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h4 className="text-xl font-bold">Select Job Role</h4>
            <p className="text-muted-foreground">
              Choose your target position from 100+ job roles to get precise skill comparisons.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h4 className="text-xl font-bold">Get Insights</h4>
            <p className="text-muted-foreground">
              Receive personalized learning paths and course recommendations instantly.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 text-center space-y-8">
        <h3 className="text-4xl font-bold">Ready to advance your career?</h3>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of professionals using SkillGap AI to identify skill gaps and accelerate their growth.
        </p>
        <Button 
          size="lg" 
          onClick={() => navigate("/auth")}
          className="gap-2 text-base"
        >
          <Sparkles className="h-5 w-5" />
          Get Started Free Today
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-20">
        <div className="container text-center text-muted-foreground">
          <p>© 2026 SkillGap AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
