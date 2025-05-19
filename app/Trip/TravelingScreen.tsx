import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import styles from '../../src/styles/create-trip/whosTravelingStyles';

const travelOptions = [
  {
    key: 'solo',
    title: 'Just Me',
    description: 'A sole traveler in exploration',
    icon: (props: any) => <MaterialIcons name="person-outline" {...props} />,
    color: '#3b82f6', // blue
  },
  {
    key: 'couple',
    title: 'A Couple',
    description: 'Two travelers in tandem',
    icon: (props: any) => <FontAwesome name="heart" {...props} />,
    color: '#ef4444', // red
  },
  {
    key: 'family',
    title: 'Family',
    description: 'A group of fun loving adventurers',
    icon: (props: any) => <FontAwesome5 name="users" {...props} />,
    color: '#10b981', // green
  },
  {
    key: 'friends',
    title: 'Friends',
    description: 'A bunch of thrill-seekers',
    icon: (props: any) => <Ionicons name="boat-outline" {...props} />,
    color: '#f59e0b', // amber
  },
];

export default function WhosTravelingScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();
  
  // Animation values
  const scaleValues = travelOptions.reduce((acc, option) => {
    acc[option.key] = new Animated.Value(1);
    return acc;
  }, {} as Record<string, Animated.Value>);
  
  const buttonOpacity = new Animated.Value(0);
  const buttonTranslateY = new Animated.Value(20);

  const handlePressIn = (key: string) => {
    Animated.spring(scaleValues[key], {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (key: string) => {
    Animated.spring(scaleValues[key], {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleSelect = (key: string) => {
    setSelected(key);
    
    if (!selected) {
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(buttonTranslateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleContinue = () => {
    if (selected) {
      Animated.sequence([
        Animated.spring(buttonTranslateY, {
          toValue: -10,
          useNativeDriver: true,
        }),
        Animated.spring(buttonTranslateY, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start(() => {
        router.push('/');
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Who's Traveling</Text>
        <Text style={styles.subtitle}>Choose your travelers</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.optionsContainer}
        showsVerticalScrollIndicator={false}
      >
        {travelOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selected === option.key;
          
          return (
            <Animated.View
              key={option.key}
              style={[
                {
                  transform: [{ scale: scaleValues[option.key] }],
                },
              ]}
            >
              <TouchableOpacity
                onPressIn={() => handlePressIn(option.key)}
                onPressOut={() => handlePressOut(option.key)}
                onPress={() => handleSelect(option.key)}
                activeOpacity={0.7}
                style={[
                  styles.card,
                  isSelected && styles.selectedCard,
                  isSelected && { borderColor: option.color },
                ]}
              >
                <View style={styles.cardContent}>
                  <View>
                    <Text style={styles.cardTitle}>{option.title}</Text>
                    <Text style={styles.cardDesc}>{option.description}</Text>
                  </View>
                  <Icon 
                    size={32} 
                    color={isSelected ? option.color : '#666'} 
                    solid={isSelected && option.key === 'couple'}
                  />
                </View>
                
                {isSelected && (
                  <Animated.View 
                    style={[
                      styles.selectionIndicator,
                      { backgroundColor: option.color },
                    ]}
                  />
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
      
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: buttonOpacity,
            transform: [{ translateY: buttonTranslateY }],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.continueButton, 
            !selected && styles.disabledButton,
            { backgroundColor: selected ? travelOptions.find(o => o.key === selected)?.color : '#ccc' }
          ]}
          disabled={!selected}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}