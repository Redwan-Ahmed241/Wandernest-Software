# Dashboard Page API Requirements - Wandernest Travel Platform

## 📊 Overview

This document outlines all API requirements for the Wandernest Dashboard page, including user data, travel statistics, booking management, and real-time updates needed for a comprehensive travel dashboard experience.

## 🎯 Dashboard Page Components Analysis

Based on the Dashboard structure, here are the complete API requirements:

## 🔐 1. User Authentication & Profile APIs

### **1.1 User Profile Information**
```typescript
GET /api/users/profile
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "first_name": "Yakub",
    "last_name": "Ahmed",
    "username": "yakub_traveler",
    "email": "yakub@example.com",
    "phone": "+880123456789",
    "profile_image": "https://example.com/avatar.jpg",
    "membership_level": "Gold",
    "join_date": "2023-01-15T00:00:00Z",
    "preferences": {
      "currency": "USD",
      "language": "en",
      "timezone": "Asia/Dhaka",
      "notifications_enabled": true
    },
    "verification": {
      "email_verified": true,
      "phone_verified": true,
      "identity_verified": false
    }
  }
}
```

### **1.2 User Statistics**
```typescript
GET /api/users/stats
```
**Response:**
```json
{
  "success": true,
  "data": {
    "total_trips": 12,
    "countries_visited": 8,
    "cities_visited": 25,
    "total_bookings": 45,
    "total_spent": 15750.50,
    "loyalty_points": 2340,
    "traveler_level": "Explorer",
    "badges": [
      {
        "id": "first_flight",
        "name": "First Flight",
        "icon": "✈️",
        "earned_date": "2023-02-01"
      }
    ]
  }
}
```

## 🎫 2. Booking Management APIs

### **2.1 Active/Upcoming Bookings**
```typescript
GET /api/bookings/active
```
**Response:**
```json
{
  "success": true,
  "data": {
    "upcoming_trips": [
      {
        "id": "booking_456",
        "type": "flight",
        "status": "confirmed",
        "departure_date": "2024-11-15T10:30:00Z",
        "destination": {
          "city": "Paris",
          "country": "France",
          "airport_code": "CDG"
        },
        "booking_reference": "WN789456",
        "total_amount": 850.00,
        "currency": "USD",
        "details": {
          "flight_number": "AF123",
          "airline": "Air France",
          "departure_city": "Dhaka",
          "arrival_time": "2024-11-15T18:45:00Z"
        }
      }
    ],
    "active_hotels": [
      {
        "id": "hotel_789",
        "name": "Grand Hotel Paris",
        "check_in": "2024-11-15",
        "check_out": "2024-11-20",
        "nights": 5,
        "room_type": "Deluxe Suite",
        "booking_reference": "WN456789",
        "total_amount": 1250.00
      }
    ],
    "car_rentals": [],
    "packages": []
  }
}
```

