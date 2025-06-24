# Padel Map - React Native Expo App

> **Learning Project**: This application is being developed as a personal learning opportunity to explore React Native development, mobile app architecture, and modern development practices. It serves as a hands-on project to gain experience with React Native, Expo, mapping technologies, and mobile UI/UX design.

A comprehensive React Native Expo application for padel enthusiasts to discover courts, track performance, and connect with the padel community.

## 🏓 Features

### 📱 User Profile
- **Player Dashboard**: Complete player profile with avatar, location, and membership details
- **Performance Analytics**: Track your player rating, win rate, and monthly match statistics
- **Match History**: Detailed view of recent matches with scores, opponents, venues, and duration
- **Achievement System**: Showcase tournament wins and accomplishments
- **Quick Actions**: Easy access to court booking, player finding, tournaments, and settings

### 🗺️ Interactive Map
- **Native Maps Integration**: Apple Maps on iOS, Google Maps on Android
- **Location-Based Discovery**: Automatically centers on user's location with fallback to Central London
- **Padel Club Discovery**: Find nearby padel clubs within customizable radius (5-20km)
- **Rich Club Information**: View club photos, ratings, descriptions, and distances
- **Interactive Markers**: Tap markers to see detailed club information
- **Auto-scaling**: Map automatically adjusts to show all clubs within selected radius
- **Real-time Filtering**: Dynamic filtering based on distance preferences

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator (for Android development)
- Physical device with Expo Go app (recommended for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd padel_ar_react_native/padel-map
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - **iOS**: Press `i` in the terminal or scan QR code with iOS Camera app
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in the terminal

## 📦 Dependencies

### Core Dependencies
- **React Native**: Cross-platform mobile development framework
- **Expo**: Development platform for React Native
- **expo-router**: File-based routing for React Native
- **react-native-maps**: Native map components for iOS and Android
- **expo-location**: Location services for getting user's current position

### UI Components
- **@expo/vector-icons**: Icon library with FontAwesome icons
- **Custom Components**: Themed components for consistent styling

## 🏗️ Project Structure

```
padel-map/
├── app/                          # App router screens
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── _layout.tsx          # Tab layout configuration
│   │   ├── index.tsx            # Profile tab (home screen)
│   │   └── map.tsx              # Map tab
│   ├── _layout.tsx              # Root layout
│   ├── +html.tsx                # HTML template
│   ├── +not-found.tsx           # 404 screen
│   └── modal.tsx                # Modal screen
├── components/                   # Reusable components
│   ├── AppleMap.tsx             # Map component with club discovery
│   ├── UserProfile.tsx          # User profile and stats component
│   ├── Themed.tsx               # Themed UI components
│   └── ...                      # Other utility components
├── constants/                    # App constants
│   └── Colors.ts                # Color theme definitions
├── assets/                       # Static assets
│   ├── images/                  # App icons and images
│   └── fonts/                   # Custom fonts
└── package.json                 # Dependencies and scripts
```

## 🎨 Design System

### Color Scheme
- **Primary Green**: `#2E7D32` - Main brand color for padel theme
- **Secondary Green**: `#4CAF50` - Accent color for positive elements
- **Background**: `#f8f9fa` - Light background for better readability
- **Cards**: `white` with subtle shadows for depth
- **Win Indicators**: Green accents for victories
- **Loss Indicators**: Red accents for defeats

### Typography
- **Headers**: Bold, prominent sizing for section titles
- **Body Text**: Clean, readable fonts for content
- **Stats**: Large, bold numbers for key metrics
- **Badges**: Small, prominent text for status indicators

## 🗺️ Map Features

### Club Data
The app includes 10 authentic London-based padel clubs:
- Hyde Park Padel Club
- Camden Padel Center
- Royal Chelsea Padel
- Canary Wharf Padel
- Southbank Padel Courts
- Islington Padel Club
- Kensington Padel Academy
- Hackney Padel Hub
- Westminster Padel Center
- Greenwich Padel Club

### Location Services
- **Auto-location**: Requests user permission for location access
- **Fallback System**: Defaults to Central London if location denied/failed
- **High Accuracy**: Uses GPS for precise positioning
- **Distance Calculation**: Haversine formula for accurate club distances

## 📱 User Profile Features

### Statistics Tracking
- **Player Rating**: 5-star rating system
- **Win Rate**: Calculated from recent match history
- **Monthly Activity**: Track matches played per month
- **Performance Trends**: Visual indicators for improvement

### Match History
- **Detailed Records**: Complete match information including:
  - Date and time
  - Opponent names
  - Final scores
  - Venue location
  - Match duration
  - Win/loss outcome

## 🔧 Configuration

### App Configuration (`app.json`)
- Location permissions for iOS and Android
- App icons and splash screens
- Platform-specific settings

### Maps Configuration
- Apple Maps on iOS (native integration)
- Google Maps on Android (via react-native-maps)
- Custom markers with club images
- Callout views with rich information

## 🚀 Deployment

### Building for Production

1. **iOS Build**
   ```bash
   npx expo build:ios
   ```

2. **Android Build**
   ```bash
   npx expo build:android
   ```

3. **Web Build**
   ```bash
   npx expo build:web
   ```

### Publishing Updates
```bash
npx expo publish
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Features

- [ ] Real-time court availability
- [ ] Online booking integration
- [ ] Player matching system
- [ ] Tournament registration
- [ ] Social features and player reviews
- [ ] AR court visualization
- [ ] Payment integration
- [ ] Push notifications for bookings
- [ ] Weather integration for outdoor courts
- [ ] Advanced analytics and insights

---

Built with ❤️ for the padel community 
