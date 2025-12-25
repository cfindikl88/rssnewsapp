# RSS News App 📰

A modern, feature-rich RSS news aggregator built with React 19 and Express 5. Get personalized news from your favorite sources with AI-powered summaries, multilingual support, and comprehensive reading analytics.

![RSS News App](https://img.shields.io/badge/React-19.2.0-blue) ![Express](https://img.shields.io/badge/Express-5.2.1-green) ![Vite](https://img.shields.io/badge/Vite-7.2.4-purple) ![License](https://img.shields.io/badge/license-MIT-yellow)

## ✨ Features

### Core Functionality
- **📡 RSS Feed Aggregation**: Add and manage multiple RSS feeds from your favorite news sources
- **🤖 AI-Powered Summaries**: Get instant article summaries using advanced AI technology
- **📊 Reading Statistics**: Track your reading habits with detailed analytics
- **🔖 Smart Bookmarks**: Save and organize your favorite articles
- **🌐 Multilingual Support**: Available in Turkish and English
- **🎨 Dark/Light Themes**: Comfortable reading in any lighting condition
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🔊 Text-to-Speech**: Listen to articles with built-in speech synthesis

### 15+ Integrated Widgets
- **🌤️ Weather**: Real-time weather forecasts
- **🏈 Football Matches**: Live scores and fixtures for Süper Lig
- **🌍 Earthquakes**: Recent earthquake alerts from Turkey
- **📅 Calendar**: Daily calendar with special events
- **⏰ World Clocks**: Multiple timezone support
- **💱 Market Summary**: Stock market and crypto prices
- **📚 English Word of the Day**: Expand your vocabulary
- **🧠 Quiz of the Day**: Test your knowledge
- **📜 Historical Events**: What happened on this day in history
- **💭 Quote of the Day**: Daily inspiration
- **🎯 Recommendations**: Personalized article suggestions
- **📖 Reading Stats**: Your personalized reading metrics
- **🔔 Notifications**: Custom notification preferences
- **📰 News Ticker**: Live breaking news ticker

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/cfindikl88/rssnewsapp.git
cd rssnewsapp

# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### Development

```bash
# From project root - Start both servers concurrently
npm run dev

# Or start individually:
# Terminal 1 - Start backend server (port 3001)
cd server
npm start

# Terminal 2 - Start frontend dev server (port 5173)
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
# Build client for production
cd client
npm run build

# Preview production build
npm run preview

# Start production server
cd ../server
npm start
```

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0**: Latest  React with improved performance
- **Vite 7.2.4**: Lightning-fast build tool
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **DOMPurify**: XSS protection for sanitizing HTML
- **Vitest**: Fast unit testing framework

### Backend
- **Express 5.2.1**: Robust Node.js web framework
- **RSS Parser**: RSS/Atom feed parsing
- **Cheerio**: Web scraping for data enrichment
- **Axios**: HTTP client for API requests
- **Express Rate Limit**: API rate limiting for security

### Testing & Quality
- **Vitest**: Unit and integration testing
- **@testing-library/react**: Component testing utilities
- **ESLint**: Code linting and quality checks
- **Vitest Coverage**: Code coverage reporting

## 📁 Project Structure

```
rssnewsapp/
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/      # React components (30+)
│   │   ├── contexts/        # Context providers (Language, Theme)
│   │   ├── hooks/           # Custom hooks (9 hooks)
│   │   ├── services/        # API and service layer
│   │   ├── tests/           # Test suites
│   │   └── main.jsx         # Application entry point
│   ├── public/              # Static assets
│   └── package.json
│
├── server/                  # Backend Express server
│   ├── index.js             # Server entry point
│   ├── earthquakeScraper.js # Earthquake data scraper
│   ├── fixturesScraper.js   # Football fixtures scraper
│   └── package.json
│
└── package.json             # Root package file
```

## 🧪 Testing

```bash
# Run all tests
cd client
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Open coverage UI
npm run test:ui
```

**Current Test Coverage**: 60% components | 100% hooks | 85% services

## 🔒 Security Features

- **XSS Protection**: DOMPurify sanitizes all HTML content
- **Rate Limiting**: API endpoints protected against abuse
- **CORS Configuration**: Secure cross-origin requests
- **Input Validation**: Form inputs validated on client and server
- **No Hardcoded Secrets**: Environment variables for sensitive data

## 🌍 Environment Variables

Create a `.env` file in the server directory:

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## 📝 Available Scripts

### Root
- `npm run dev`: Start both client and server in development mode

### Client (`/client`)
- `npm run dev`: Start Vite dev server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run test`: Run unit tests
- `npm run test:coverage`: Generate coverage report

### Server (`/server`)
- `npm start`: Start Express server
- `npm run dev`: Start with nodemon (auto-reload)

## 🎯 Usage Examples

### Adding an RSS Feed
1. Enter the RSS feed URL in the sidebar input
2. Click "Kaynağı Ekle" (Add Source)
3. View articles from the feed in the main grid

### Reading an Article
1. Click "Oku" (Read) on any article card
2. View full content in the article modal
3. Use AI summary for quick overview
4. Bookmark for later reading
5. Share via social media

### Tracking Reading Stats
1. Read articles for at least 5 seconds
2. Check "Reading Stats" widget for analytics
3. View daily/weekly statistics
4. Track reading streaks and top categories

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Write tests for new features
- Follow existing code style (ESLint configuration)
- Update documentation for API changes
- Ensure all tests pass before submitting PR

## 🐛 Known Issues & Roadmap

### Current Limitations
- No backend authentication (planned for v2.0)
- Limited to Turkish and English languages
- Browser-only (no native mobile apps)

### Roadmap
- [ ] User authentication and profiles
- [ ] Cloud bookmark sync
- [ ] More language support
- [ ] PWA offline mode
- [ ] Mobile apps (React Native)
- [ ] Article categorization with ML
- [ ] Social features (sharing, comments)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Caglar Findikli**
- GitHub: [@cfindikl88](https://github.com/cfindikl88)

## 🙏 Acknowledgments

- RSS feed providers for news content
- Open-source community for amazing libraries
- Contributors and testers

## 📧 Support

For support, please open an issue on GitHub or contact the maintainer.

---

**Made with ❤️ and React**
