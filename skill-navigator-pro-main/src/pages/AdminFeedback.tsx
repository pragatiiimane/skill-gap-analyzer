import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Star, Trash2, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface Feedback {
  id: string;
  user_id: string;
  rating: number;
  category: string;
  comment: string;
  helpful: boolean | null;
  created_at: string;
}

interface FeedbackStats {
  totalFeedback: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
  categoryDistribution: { [key: string]: number };
  helpfulPercentage: number;
}

const CATEGORY_LABELS: { [key: string]: string } = {
  skill_analysis: 'Skill Analysis',
  course_recommendation: 'Course Recommendations',
  ui_design: 'UI/Design',
  technical_issue: 'Technical Issue',
  general: 'General Suggestion',
};

const CATEGORY_COLORS: { [key: string]: string } = {
  skill_analysis: 'bg-blue-100 text-blue-800',
  course_recommendation: 'bg-purple-100 text-purple-800',
  ui_design: 'bg-pink-100 text-pink-800',
  technical_issue: 'bg-red-100 text-red-800',
  general: 'bg-gray-100 text-gray-800',
};

export default function AdminFeedback() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [filterRating, setFilterRating] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setFeedbackList(data);
        calculateStats(data);
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to fetch feedback.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const calculateStats = (data: Feedback[]) => {
    if (!data.length) {
      setStats({
        totalFeedback: 0,
        averageRating: 0,
        ratingDistribution: {},
        categoryDistribution: {},
        helpfulPercentage: 0,
      });
      return;
    }

    const ratingDist: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const categoryDist: { [key: string]: number } = {};
    let totalRating = 0;
    let helpfulCount = 0;

    data.forEach((feedback) => {
      ratingDist[feedback.rating]++;
      totalRating += feedback.rating;
      categoryDist[feedback.category] = (categoryDist[feedback.category] || 0) + 1;
      if (feedback.helpful === true) helpfulCount++;
    });

    setStats({
      totalFeedback: data.length,
      averageRating: totalRating / data.length,
      ratingDistribution: ratingDist,
      categoryDistribution: categoryDist,
      helpfulPercentage: (helpfulCount / data.length) * 100,
    });
  };

  const deleteFeedback = async (id: string) => {
    try {
      const { error } = await supabase.from('feedback').delete().eq('id', id);
      if (error) throw error;

      setFeedbackList(feedbackList.filter((f) => f.id !== id));
      toast({
        title: 'Deleted',
        description: 'Feedback has been removed.',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete feedback.',
        variant: 'destructive',
      });
    }
  };

  const filteredFeedback = feedbackList.filter((f) => {
    const matchesRating = filterRating === 'all' || f.rating === parseInt(filterRating);
    const matchesCategory = filterCategory === 'all' || f.category === filterCategory;
    return matchesRating && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Feedback Management</h1>
        <p className="text-muted-foreground mt-1">
          Monitor and analyze user feedback to improve the platform
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && stats.totalFeedback > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFeedback}</div>
              <p className="text-xs text-muted-foreground mt-1">responses received</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(stats.averageRating) ? 'fill-current' : ''}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Helpful Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.helpfulPercentage.toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground mt-1">found helpful</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.entries(stats.categoryDistribution).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">most common topic</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rating Distribution Chart */}
      {stats && stats.totalFeedback > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Breakdown of user ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingDistribution[rating] || 0;
                const percentage = (count / stats.totalFeedback) * 100;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium block mb-2">Filter by Rating</label>
          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label className="text-sm font-medium block mb-2">Filter by Category</label>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Feedback Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Feedback</CardTitle>
          <CardDescription>
            {filteredFeedback.length} of {feedbackList.length} feedback entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredFeedback.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No feedback found matching the selected filters.</AlertDescription>
            </Alert>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rating</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Helpful</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeedback.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={`${
                                i < feedback.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={CATEGORY_COLORS[feedback.category]}>
                          {CATEGORY_LABELS[feedback.category]}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{feedback.comment}</TableCell>
                      <TableCell>
                        {feedback.helpful === true && <Badge variant="outline">Helpful</Badge>}
                        {feedback.helpful === false && (
                          <Badge variant="outline" className="bg-red-50">
                            Not Helpful
                          </Badge>
                        )}
                        {feedback.helpful === null && (
                          <Badge variant="outline" className="bg-gray-50">
                            No Reply
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(feedback.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteFeedback(feedback.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