### **2.2 Booking History**
```typescript
GET /api/bookings/history?page=1&limit=10&type=all
```
**Response:**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "booking_123",
        "type": "flight",
        "status": "completed",
        "booking_date": "2024-01-15T09:00:00Z",
        "travel_date": "2024-02-01T14:30:00Z",
        "destination": "London, UK",
        "total_amount": 650.00,
        "rating": 4.5,
        "review_status": "reviewed"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_count": 45,
      "has_next": true
    }
  }
}
```

## 🏷️ 3. Travel Preferences & Wishlist APIs

### **3.1 Saved Destinations (Wishlist)**
```typescript
GET /api/users/wishlist
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "dest_123",
      "name": "Bali, Indonesia",
      "image": "https://example.com/bali.jpg",
      "estimated_cost": 1200,
      "best_time_to_visit": "April - October",
      "added_date": "2024-01-20T00:00:00Z",
      "price_alerts_enabled": true
    }
  ]
}
```

### **3.2 Travel Preferences**
```typescript
GET /api/users/travel-preferences
PUT /api/users/travel-preferences
```
**Response:**
```json
{
  "success": true,
  "data": {
    "budget_range": {
      "min": 500,
      "max": 2000,
      "currency": "USD"
    },
    "preferred_destinations": ["Europe", "Southeast Asia"],
    "travel_style": "Adventure",
    "group_size": "Solo",
    "accommodation_type": ["Hotel", "Resort"],
    "transportation": ["Flight", "Train"],
    "interests": ["Culture", "Nature", "Food", "History"],
    "dietary_restrictions": ["Vegetarian"],
    "accessibility_needs": []
  }
}
```

## 📈 4. Dashboard Analytics APIs

### **4.1 Travel Analytics**
```typescript
GET /api/analytics/travel-stats?period=12months
```
**Response:**
```json
{
  "success": true,
  "data": {
    "spending_by_month": [
      {
        "month": "2024-01",
        "amount": 1200.00,
        "bookings_count": 3
      }
    ],
    "spending_by_category": {
      "flights": 8500.00,
      "hotels": 5200.00,
      "packages": 2050.00,
      "activities": 1200.00
    },
    "popular_destinations": [
      {
        "country": "Thailand",
        "visits": 3,
        "total_spent": 2400.00
      }
    ],
    "travel_frequency": {
      "trips_per_year": 8,
      "average_trip_duration": 7,
      "longest_trip": 21,
      "shortest_trip": 2
    }
  }
}
```

### **4.2 Savings & Budget Tracking**
```typescript
GET /api/analytics/budget-tracking
```
**Response:**
```json
{
  "success": true,
  "data": {
    "current_budget": {
      "monthly_limit": 2000.00,
      "spent_this_month": 850.00,
      "remaining": 1150.00,
      "percentage_used": 42.5
    },
    "savings_goals": [
      {
        "id": "goal_123",
        "name": "Japan Trip 2025",
        "target_amount": 5000.00,
        "saved_amount": 2300.00,
        "target_date": "2025-03-01",
        "monthly_contribution": 400.00
      }
    ],
    "spending_alerts": [
      {
        "type": "budget_warning",
        "message": "You've spent 80% of your monthly travel budget",
        "threshold": 80,
        "current": 85
      }
    ]
  }
}
```

## 🔔 5. Notifications & Alerts APIs

### **5.1 Recent Notifications**
```typescript
GET /api/notifications?limit=10&status=unread
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "notif_123",
      "type": "booking_confirmation",
      "title": "Flight Booking Confirmed",
      "message": "Your flight to Paris has been confirmed. Booking reference: WN789456",
      "created_at": "2024-10-02T10:30:00Z",
      "is_read": false,
      "action_url": "/bookings/booking_456",
      "importance": "high"
    }
  ],
  "unread_count": 5
}
```

### **5.2 Price Alerts**
```typescript
GET /api/alerts/price-drops
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "alert_123",
      "destination": "Tokyo, Japan",
      "current_price": 890.00,
      "original_price": 1200.00,
      "discount_percentage": 25.8,
      "valid_until": "2024-10-10T23:59:59Z",
      "booking_url": "/flights/search?dest=tokyo"
    }
  ]
}
```

## 🎁 6. Recommendations & Personalization APIs

### **6.1 Personalized Recommendations**
```typescript
GET /api/recommendations/dashboard
```
**Response:**
```json
{
  "success": true,
  "data": {
    "destinations": [
      {
        "id": "dest_456",
        "name": "Santorini, Greece",
        "image": "https://example.com/santorini.jpg",
        "price_from": 899.00,
        "rating": 4.8,
        "reason": "Based on your interest in Mediterranean destinations",
        "discount": 15,
        "popular_months": ["May", "June", "September"]
      }
    ],
    "packages": [
      {
        "id": "package_789",
        "title": "7-Day Cultural Tour of Morocco",
        "price": 1450.00,
        "original_price": 1650.00,
        "rating": 4.6,
        "duration": "7 days",
        "highlights": ["Marrakech", "Fez", "Sahara Desert"]
      }
    ],
    "activities": [
      {
        "id": "activity_123",
        "name": "Northern Lights Tour - Iceland",
        "price": 299.00,
        "location": "Reykjavik, Iceland",
        "rating": 4.9,
        "availability": "Limited spots available"
      }
    ]
  }
}
```

### **6.2 Trending Destinations**
```typescript
GET /api/destinations/trending?limit=6
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "dest_trending_1",
      "name": "Dubai, UAE",
      "country": "United Arab Emirates",
      "image": "https://example.com/dubai.jpg",
      "trend_score": 95,
      "price_trend": "stable",
      "popularity_change": "+15%",
      "best_deals_count": 12
    }
  ]
}
```

## 💳 7. Payment & Financial APIs

### **7.1 Payment Methods**
```typescript
GET /api/users/payment-methods
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "pm_123",
      "type": "credit_card",
      "brand": "Visa",
      "last_four": "4242",
      "expiry_month": 12,
      "expiry_year": 2027,
      "is_default": true,
      "billing_address": {
        "country": "Bangladesh",
        "city": "Dhaka"
      }
    }
  ]
}
```

### **7.2 Recent Transactions**
```typescript
GET /api/transactions/recent?limit=10
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "txn_123",
      "booking_id": "booking_456",
      "amount": 850.00,
      "currency": "USD",
      "status": "completed",
      "transaction_date": "2024-10-01T14:30:00Z",
      "description": "Flight booking to Paris",
      "payment_method": "Visa ending in 4242"
    }
  ]
}
```

## 🎫 8. Loyalty & Rewards APIs

### **8.1 Loyalty Points Status**
```typescript
GET /api/loyalty/status
```
**Response:**
```json
{
  "success": true,
  "data": {
    "current_points": 2340,
    "points_to_next_tier": 660,
    "current_tier": "Gold",
    "next_tier": "Platinum",
    "tier_benefits": [
      "Free seat selection",
      "Priority check-in",
      "Lounge access"
    ],
    "points_expiring_soon": {
      "amount": 150,
      "expiry_date": "2024-12-31"
    }
  }
}
```

### **8.2 Available Rewards**
```typescript
GET /api/loyalty/rewards?category=all
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "reward_123",
      "title": "Free Domestic Flight",
      "description": "Redeem for any domestic flight within Bangladesh",
      "points_required": 1500,
      "category": "flights",
      "validity": "6 months from redemption",
      "terms_url": "/terms/reward_123"
    }
  ]
}
```

## 🌤️ 9. Travel Information APIs

### **9.1 Weather Information**
```typescript
GET /api/weather/destinations?destinations=["paris","london"]
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "city": "Paris",
      "country": "France",
      "current": {
        "temperature": 18,
        "condition": "Partly Cloudy",
        "humidity": 65,
        "wind_speed": 12
      },
      "forecast": [
        {
          "date": "2024-10-03",
          "high": 22,
          "low": 14,
          "condition": "Sunny"
        }
      ]
    }
  ]
}
```

### **9.2 Travel Advisories**
```typescript
GET /api/travel/advisories?destinations=["france","uk"]
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "country": "France",
      "advisory_level": "normal",
      "last_updated": "2024-10-01T00:00:00Z",
      "summary": "No current travel restrictions",
      "details": {
        "covid_requirements": "None",
        "visa_requirements": "Tourist visa not required for stays under 90 days",
        "health_recommendations": ["Routine vaccines up to date"]
      }
    }
  ]
}
```

## 🔄 10. Quick Actions APIs

### **10.1 Quick Booking Search**
```typescript
POST /api/quick-search/flights
```
**Request:**
```json
{
  "origin": "DAC",
  "destination": "CDG",
  "departure_date": "2024-11-15",
  "return_date": "2024-11-22",
  "passengers": 1,
  "class": "economy"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "search_id": "search_123",
    "results_count": 25,
    "cheapest_price": 850.00,
    "fastest_duration": "8h 45m",
    "recommended_flights": [
      {
        "id": "flight_456",
        "airline": "Air France",
        "flight_number": "AF123",
        "departure": {
          "time": "10:30",
          "airport": "DAC",
          "city": "Dhaka"
        },
        "arrival": {
          "time": "18:45",
          "airport": "CDG",
          "city": "Paris"
        },
        "duration": "8h 45m",
        "price": 850.00,
        "currency": "USD",
        "stops": 0,
        "booking_class": "economy"
      }
    ]
  }
}
```

### **10.2 Saved Searches**
```typescript
GET /api/users/saved-searches
POST /api/users/saved-searches
DELETE /api/users/saved-searches/{id}
```
**GET Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "search_saved_123",
      "name": "Weekend Trip to Bangkok",
      "type": "flight",
      "parameters": {
        "origin": "DAC",
        "destination": "BKK",
        "departure_date": "flexible",
        "passengers": 2,
        "class": "economy"
      },
      "price_alerts_enabled": true,
      "created_date": "2024-09-15T00:00:00Z",
      "last_checked": "2024-10-01T12:00:00Z"
    }
  ]
}
```

