export class Business {
  uid: string;               // Firebase user ID of the business owner
  fullName: string;          // Full name of the business owner
  email: string;             // Business email address
  phone: string;             // Contact phone number
  address: string;           // Business physical address
  description: string;       // Short business description
  category: 'restaurant' | 'retail' | 'services' | 'health_beauty' | 'entertainment' | 'other'; // Business category
  role: 'Business-Owner';    // User role, fixed for Business

  constructor(
    uid: string,
    fullName: string,
    email: string,
    phone: string,
    address: string,
    description: string,
    category: 'restaurant' | 'retail' | 'services' | 'health_beauty' | 'entertainment' | 'other'
  ) {
    this.uid = uid;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.description = description;
    this.category = category;
    this.role = 'Business-Owner';
  }
}
