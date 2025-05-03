import { db } from '../configs/FirebaseConfig';  // Import Firebase config
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';

export type Category = 'restaurant' | 'retail' | 'services' | 'health_beauty' | 'entertainment' | 'other';

export class Business {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  category: Category;
  description: string;
  createdAt: string;
  role: 'business';

  constructor(
    userId: string,
    fullName: string,
    email: string,
    phone: string,
    address: string,
    description: string,
    category: Category
  ) {
    this.userId = userId;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.category = category;
    this.description = description;
    this.role = 'business';  // Always fixed as 'Business'
    this.createdAt = new Date().toISOString();  // Set current timestamp
  }

  // Function to save the business to Firestore
  async saveToFirestore() {
    const businessRef = doc(db, 'business', this.userId);  // Use userId as document ID
    const businessData = {
      ...this,
      createdAt: Timestamp.fromDate(new Date(this.createdAt)),  // Convert createdAt to Firebase Timestamp
    };

    try {
      await setDoc(businessRef, businessData);  // Save to Firestore
      console.log('Business saved successfully');
    } catch (error) {
      console.error('Error saving business:', error);
    }
  }
}