## 📱 11. Real-time Updates APIs

### **11.1 Dashboard Live Updates (WebSocket)**
```typescript
// WebSocket connection: wss://api.wandernest.com/ws/dashboard
// Connection with JWT token authentication

// Booking Status Updates
{
  "type": "booking_update",
  "timestamp": "2024-10-02T10:30:00Z",
  "data": {
    "booking_id": "booking_456",
    "status": "confirmed",
    "message": "Your flight booking has been confirmed",
    "action_required": false
  }
}

// Price Alert Notifications
{
  "type": "price_alert",
  "timestamp": "2024-10-02T11:15:00Z",
  "data": {
    "alert_id": "alert_123",
    "destination": "Tokyo, Japan",
    "new_price": 850.00,
    "old_price": 950.00,
    "savings": 100.00,
    "savings_percentage": 10.5,
    "valid_until": "2024-10-10T23:59:59Z"
  }
}

// System Notifications
{
  "type": "system_notification",
  "timestamp": "2024-10-02T12:00:00Z",
  "data": {
    "title": "Maintenance Notice",
    "message": "Scheduled maintenance on Oct 5, 2024 from 2:00 AM - 4:00 AM UTC",
    "importance": "medium",
    "action_url": "/maintenance-info"
  }
}

// Travel Reminders
{
  "type": "travel_reminder",
  "timestamp": "2024-10-02T09:00:00Z",
  "data": {
    "booking_id": "booking_456",
    "reminder_type": "check_in_available",
    "message": "Check-in is now available for your flight to Paris",
    "action_url": "/bookings/booking_456/checkin",
    "time_sensitive": true
  }
}
```

