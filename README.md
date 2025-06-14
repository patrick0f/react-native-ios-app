# Expense Categorization App

A real-time iOS application that uses AI to automatically categorize expense entries and synchronize them across all users. The app intelligently suggests categories for text entries into predefined categories like Food, Transport, Utilities, etc.

## Features

- Native iOS app built with React Native and Expo
- AI-powered expense categorization
- Real-time synchronization across all users
- Predefined expense categories
- Global accessible expense list

## Tech Stack

### Mobile App (iOS)
- React Native with Expo
- TypeScript
- React Navigation for routing
- Socket.io Client for real-time updates
- Expo Router for navigation
- Various Expo modules for native functionality

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Socket.io for real-time communication
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- iOS device or simulator
- MongoDB instance
- Xcode (for iOS development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/react-native-ios-app.git
cd react-native-ios-app
```

2. Setup Backend:
```bash
cd backend
npm install
# Create .env file with necessary environment variables
npm run dev
```

3. Setup Mobile App:
```bash
cd mobileapp/my-app
npm install
# Create .env file with necessary environment variables
npx expo start
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=<your_mongodb_uri>
OPENAI_KEY=<your_openai_api_key>
NODE_ENV=development
PORT=5179
```

### Mobile App (.env)
```
EXPO_PUBLIC_API_URL=<your_backend_url>
```
