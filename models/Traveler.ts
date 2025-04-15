export class Traveler {
    uid: string;
    fullName: string;
    email: string;
    role: 'Traveler';
  
    constructor(uid: string, fullName: string, email: string) {
      this.uid = uid;
      this.fullName = fullName;
      this.email = email;
      this.role = 'Traveler';
    }
  }
  