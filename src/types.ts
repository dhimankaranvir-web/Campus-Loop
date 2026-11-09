export type ProductCategory = 'textbooks' | 'furniture' | 'kitchenware' | 'ingredients';

export type ProductCondition = 'Brand New' | 'Like New' | 'Good' | 'Acceptable';

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  campus: string;
  university: string;
  rating: number;
  reviewsCount: number;
  isEduVerified: boolean;
  graduationYear?: string;
  responseTime: string;
}

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  authorCampus: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  dormLocation?: string;
}

export interface Product {
  id: string;
  title: string;
  category: ProductCategory;
  subcategory: string;
  price: number;
  originalPrice?: number;
  condition: ProductCondition;
  image: string;
  seller: Seller;
  description: string;
  location: string;
  isNegotiable?: boolean;
  isbn?: string;
  inStock: boolean;
  stockCount: number;
  tags: string[];
  dateAdded: string;
  distanceMiles?: number;
  reviews?: Review[];
}

export type IngredientCategory = 'protein' | 'carb' | 'veggie' | 'flavor' | 'dairy' | 'snack';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  price: number;
  unit: string;
  emoji: string;
  calories: number;
  studentTip: string;
  shelfLife: string;
}

export interface Recipe {
  id: string;
  title: string;
  cookTime: string;
  difficulty: 'Super Easy (5-10m)' | 'Quick Dorm (15m)' | 'Budget Feast (25m)';
  requiredEquipment: string;
  matchingIngredientIds: string[];
  missingIngredientIds?: string[];
  optionalAddons: string[];
  estCostPerServing: number;
  calories: number;
  studentSecret: string;
  instructions: string[];
  tags: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  category: ProductCategory;
  condition?: ProductCondition;
  sellerName?: string;
}

export interface Subscription {
  id: string;
  title: string;
  tag: string;
  description: string;
  frequency: 'Weekly' | 'Bi-Weekly' | 'Monthly';
  price: number;
  nextDeliveryDate: string;
  status: 'Active' | 'Paused' | 'Skipped Next';
  includedItems: string[];
  deliveryLocation: string;
  billingMethod: string;
  category: string;
}

export interface NotificationItem {
  id: string;
  type: 'order' | 'deal' | 'message' | 'system';
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  university: string;
  dormBuilding: string;
  isEduVerified: boolean;
  studentIdLast4: string;
  karmaPoints: number;
  savedCardLast4: string;
  flexCardBalance: number;
  twoFactorEnabled: boolean;
  safetyScore: number;
}
