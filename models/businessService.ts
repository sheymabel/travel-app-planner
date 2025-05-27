// services/businessService.ts
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../configs/FirebaseConfig';

export async function getbusinessById(userId: string) {
  const businessRef = doc(db, 'business', userId);

  try {
    const docSnap = await getDoc(businessRef);
    if (docSnap.exists()) {
      return docSnap.data(); // business object
    } else {
      console.log('❌ No business found with this userId.');
      return null;
    }
  } catch (error) {
    console.error('🔥 Error fetching business:', error);
    return null;
  }
}
