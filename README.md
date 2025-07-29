# 📚 Kindle Book Archive

A modern, fast book search application with Kindle-inspired design, built with React and Express.js. Features AI-powered summaries, responsive design, and optimized performance.

![Book Archive Demo](https://via.placeholder.com/800x400/007eb9/ffffff?text=Kindle+Book+Archive)

## ✨ Features

- **🔍 Fast Book Search**: Lightning-fast book search with intelligent caching
- **🤖 AI Summaries**: Get instant AI-generated book summaries
- **📱 Responsive Design**: Beautiful Kindle-inspired UI that works on all devices
- **⚡ Performance Optimized**: Built with React Query, caching, and virtualization
- **🎨 Smooth Animations**: Framer Motion animations for delightful interactions
- **📖 Book Details**: View covers, authors, file sizes, and formats
- **⬇️ Direct Downloads**: One-click downloads from Anna's Archive
- **🎯 Pagination**: Efficient pagination for large result sets

## 🚀 Technology Stack

### Backend
- **Express.js** - Fast, unopinionated web framework
- **Node.js** - JavaScript runtime
- **Cheerio** - Server-side HTML parsing
- **Node-Cache** - In-memory caching for performance
- **Axios** - HTTP client for external API calls
- **Helmet** - Security middleware
- **Compression** - Response compression
- **Rate Limiting** - API protection

### Frontend
- **React 18** - Modern React with TypeScript
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Query** - Powerful data fetching and caching
- **Lucide React** - Beautiful icons

## 🎨 Design Philosophy

The application follows Kindle's design principles:

- **Clean Typography** - Inter and Crimson Text fonts for readability
- **Warm Color Palette** - Cream backgrounds with charcoal text
- **Minimal Interface** - Focus on content with subtle shadows
- **Smooth Interactions** - Gentle animations and hover effects
- **Mobile-First** - Responsive design that scales beautifully

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/Brajesh2022/Book-1.git
cd Book-1
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Optional: Add Gemini API key for AI summaries
GEMINI_API_KEY=your_gemini_api_key_here

# Cache Configuration
CACHE_TTL=600
```

### 4. Start the Application
```bash
# Start both backend and frontend concurrently
npm run dev

# Or start them separately:
# Backend only
npm run server

# Frontend only (in another terminal)
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
├── server.js              # Express.js backend server
├── package.json           # Backend dependencies
├── .env                   # Environment variables
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── SearchBar.tsx
│   │   │   ├── BookCard.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── LoadingGrid.tsx
│   │   │   └── SummaryModal.tsx
│   │   ├── services/      # API services
│   │   │   └── api.ts
│   │   ├── types/         # TypeScript definitions
│   │   │   └── index.ts
│   │   ├── App.tsx        # Main React component
│   │   ├── index.tsx      # React entry point
│   │   └── index.css      # Tailwind CSS styles
│   ├── tailwind.config.js # Tailwind configuration
│   ├── postcss.config.js  # PostCSS configuration
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## 🔧 API Endpoints

### Search Books
```
GET /api/search?q={query}&page={page}
```
Search for books with pagination support.

### Get Book Summary
```
POST /api/summarize
Content-Type: application/json

{
  "title": "Book Title",
  "author": "Author Name"
}
```
Generate AI-powered book summary.

### Health Check
```
GET /api/health
```
Check server status and cache information.

## 🎯 Performance Features

- **Server-side Caching**: 10-minute TTL for search results
- **React Query**: Client-side caching and background refetching
- **Code Splitting**: Lazy loading for optimal bundle size
- **Image Optimization**: Lazy loading with fallbacks
- **Compression**: Gzip compression for all responses
- **Rate Limiting**: Protection against API abuse

## 🌟 Key Components

### SearchBar
- Real-time search with debouncing
- Keyboard navigation support
- Loading states and animations

### BookCard
- Hover animations and transitions
- Image lazy loading with fallbacks
- Format badges and file size display
- AI summary integration

### Pagination
- Smart page number generation
- Keyboard and click navigation
- Loading state handling

### SummaryModal
- Smooth modal animations
- Escape key and backdrop click handling
- AI summary loading states

## 🔮 Future Enhancements

- [ ] Advanced search filters (format, size, date)
- [ ] User favorites and reading lists
- [ ] Dark mode support
- [ ] Offline reading capabilities
- [ ] Social sharing features
- [ ] Advanced AI features (recommendations, reviews)
- [ ] Multi-language support
- [ ] Reading progress tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Anna's Archive** for providing the book database
- **Kindle** for design inspiration
- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first approach
- **Framer Motion** for smooth animations

## 📞 Support

If you have any questions or need help, please:
1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the maintainers

---

**Built with ❤️ and modern web technologies**