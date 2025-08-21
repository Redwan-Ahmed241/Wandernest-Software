# Wandernest - Travel Planning & Booking Platform

Wandernest is a comprehensive travel planning and booking platform built with modern web technologies. It provides travelers with tools to create custom travel packages, connect with the community, book flights, get visa assistance, and much more.

## 🌟 Features

### Travel Planning & Booking
- **Custom Travel Packages**: Create personalized travel itineraries with flexible options for destinations, dates, budget, and group size
- **Flight Booking**: Search and book flights with integrated booking system
- **Hotel & Accommodation**: Browse and book hotels and rooms
- **Transportation**: Book rental vehicles and access public transport information
- **Guide Services**: Hire local guides for enhanced travel experiences

### Community & Social Features
- **Travel Community**: Connect with fellow travelers through blogs, reviews, and group discussions
- **Travel Blogs**: Share and read travel experiences and tips
- **Reviews & Ratings**: Rate and review destinations, hotels, and services
- **Travel Groups**: Join or create travel groups for shared experiences

### Travel Services
- **Visa Assistance**: Get help with visa applications and requirements
- **Travel Support**: 24/7 customer support and help center
- **Gift Cards**: Purchase and redeem travel gift cards
- **Travel Insurance**: Protect your trips with comprehensive insurance options

### User Experience
- **Responsive Design**: Optimized for all devices with modern UI/UX
- **User Authentication**: Secure login and registration system
- **Personal Dashboard**: Manage trips, bookings, and profile settings
- **Trip Management**: Track and manage all your travel plans in one place

## 🛠️ Technology Stack

- **Frontend**: React 19+ with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS 4+ with custom theme configuration
- **Routing**: React Router DOM for navigation
- **Maps**: Leaflet and React Leaflet for interactive maps
- **Date Handling**: React DatePicker for date selection
- **Icons**: React Feather for consistent iconography
- **State Management**: React Context API for authentication and booking state

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Redwan-Ahmed241/Wandernest-Software.git
cd Wandernest-Software
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create a .env file in the root directory
VITE_REACT_APP_API_URL=your_api_base_url
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 📁 Project Structure

```
src/
├── App/                 # API services and main app logic
├── Authentication/      # Auth context and login/signup
├── Components/          # Reusable UI components
├── Context/            # React context providers
├── Pages/              # Application pages/routes
└── assets/             # Static assets
```

### Key Pages
- **Homepage**: Landing page with featured destinations and services
- **Create Packages**: Custom travel package creation
- **Community**: Travel blogs, reviews, and social features
- **Dashboard**: User dashboard for managing trips and bookings
- **Destinations**: Browse and explore travel destinations
- **Flights**: Flight search and booking
- **Visa Assistance**: Visa application help and resources

## 🎨 Design System

The application uses a custom Tailwind CSS theme with:
- **Primary Colors**: Forest green palette (`#4a6b5b`, `#6ab187`, `#0d1c1c`)
- **Accent Colors**: Sage green (`#abb79a`, `#e8f2f2`)
- **Typography**: Plus Jakarta Sans font family
- **Consistent Color Scheme**: Centralized theme configuration

## 🔧 API Integration

The application integrates with a backend API for:
- User authentication and management
- Travel package creation and management
- Flight booking services
- Community features (blogs, reviews, groups)
- Visa application processing
- Payment and booking confirmations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 📞 Support

For support and inquiries, please contact the development team or use the in-app help center.

---

Built with ❤️ for travelers around the world
