import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import FeedbackForm from '@/components/FeedbackForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Feedback() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-4xl font-bold">Feedback</h1>
              <p className="text-muted-foreground mt-1">
                Help us improve Skill Navigator Pro with your valuable feedback
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Form */}
        <div className="flex justify-center">
          <FeedbackForm userId={user.id} onSubmitSuccess={() => {
            // Could navigate or show a success message
            navigate('/dashboard');
          }} />
        </div>

        {/* Info Section */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">💡 How We Use Your Feedback</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Improve skill analysis accuracy</li>
              <li>✓ Enhance course recommendations</li>
              <li>✓ Fix bugs and technical issues</li>
              <li>✓ Better user experience design</li>
              <li>✓ Add new features based on your suggestions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
