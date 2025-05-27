export interface ServiceFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string[]; // <-- utiliser string[] au lieu de string
  businessId: string;
}
