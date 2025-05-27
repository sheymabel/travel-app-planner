import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Button } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import {Styles } from '../../src/styles/business-owner/BusinessReviews.styles';
const businessReviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch reviews from an API or Firebase
    const fetchReviews = async () => {
      try {
        
        const response = await fetch('https://yourapi.com/reviews'); 
        const data = await response.json();
        setReviews(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load reviews');
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleReply = (reviewId: string) => {
    // Handle the logic to submit a reply to a review
    if (replyText.trim() === '') {
      setError('Reply cannot be empty.');
      return;
    }
    
    // Example logic to submit the reply
    // submitReplyToReview(reviewId, replyText); // Replace with actual API logic
    console.log(`Replying to review ${reviewId}: ${replyText}`);
    setReplyText('');
    setError('');
  };

  const renderReviewItem = ({ item }: { item: any }) => (
    <View style={Styles.reviewItem}>
      <View style={Styles.reviewHeader}>
        <Text style={Styles.customerName}>{item.customerName}</Text>
        <View style={Styles.starContainer}>
          {/* Add your custom star rating component here */}
          <Text>⭐⭐⭐⭐⭐</Text> {/* Placeholder for rating */}
        </View>
      </View>
      <Text style={Styles.reviewDate}>{item.date}</Text>
      <Text style={Styles.reviewComment}>{item.comment}</Text>

      {/* Reply section */}
      <View style={Styles.replyContainer}>
        <Text style={Styles.replyLabel}>Reply:</Text>
        <TextInput
          style={Styles.replyInput}
          placeholder="Write your reply..."
          value={replyText}
          onChangeText={setReplyText}
        />
        <View style={Styles.replyActions}>
          <TouchableOpacity
            style={[Styles.replyButton, Styles.cancelButton]}
            onPress={() => setReplyText('')}
          >
            <Text style={Styles.replyButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[Styles.replyButton, Styles.submitButton]}
            onPress={() => handleReply(item.id)}
          >
            <Text style={Styles.submitButtonText}>Submit Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={Styles.safeArea}>
        <ActivityIndicator size="large" color="#4f46e5" style={Styles.loadingIndicator} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={Styles.safeArea}>
        <Text style={Styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (reviews.length === 0) {
    return (
      <View style={Styles.safeArea}>
        <Text style={Styles.emptyText}>No reviews available.</Text>
      </View>
    );
  }

  return (
    <View style={Styles.safeArea}>
      <FlatList
        data={reviews}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={Styles.listContainer}
      />
    </View>
  );
};

export default businessReviews;
