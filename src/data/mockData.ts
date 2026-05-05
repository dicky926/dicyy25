import { SalesData } from '../types';

export const INITIAL_SALES_DATA: SalesData[] = [
  { id: '1', product: 'Rice', category: 'Staple', customerType: 'Regular', purchaseTime: 'Morning', stockLevel: 'High', outcome: 'High' },
  { id: '2', product: 'Rice', category: 'Staple', customerType: 'Occasional', purchaseTime: 'Afternoon', stockLevel: 'Medium', outcome: 'Medium' },
  { id: '3', product: 'Cooking Oil', category: 'Cooking', customerType: 'Regular', purchaseTime: 'Evening', stockLevel: 'High', outcome: 'High' },
  { id: '4', product: 'Sugar', category: 'Cooking', customerType: 'New', purchaseTime: 'Morning', stockLevel: 'Low', outcome: 'Low' },
  { id: '5', product: 'Flour', category: 'Baking', customerType: 'Regular', purchaseTime: 'Afternoon', stockLevel: 'Medium', outcome: 'Medium' },
  { id: '6', product: 'Eggs', category: 'Protein', customerType: 'Regular', purchaseTime: 'Morning', stockLevel: 'High', outcome: 'High' },
  { id: '7', product: 'Rice', category: 'Staple', customerType: 'Regular', purchaseTime: 'Evening', stockLevel: 'Low', outcome: 'Medium' },
  { id: '8', product: 'Cooking Oil', category: 'Cooking', customerType: 'Occasional', purchaseTime: 'Morning', stockLevel: 'Medium', outcome: 'High' },
  { id: '9', product: 'Sugar', category: 'Cooking', customerType: 'Regular', purchaseTime: 'Afternoon', stockLevel: 'High', outcome: 'High' },
  { id: '10', product: 'Flour', category: 'Baking', customerType: 'New', purchaseTime: 'Evening', stockLevel: 'Medium', outcome: 'Low' },
  { id: '11', product: 'Eggs', category: 'Protein', customerType: 'Occasional', purchaseTime: 'Afternoon', stockLevel: 'Low', outcome: 'Medium' },
  { id: '12', product: 'Rice', category: 'Staple', customerType: 'Regular', purchaseTime: 'Morning', stockLevel: 'Medium', outcome: 'High' },
  { id: '13', product: 'Cooking Oil', category: 'Cooking', customerType: 'Regular', purchaseTime: 'Evening', stockLevel: 'High', outcome: 'High' },
  { id: '14', product: 'Sugar', category: 'Cooking', customerType: 'Occasional', purchaseTime: 'Morning', stockLevel: 'Low', outcome: 'Low' },
  { id: '15', product: 'Eggs', category: 'Protein', purchaseTime: 'Evening', stockLevel: 'Medium', customerType: 'Regular', outcome: 'High' },
  { id: '16', product: 'Rice', category: 'Staple', customerType: 'New', purchaseTime: 'Afternoon', stockLevel: 'High', outcome: 'Medium' },
  { id: '17', product: 'Flour', category: 'Baking', customerType: 'Regular', purchaseTime: 'Morning', stockLevel: 'High', outcome: 'High' },
  { id: '18', product: 'Cooking Oil', category: 'Cooking', customerType: 'Regular', purchaseTime: 'Afternoon', stockLevel: 'Medium', outcome: 'Medium' },
  { id: '19', product: 'Sugar', category: 'Cooking', customerType: 'New', purchaseTime: 'Evening', stockLevel: 'Low', outcome: 'Low' },
  { id: '20', product: 'Rice', category: 'Staple', customerType: 'Occasional', purchaseTime: 'Morning', stockLevel: 'Medium', outcome: 'Medium' },
];

export const PRODUCTS = ['Rice', 'Cooking Oil', 'Sugar', 'Flour', 'Eggs'];
export const CATEGORIES = ['Staple', 'Cooking', 'Baking', 'Protein'];
export const CUSTOMER_TYPES = ['Regular', 'Occasional', 'New'];
export const PURCHASE_TIMES = ['Morning', 'Afternoon', 'Evening'];
export const STOCK_LEVELS = ['High', 'Medium', 'Low'];
export const OUTCOMES = ['High', 'Medium', 'Low'];
