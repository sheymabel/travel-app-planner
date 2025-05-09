import axios from 'axios';
import { Service } from '../../Service/businessService';

export class ServiceUploadViewModel {
  async uploadService(businessId: string, service: Service): Promise<string> {
    try {
      const response = await axios.post(
        `https://localhost:4000/api/business/${businessId}/services`,
        service,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.statusText || 'Service uploaded successfully';
    } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        if (err.response?.data?.message) {
          throw new Error(err.response.data.message);
        }
        throw new Error('Failed to upload service');
      }
  }
}