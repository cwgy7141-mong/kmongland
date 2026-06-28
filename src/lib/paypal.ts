// ============================================================
// PayPal Configuration — @paypal/react-paypal-js 기반
// ============================================================
// 
// 설정 방법:
// 1. https://developer.paypal.com/dashboard 에서 앱 생성
// 2. Client ID를 .env 파일에 넣기:
//    VITE_PAYPAL_CLIENT_ID=실제_클라이언트_ID
// 3. 프로덕션: VITE_PAYPAL_CLIENT_ID에 Live Client ID 사용
//
// ============================================================

export const PAYPAL_CONFIG = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
  currency: 'USD',
  intent: 'capture' as const,
};

// ── 상품 타입 정의 ──

export interface PayPalProduct {
  id: string;
  name: string;
  description: string;
  price: string; // '29.99' 형식
  currency: string;
}

// ── 구독 플랜 타입 정의 ──

export interface PayPalSubscriptionPlan {
  id: string;
  name: string;
  description: string;
  planId: string; // PayPal에서 생성한 구독 Plan ID
  price: string;
  currency: string;
  interval: 'MONTH' | 'YEAR';
}

// ── 예시 상품 목록 ──

export const PRODUCTS: PayPalProduct[] = [
  {
    id: 'kmongland-free-pass',
    name: 'Free Experience Pass',
    description: 'Free entry-level Korean course to learn basic Hangeul and greetings.',
    price: '0.00',
    currency: 'USD',
  },
  {
    id: 'kmongland-standard-pass',
    name: 'Standard Study Pass (4 Weeks)',
    description: 'Structured intermediate class with regular schedule and standard curriculum.',
    price: '70.00',
    currency: 'USD',
  },
  {
    id: 'kmongland-intensive-pass',
    name: 'Intensive Master Pass (4 Weeks)',
    description: 'Accelerated daily immersive learning program for rapid fluency.',
    price: '100.00',
    currency: 'USD',
  },
];

// ── 예시 구독 플랜 ──

export const SUBSCRIPTION_PLANS: PayPalSubscriptionPlan[] = [
  {
    id: 'kmongland-monthly-membership',
    name: 'k-mong-land Monthly Speech Club',
    description: 'Monthly access to live small-group conversation sessions with certified native speakers.',
    planId: 'YOUR_PAYPAL_PLAN_ID', // PayPal에서 생성한 구독 플랜 ID
    price: '19.00',
    currency: 'USD',
    interval: 'MONTH',
  },
  {
    id: 'kmongland-annual-gold-pass',
    name: 'k-mong-land Annual Gold Pass',
    description: 'Year-round access to all learning materials, weekly personalized progress reports, and certification exams.',
    planId: 'YOUR_PAYPAL_YEARLY_PLAN_ID',
    price: '199.00',
    currency: 'USD',
    interval: 'YEAR',
  },
];
