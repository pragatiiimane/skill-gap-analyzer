import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  analysisType?: string; // e.g., 'skill_analysis', 'match_results'
}

export default function FeedbackDialog({
  isOpen,
  onClose,
  userId,
  analysisType = 'general',
}: FeedbackDialogProps) {
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleYes = () => {
    setHelpful(true);
  };

  const handleNo = () => {
    setHelpful(false);
  };

  const handleSubmit = async () => {
    if (!helpful) {
      toast({
        title: 'Select an option',
        description: 'Please indicate if this analysis was helpful.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from('feedback').insert({
        user_id: userId,
        rating: rating || 3,
        category: 'skill_analysis',
        comment: comment || (helpful ? 'Analysis was helpful' : 'Analysis needs improvement'),
        helpful: helpful,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: 'Thank you!',
        description: 'Your feedback helps us improve.',
      });

      // Reset and close
      setHelpful(null);
      setComment('');
      setRating(0);
      setTimeout(onClose, 1000);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to submit feedback.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Was this analysis helpful?</DialogTitle>
          <DialogDescription>
            Your feedback helps us improve the skill analysis and recommendations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Quick feedback buttons */}
          <div className="flex gap-3">
            <Button
              variant={helpful === true ? 'default' : 'outline'}
              className="flex-1"
              onClick={handleYes}
            >
              <ThumbsUp className="mr-2 h-4 w-4" />
              Yes, helpful
            </Button>
            <Button
              variant={helpful === false ? 'default' : 'outline'}
              className="flex-1"
              onClick={handleNo}
            >
              <ThumbsDown className="mr-2 h-4 w-4" />
              No, not helpful
            </Button>
          </div>

          {/* Show additional fields if they selected an option */}
          {helpful !== null && (
            <>
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Rate this analysis:
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={24}
                        className={`${
                          star <= (hoveredRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional comment */}
              <div>
                <label htmlFor="feedback-comment" className="block text-sm font-medium mb-1">
                  Additional comments (optional):
                </label>
                <Textarea
                  id="feedback-comment"
                  placeholder={
                    helpful
                      ? 'What did you like about the analysis?'
                      : 'What could we improve?'
                  }
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  maxLength={500}
                  className="resize-none"
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Skip
          </Button>
          {helpful !== null && (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