### **11.2 Real-time Chat Support**
```typescript
// WebSocket for customer support chat
// Connection: wss://api.wandernest.com/ws/support

{
  "type": "support_message",
  "data": {
    "message_id": "msg_123",
    "sender": "agent",
    "sender_name": "Sarah",
    "message": "Hello! How can I help you with your travel plans today?",
    "timestamp": "2024-10-02T10:30:00Z",
    "attachments": []
  }
}
```

## 🔐 12. Security & Privacy APIs

### **12.1 Security Settings**
```typescript
GET /api/users/security-settings
PUT /api/users/security-settings
```
**Response:**
```json
{
  "success": true,
  "data": {
    "two_factor_enabled": true,
    "login_notifications": true,
    "device_management": {
      "trusted_devices": [
        {
          "id": "device_123",
          "name": "iPhone 14 Pro",
          "last_used": "2024-10-02T08:30:00Z",
          "location": "Dhaka, Bangladesh",
          "is_current": true
        }
      ]
    },
    "recent_logins": [
      {
        "timestamp": "2024-10-02T08:30:00Z",
        "ip_address": "203.112.xxx.xxx",
        "location": "Dhaka, Bangladesh",
        "device": "iPhone 14 Pro",
        "success": true
      }
    ],
    "password_last_changed": "2024-09-15T00:00:00Z",
    "account_lockout": {
      "failed_attempts": 0,
      "locked_until": null
    }
  }
}
```

### **12.2 Privacy Preferences**
```typescript
GET /api/users/privacy-settings
PUT /api/users/privacy-settings
```
**Response:**
```json
{
  "success": true,
  "data": {
    "profile_visibility": "friends_only",
    "data_sharing": {
      "analytics": true,
      "marketing": false,
      "third_party": false
    },
    "communication_preferences": {
      "email_notifications": true,
      "sms_notifications": false,
      "push_notifications": true,
      "newsletter": true
    },
    "data_retention": {
      "keep_search_history": true,
      "keep_booking_history": true,
      "auto_delete_after": "never"
    },
    "cookies_consent": {
      "necessary": true,
      "analytics": true,
      "marketing": false,
      "preferences": true
    }
  }
}
```

## 🔒 13. Data Export & Download APIs

### **13.1 Export User Data**
```typescript
POST /api/users/export-data
GET /api/users/export-data/{export_id}/download
```
**POST Response:**
```json
{
  "success": true,
  "data": {
    "export_id": "export_123",
    "status": "processing",
    "estimated_completion": "2024-10-02T11:00:00Z",
    "data_types": ["profile", "bookings", "preferences", "transactions"],
    "file_format": "json"
  }
}
```

