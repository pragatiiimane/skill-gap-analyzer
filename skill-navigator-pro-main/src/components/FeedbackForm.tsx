import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FeedbackFormProps {
  userId: string;
  onSubmitSuccess?: () => void;
}

const FEEDBACK_CATEGORIES = [
  { value: 'skill_analysis', label: 'Skill Analysis Accuracy' },
  { value: 'course_recommendation', label: 'Course Recommendations' },
  { value: 'ui_design', label: 'UI/Design' },
  { value: 'technical_issue', label: 'Technical Issue' },
  { value: 'general', label: 'General Suggestion' },
];

export default function FeedbackForm({ userId, onSubmitSuccess }: FeedbackFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [category, setCategory] = useState('general');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating before submitting.',
        variant: 'destructive',
      });
      return;
    }

    if (comment.trim().length < 10) {
      toast({
        title: 'Comment too short',
        description: 'Please provide at least 10 characters of feedback.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('feedback').insert({
        user_id: userId,
        rating,
        category,
        comment: comment.trim(),
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: 'Thank you!',
        description: 'Your feedback has been submitted successfully.',
      });

      // Reset form
      setRating(0);
      setCategory('general');
      setComment('');

      // Call callback after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        onSubmitSuccess?.();
      }, 2000);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to submit feedback.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Share Your Feedback</CardTitle>
        <CardDescription>
          Help us improve by sharing your experience with Skill Navigator Pro
        </CardDescription>
      </CardHeader>

      <CardContent>
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Thank you! Your feedback helps us improve.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Section */}
          <div>
            <label className="block text-sm font-medium mb-3">
              How would you rate your experience?
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="relative transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Rating: {rating} / 5 stars
              </p>
            )}
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Feedback Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {FEEDBACK_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Comment Section */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-2">
              Your Feedback
            </label>
            <Textarea
              id="comment"
              placeholder="Share your thoughts, suggestions, or report issues..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              maxLength={1000}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {comment.length} / 1000 characters
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || success}
            className="w-full"
            size="lg"
          >
            <Send className="mr-2 h-4 w-4" />
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
