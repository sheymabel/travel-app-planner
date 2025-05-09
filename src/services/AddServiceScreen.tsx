
import { RouteProp, useRoute } from '@react-navigation/native';

type RootStackParamList = {
  AddService: { businessId: string };
};

type AddServiceRouteProp = RouteProp<RootStackParamList, 'AddService'>;