### **13.2 Download Booking Documents**
```typescript
GET /api/bookings/{booking_id}/documents
GET /api/bookings/{booking_id}/documents/{document_type}/download
```
**Response:**
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "type": "ticket",
        "name": "Flight Ticket - Paris",
        "size": "245KB",
        "format": "PDF",
        "download_url": "/api/bookings/booking_456/documents/ticket/download",
        "expires_at": "2024-10-09T00:00:00Z"
      }
    ]
  }
}
```

## 📊 14. API Integration Requirements

### **14.1 Error Handling**
All APIs should return consistent error responses:
```json
{
  "success": false,
  "error": {
    "code": "BOOKING_NOT_FOUND",
    "message": "The requested booking could not be found",
    "details": "Booking ID booking_999 does not exist or has been cancelled",
    "timestamp": "2024-10-02T10:30:00Z",
    "request_id": "req_123456789"
  }
}
```

### **14.2 Rate Limiting**
- **User APIs**: 100 requests per minute per user
- **Analytics APIs**: 20 requests per minute per user
- **Search APIs**: 50 requests per minute per user
- **Real-time APIs**: 1000 messages per minute per user
- **Export APIs**: 5 requests per hour per user

### **14.3 Authentication**
All APIs require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

**Token Refresh:**
```typescript
POST /api/auth/refresh
```
**Request:**
```json
{
  "refresh_token": "refresh_token_here"
}
```

### **14.4 Caching Strategy**
- **User Profile**: Cache for 5 minutes
- **Booking Data**: Cache for 1 minute
- **Analytics**: Cache for 15 minutes
- **Recommendations**: Cache for 30 minutes
- **Static Data**: Cache for 1 hour
- **Weather Data**: Cache for 10 minutes

### **14.5 Pagination Standards**
All list endpoints should follow consistent pagination:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total_pages": 10,
    "total_count": 200,
    "has_next": true,
    "has_previous": false,
    "next_page": 2,
    "previous_page": null
  }
}
```

### **14.6 API Versioning**
- Base URL: `https://api.wandernest.com/v1/`
- Version in URL path
- Backward compatibility for at least 2 versions
- Deprecation notices with 6-month timeline

## 🚀 Implementation Priority

### **Phase 1 (Critical - Dashboard Core) - Week 1-2**
1. ✅ User Profile & Stats APIs (`/api/users/profile`, `/api/users/stats`)
2. ✅ Active Bookings API (`/api/bookings/active`)
3. ✅ Notifications API (`/api/notifications`)
4. ✅ Quick Actions APIs (`/api/quick-search/*`)
5. ✅ Authentication & Security APIs

### **Phase 2 (Important - Enhanced Features) - Week 3-4**
1. ✅ Analytics & Budget Tracking (`/api/analytics/*`)
2. ✅ Recommendations API (`/api/recommendations/dashboard`)
3. ✅ Loyalty Points API (`/api/loyalty/*`)
4. ✅ Payment Methods API (`/api/users/payment-methods`)
5. ✅ Booking History API (`/api/bookings/history`)

### **Phase 3 (Nice to Have - Advanced Features) - Week 5-6**
1. ✅ Weather Information (`/api/weather/*`)
2. ✅ Travel Advisories (`/api/travel/advisories`)
3. ✅ Real-time Updates (WebSocket)
4. ✅ Advanced Analytics
5. ✅ Data Export APIs

### **Phase 4 (Future Enhancements) - Week 7+**
1. ✅ Machine Learning Recommendations
2. ✅ Advanced Personalization
3. ✅ Social Features Integration
4. ✅ Third-party Service Integrations
5. ✅ Mobile App Specific APIs

## 🛡️ Security Considerations

### **Data Protection**
- Encrypt sensitive data (PII, payment info)
- Use HTTPS for all communications
- Implement proper input validation
- Log security events
- Regular security audits

### **Privacy Compliance**
- GDPR compliance for EU users
- Data minimization principles
- User consent management
- Right to be forgotten implementation
- Data portability support

### **API Security**
- Rate limiting per endpoint
- IP whitelisting for admin APIs
- Request signing for sensitive operations
- Audit logging for all API calls
- Regular security testing

## 📈 Performance Optimization

### **Database Optimization**
- Proper indexing for frequent queries
- Database query optimization
- Connection pooling
- Read replicas for analytics
- Caching layers (Redis)

### **API Performance**
- Response compression (gzip)
- CDN for static assets
- Lazy loading for large datasets
- Async processing for heavy operations
- Connection keep-alive

### **Monitoring & Analytics**
- API response time monitoring
- Error rate tracking
- User behavior analytics
- Performance bottleneck identification
- Capacity planning metrics

## 📝 Documentation Standards

### **API Documentation**
- OpenAPI/Swagger specifications
- Interactive API explorer
- Code examples in multiple languages
- SDK documentation
- Postman collections

### **Integration Guides**
- Getting started tutorials
- Authentication setup
- Common use case examples
- Troubleshooting guides
- Best practices documentation

## 🧪 Testing Requirements

### **API Testing**
- Unit tests for all endpoints
- Integration tests for workflows
- Performance testing
- Security testing
- Load testing for peak traffic

### **Test Data Management**
- Sandbox environment with test data
- Data seeding for development
- Mock external service responses
- Test user accounts
- Automated testing pipelines

This comprehensive API requirements document provides everything needed to build a fully functional dashboard for the Wandernest travel platform. Each API is designed with scalability, security, and user experience in mind.