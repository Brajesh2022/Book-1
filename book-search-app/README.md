# 📚 Book Archive - Modern Book Search Application

A beautiful, fast, and modern book search application built with Next.js, TypeScript, and Tailwind CSS. Features AI-powered summaries, intelligent caching, and a Kindle-inspired design.

![Book Archive Preview](https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=600&fit=crop&crop=center)

## ✨ Features

### 🔍 **Advanced Search**
- Lightning-fast book search across millions of titles
- Smart caching system for optimal performance
- Multiple fallback strategies for reliable data fetching
- Recent search history and popular suggestions

### 🤖 **AI-Powered Insights**
- Generate intelligent book summaries using Google's Gemini AI
- Contextual recommendations based on your interests
- Rate-limited API calls for optimal performance

### 🎨 **Beautiful Design**
- Kindle-inspired, clean and modern interface
- Smooth animations powered by Framer Motion
- Responsive design that works on all devices
- Dark/light mode support (system preference)

### ⚡ **Performance Optimized**
- Next.js 14 with App Router for maximum performance
- Image optimization and lazy loading
- Intelligent caching with automatic cleanup
- TypeScript for type safety and better DX

### 🔧 **Developer Experience**
- Full TypeScript support
- ESLint configuration
- Modular component architecture
- Clean, maintainable code structure

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- (Optional) Google Gemini API key for AI summaries

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd book-search-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables** (Optional)
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Gemini API key:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | Google Gemini API key for AI summaries | No |

### API Setup (Optional)

To enable AI-powered summaries:

1. Get a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to your `.env.local` file
3. Restart the development server

**Note:** The application works perfectly without the API key - it will show fallback summaries instead.

## 📁 Project Structure

```
book-search-app/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── BookCard.tsx     # Individual book display
│   │   ├── SearchBar.tsx    # Search interface
│   │   ├── LoadingSpinner.tsx # Loading states
│   │   ├── SummaryModal.tsx # AI summary modal
│   │   └── Pagination.tsx   # Navigation
│   ├── lib/                 # Utilities and services
│   │   ├── api.ts          # Book search API
│   │   ├── ai.ts           # AI summary service
│   │   └── cache.ts        # Caching system
│   └── types/              # TypeScript definitions
│       └── book.ts         # Data types
├── public/                 # Static assets
├── package.json           # Dependencies
└── README.md             # This file
```

## 🛠️ Built With

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and better DX
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[Google Gemini AI](https://ai.google.dev/)** - AI-powered summaries

## 📱 Responsive Design

The application is fully responsive and optimized for:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Laptops (1024px+)
- 🖥️ Desktop (1280px+)
- 🖥️ Large screens (1536px+)

## ⚡ Performance Features

### Caching Strategy
- **Memory Cache**: Fast access to recently viewed data
- **Session Storage**: Persistent cache across browser sessions
- **Automatic Cleanup**: Removes expired entries automatically
- **Size Management**: Prevents cache from growing too large

### Image Optimization
- Next.js Image component for automatic optimization
- Lazy loading for better performance
- Responsive images for different screen sizes
- Error handling with fallback images

### API Optimization
- Multiple fetch strategies for reliability
- Request cancellation to prevent memory leaks
- Rate limiting for AI API calls
- Progress indicators for better UX

## 🔒 Privacy & Security

- No user data collection or tracking
- Client-side caching only (no server storage)
- Secure API key handling (environment variables)
- HTTPS-only external requests

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Follow TypeScript best practices
2. Use ESLint and Prettier for code formatting
3. Write meaningful commit messages
4. Test on multiple devices/browsers
5. Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## 🙏 Acknowledgments

- [Anna's Archive](https://annas-archive.org/) for providing book data
- [Unsplash](https://unsplash.com/) for beautiful placeholder images
- [Google AI](https://ai.google.dev/) for Gemini AI API
- The open-source community for amazing tools and libraries

---

**Made with ❤️ for book lovers everywhere**