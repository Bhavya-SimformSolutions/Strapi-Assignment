/**
 * Review Moderation Page
 * This is like an Angular component that displays a list of reviews
 */
import { useState, useEffect } from 'react';
import { 
  Main, 
  Box, 
  Typography, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Button,
  Badge,
  Flex,
  Loader
} from '@strapi/design-system';
import { CheckCircle, Trash } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { Page, useAPIErrorHandler, useFetchClient } from '@strapi/strapi/admin';

import { getTranslation } from '../utils/getTranslation';

// Define TypeScript interfaces (like Angular interfaces)
interface Review {
  id: number;
  reviewer_name: string;
  comment: string;
  rating: number;
  approved: boolean;
  product?: {
    id: number;
    name: string;
  };
  createdAt: string;
}

const HomePage = () => {
  const { formatMessage } = useIntl();
  const { formatAPIError } = useAPIErrorHandler();
  const { get, put } = useFetchClient(); // Strapi's authenticated HTTP client
  
  // React state (like Angular component properties)
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect is like Angular's ngOnInit
  useEffect(() => {
    fetchReviews();
  }, []); // Empty array means run only once when component loads

  /**
   * Fetch all reviews from our API
   * Like an Angular service method call
   */
  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use Strapi's authenticated fetch client
      // This automatically handles authentication headers
      const { data } = await get('/review-moderation/reviews');
      
      setReviews(data.data || []);
      
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      const errorMessage = formatAPIError(err) || 'Failed to load reviews';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Approve a review
   * Like an Angular click handler method
   */
  const handleApprove = async (reviewId: number) => {
    try {
      // Use Strapi's authenticated fetch client
      await put(`/review-moderation/reviews/${reviewId}/approve`);
      
      // Refresh the list after approval
      await fetchReviews();
      
    } catch (err: any) {
      console.error('Error approving review:', err);
      const errorMessage = formatAPIError(err) || 'Failed to approve review';
      alert(errorMessage);
    }
  };

  /**
   * Reject a review
   * Like an Angular click handler method
   */
  const handleReject = async (reviewId: number) => {
    try {
      // Use Strapi's authenticated fetch client
      await put(`/review-moderation/reviews/${reviewId}/reject`);
      
      // Refresh the list after rejection
      await fetchReviews();
      
    } catch (err: any) {
      console.error('Error rejecting review:', err);
      const errorMessage = formatAPIError(err) || 'Failed to reject review';
      alert(errorMessage);
    }
  };

  // Show loading state (like Angular *ngIf with loading condition)
  if (loading) {
    return (
      <Main>
        <Page.Title>Review Moderation</Page.Title>
        <Box padding={8}>
          <Flex justifyContent="center">
            <Loader>Loading reviews...</Loader>
          </Flex>
        </Box>
      </Main>
    );
  }

  // Show error state (like Angular *ngIf with error condition)
  if (error) {
    return (
      <Main>
        <Page.Title>Review Moderation</Page.Title>
        <Box padding={8}>
          <Typography variant="beta" textColor="danger600">
            {error}
          </Typography>
          <Button onClick={fetchReviews} marginTop={4}>
            Try Again
          </Button>
        </Box>
      </Main>
    );
  }

  // Main component render (like Angular template)
  return (
    <Main>
      <Page.Title>Review Moderation</Page.Title>
      
      <Box padding={8}>
        <Typography variant="alpha" marginBottom={4}>
          Review Moderation Dashboard
        </Typography>
        
        <Typography variant="omega" marginBottom={6}>
          Total Reviews: {reviews.length}
        </Typography>

        {/* Reviews Table - like Angular *ngFor in a table */}
        <Table colCount={6} rowCount={reviews.length}>
          <Thead>
            <Tr>
              <Th>Product</Th>
              <Th>Reviewer</Th>
              <Th>Rating</Th>
              <Th>Comment</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {reviews.map((review) => (
              <Tr key={review.id}>
                <Td>
                  <Typography>
                    {review.product?.name || 'Unknown Product'}
                  </Typography>
                </Td>
                <Td>
                  <Typography>{review.reviewer_name}</Typography>
                </Td>
                <Td>
                  <Typography>{review.rating}/5</Typography>
                </Td>
                <Td>
                  <Typography ellipsis>
                    {review.comment.length > 50 
                      ? `${review.comment.substring(0, 50)}...` 
                      : review.comment
                    }
                  </Typography>
                </Td>
                <Td>
                  <Badge 
                    backgroundColor={review.approved ? 'success100' : 'warning100'}
                    textColor={review.approved ? 'success600' : 'warning600'}
                  >
                    {review.approved ? 'Approved' : 'Pending'}
                  </Badge>
                </Td>
                <Td>
                  <Flex gap={2}>
                    {!review.approved && (
                      <Button
                        size="S"
                        variant="success"
                        startIcon={<CheckCircle />}
                        onClick={() => handleApprove(review.id)}
                      >
                        Approve
                      </Button>
                    )}
                    
                    {review.approved && (
                      <Button
                        size="S"
                        variant="danger"
                        startIcon={<Trash />}
                        onClick={() => handleReject(review.id)}
                      >
                        Reject
                      </Button>
                    )}
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Show message if no reviews */}
        {reviews.length === 0 && (
          <Box padding={4} background="neutral100" marginTop={4}>
            <Typography textAlign="center">
              No reviews found. Create some reviews to moderate them!
            </Typography>
          </Box>
        )}
      </Box>
    </Main>
  );
};

export { HomePage };
