export type category = 'restaurant' | 'retail' | 'services' | 'health_beauty' | 'entertainment' | 'other';
export class Business {
  userId: string;             // Firebase user ID of the business owner
  fullName: string;          // Full name of the business owner
  email: string;             // Business email address
  phone: string;             // Contact phone number
  address: string;
  role: 'Business';       
  category :category;   // Business physical address
  description: string;       // Short business description
  createdAt: string;   // User role, fixed for Business

  constructor(
    userId: string,
    fullName: string,
    email: string,
    phone: string,
    address: string,
    description: string,
    role: 'Business',
    category: 'restaurant' | 'retail' | 'services' | 'health_beauty' | 'entertainment' | 'other'
  ) {
    this.userId = userId;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.description = description;
    this.category = category;
    this.role = role;
  }
}
