// app/auth/BusinessOwner/BusinessReviews.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // For star ratings

// Mock data structure
interface Review {
  id: string;
  customerName: string;
  rating: number; // e.g., 1 to 5
  comment: string;
  date: string;
  reply?: string; // Optional reply from the business owner
}

const fetchReviews = async (): Promise<Review[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { id: 'rev1', customerName: 'Eve Davis', rating: 5, comment: 'Absolutely fantastic experience! Highly recommend the city tour.', date: '2024-08-10', reply: 'Thank you so much, Eve! We\'re thrilled you enjoyed it.' },
    { id: 'rev2', customerName: 'Frank Green', rating: 4, comment: 'Great hike, beautiful views. Guide was knowledgeable.', date: '2024-08-09' },
    { id: 'rev3', customerName: 'Grace Hall', rating: 3, comment: 'Kayaking was fun but the equipment felt a bit old.', date: '2024-08-08' },
    { id: 'rev4', customerName: 'Heidi White', rating: 5, comment: 'Best tour ever!', date: '2024-08-07', reply: 'Glad you loved it, Heidi!' },
  ];
};

const submitReplyAPI = async (reviewId: string, replyText: string): Promise<boolean> => {
  // Simulate API call
  console.log(`Submitting reply for review ${reviewId}: "${replyText}"`);
  await new Promise(resolve => setTimeout(resolve, 700));
  return Math.random() > 0.1; // 90% success rate
}

// Simple Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  const totalStars = 5;
  return (
    <View style={styles.starContainer}>
      {[...Array(totalStars)].map((_, index) => {
        const isActive = index < rating;
        return (
          <Ionicons
            key={index}
            name={isActive ? 'star' : 'star-outline'}
            size={16}
            color={isActive ? '#f59e0b' : '#d1d5db'} // Amber for active, gray for inactive
          />
        );
      })}
    </View>
  );
};


export default function BusinessReviewsScreen() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null); // ID of review being replied to
  const [replyText, setReplyText] = useState('');

  const loadReviews = () => {
    setLoading(true);
    fetchReviews()
      .then(data => {
        setReviews(data);
        setError(null);
      })
      .catch(err => {
        console.error("Failed to fetch reviews:", err);
        setError("Could not load reviews.");
        setReviews([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleStartReply = (reviewId: string) => {
    setReplyingTo(reviewId);
    setReplyText(''); // Clear previous text
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
    Keyboard.dismiss();
  };

  const handleReplySubmit = async (reviewId: string) => {
    if (!replyText.trim()) {
      Alert.alert("Error", "Reply cannot be empty.");
      return;
    }

    Keyboard.dismiss();
    const success = await submitReplyAPI(reviewId, replyText);

    if (success) {
      setReviews(prev =>
        prev.map(r => (r.id === reviewId ? { ...r, reply: replyText } : r))
      );
      Alert.alert("Success", "Reply submitted.");
      setReplyingTo(null); // Close reply input
      setReplyText('');
    } else {
      Alert.alert("Error", "Failed to submit reply. Please try again.");
    }
  };

  const renderReviewItem = ({ item }: { item: Review }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <StarRating rating={item.rating} />
      </View>
      <Text style={styles.reviewDate}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.reviewComment}>{item.comment}</Text>

      {item.reply ? (
        <View style={styles.replyContainer}>
          <Text style={styles.replyLabel}>Your Reply:</Text>
          <Text style={styles.replyText}>{item.reply}</Text>
        </View>
      ) : replyingTo === item.id ? (
        // Reply Input Area
        <View style={styles.replyInputContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder="Write your reply..."
            value={replyText}
            onChangeText={setReplyText}
            multiline
          />
          <View style={styles.replyActions}>
            <TouchableOpacity onPress={handleCancelReply} style={[styles.replyButton, styles.cancelButton]}>
              <Text style={styles.replyButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleReplySubmit(item.id)} style={[styles.replyButton, styles.submitButton]}>
              <Text style={[styles.replyButtonText, styles.submitButtonText]}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Show Reply Button
        <TouchableOpacity onPress={() => handleStartReply(item.id)} style={styles.startReplyButton}>
          <Ionicons name="chatbubble-ellipses-outline" size={18} color="#4f46e5" />
          <Text style={styles.startReplyButtonText}>Reply</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      {loading && !reviews.length ? (
        <ActivityIndicator size="large" color="#4f46e5" style={styles.loadingIndicator} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={reviews}
          renderItem={renderReviewItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>No reviews found yet.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 15,
  },
  loadingIndicator: {
    marginTop: 50,
  },
  reviewItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  starContainer: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 10,
  },
  replyContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f3f4f6', // Slightly different background for reply
    padding: 10,
    borderRadius: 6,
  },
  replyLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 4,
  },
  replyText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 19,
  },
  startReplyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#eef2ff', // Light indigo background
    borderRadius: 6,
    alignSelf: 'flex-start', // Button size wraps content
  },
  startReplyButtonText: {
    marginLeft: 6,
    color: '#4f46e5', // Indigo text
    fontWeight: '500',
    fontSize: 14,
  },
  replyInputContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  replyInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    minHeight: 60, // Allow for multi-line input
    textAlignVertical: 'top', // Align text to top for multiline
    marginBottom: 10,
  },
  replyActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align buttons to the right
  },
  replyButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginLeft: 10, // Space between buttons
  },
  cancelButton: {
    backgroundColor: '#f3f4f6', // Light gray
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  submitButton: {
    backgroundColor: '#4f46e5', // Indigo
  },
  replyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151', // Default text color
  },
  submitButtonText: {
    color: '#fff', // White text for submit button
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 15,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#6b7280',
  },
});
