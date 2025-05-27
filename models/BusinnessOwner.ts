import { db } from '../configs/FirebaseConfig';  // Import Firebase config
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';

export type Category =
  | 'utility_services'
  | 'professional_services'
  | 'aesthetic_design'
  | 'artistic_creations'
  | 'artisanal_crafts'
  | 'performance_arts'
  | 'cultural_heritage'
  | 'indigenous_arts'
  | 'religious_symbolic'
  | 'gastronomy'
  | 'retail_boutique'
  | 'wellness_spa'
  | 'other';

export class business {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  category: Category;
  description: string;

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
  }

  // Function to save the business to Firestore
  async saveToFirestore() {
    const businessRef = doc(db, 'business', this.userId);  // Use userId as document ID
    const businessData = {
      ...this,
    };

    try {
      await setDoc(businessRef, businessData);  // Save to Firestore
      console.log('business saved successfully');
    } catch (error) {
      console.error('Error saving business:', error);
    }
  }
}
