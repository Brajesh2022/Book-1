# 📚 Kindle Book Archive - Modern Book Search

A fast, beautiful, and modern book search application with Kindle-inspired design. Built with Node.js, Express, and vanilla JavaScript for optimal performance.

![Kindle Book Archive](https://img.shields.io/badge/Status-Ready%20to%20Use-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- **🚀 Lightning Fast**: Optimized caching and minimal dependencies
- **🎨 Kindle-Inspired Design**: Beautiful, clean interface with Amazon's design language
- **📱 Fully Responsive**: Perfect on desktop, tablet, and mobile
- **🤖 AI-Powered Summaries**: Get intelligent book summaries using Gemini AI
- **💾 Smart Caching**: Client and server-side caching for instant results
- **⌨️ Keyboard Shortcuts**: Efficient navigation with keyboard shortcuts
- **🔍 Advanced Search**: Search by title, author, ISBN, or keywords
- **📖 Multiple Views**: Grid and list view options
- **🌐 PWA Ready**: Offline functionality and app-like experience
- **🔒 Secure**: Built-in security headers and rate limiting

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Gemini AI API key (optional, for summaries)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kindle-book-search
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🛠️ Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build for production (if using webpack)

### Project Structure

```
kindle-book-search/
├── public/                 # Static files
│   ├── css/
│   │   └── styles.css     # Kindle-inspired styles
│   ├── js/
│   │   ├── app.js         # Main application logic
│   │   └── sw.js          # Service worker
│   └── index.html         # Main HTML file
├── server.js              # Express server
├── package.json           # Dependencies and scripts
├── .env.example          # Environment variables template
└── README.md             # This file
```

## 🎨 Design Philosophy

The application follows Amazon Kindle's design principles:

- **Clean Typography**: Using Amazon Ember and Bookerly fonts
- **Warm Color Palette**: Kindle orange (#FF9900) and navy blue (#232F3E)
- **Focused Reading Experience**: Minimal distractions, maximum content
- **Accessibility First**: Keyboard navigation, screen reader support
- **Performance Oriented**: Fast loading, smooth animations

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `GEMINI_API_KEY` | Gemini AI API key | - |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` |

### Getting Gemini API Key

1. Go to [Google AI Studio](https://console.developers.google.com/)
2. Create a new project or select existing
3. Enable the Gemini API
4. Create credentials and get your API key
5. Add it to your `.env` file

## 🚀 Performance Optimizations

- **Server-side caching** with NodeCache
- **Client-side caching** with browser localStorage
- **Image lazy loading** for book covers
- **Debounced search** to reduce API calls
- **Gzip compression** for faster transfers
- **CDN fonts** with preload hints
- **Service Worker** for offline functionality

## 🎯 Usage

### Search Features

- **Quick Search**: Enter any keyword in the search box
- **Suggestion Tags**: Click on popular categories
- **Keyboard Shortcut**: Press `Ctrl+K` (or `Cmd+K` on Mac) to focus search
- **View Toggle**: Switch between grid and list views
- **Pagination**: Navigate through multiple result pages

### AI Summaries

- Click the "✨ Summary" button on any book
- Get intelligent summaries powered by Gemini AI
- Summaries are cached for faster subsequent loads

### Keyboard Shortcuts

- `Ctrl/Cmd + K` - Focus search input
- `Escape` - Close modal/clear focus
- `Enter` - Submit search

## 🔒 Security Features

- **Helmet.js** for security headers
- **Rate limiting** to prevent abuse
- **Input sanitization** to prevent XSS
- **CORS protection** with proper origins
- **Content Security Policy** headers

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Mobile Experience

The application is fully responsive and works beautifully on:
- Mobile phones (iOS/Android)
- Tablets (iPad, Android tablets)
- Desktop computers
- Large displays (4K, ultrawide)

## 🚀 Deployment

### Production Build

1. Set environment to production:
   ```bash
   NODE_ENV=production
   ```

2. Start the server:
   ```bash
   npm start
   ```

### Deployment Platforms

The application can be deployed on:
- **Heroku**: Simple git-based deployment
- **Vercel**: Optimal for Node.js apps
- **Railway**: Modern deployment platform
- **DigitalOcean**: VPS deployment
- **AWS/GCP/Azure**: Cloud platform deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Amazon Kindle** for design inspiration
- **Anna's Archive** for book data
- **Google Gemini** for AI summaries
- **Open Source Community** for amazing libraries

## 🐛 Issues & Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed description
3. Include steps to reproduce the problem
4. Mention your environment (OS, browser, Node.js version)

---

Made with ❤️ for book lovers everywhere.