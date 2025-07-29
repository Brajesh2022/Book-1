# 📚 Book Archive

A beautiful, fast book search application with Kindle-inspired design. Built with Next.js, TypeScript, and Tailwind CSS.

![Book Archive](https://via.placeholder.com/800x400/f7f4ed/2a2a2a?text=Book+Archive)

## ✨ Features

- **🚀 Lightning Fast**: Optimized search with caching and performance enhancements
- **📱 Responsive Design**: Beautiful Kindle-inspired UI that works on all devices
- **🎨 Smooth Animations**: Delightful animations and transitions throughout
- **🔍 Advanced Search**: Search by title, author, ISBN, or keywords
- **📖 AI Summaries**: Generate book summaries using AI (Gemini API)
- **💾 Smart Caching**: Session-based caching for improved performance
- **♿ Accessible**: Built with accessibility in mind
- **🌐 SEO Optimized**: Proper meta tags and structured data

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom Kindle-inspired design system
- **API**: Anna's Archive for book data
- **AI**: Google Gemini for book summaries
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/book-archive.git
   cd book-archive
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Gemini API key (optional):
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Build and Deploy

### Local Build

```bash
npm run build
npm start
```

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

## 🎨 Design System

Our Kindle-inspired design system includes:

### Colors
- **Paper**: `#f7f4ed` - Warm paper background
- **Text**: `#2a2a2a` - Dark reading text
- **Accent**: `#e47833` - Orange highlight color
- **Border**: `#ddd6c1` - Subtle borders
- **Muted**: `#767676` - Secondary text

### Typography
- **Primary**: Crimson Text (serif) for reading
- **Secondary**: Inter (sans-serif) for UI

### Components
- Custom book cards with hover animations
- Pagination with smooth transitions
- Loading states with branded animations
- Error handling with helpful messages

## 🔧 Configuration

### Tailwind CSS

The design system is built into the Tailwind configuration with custom colors and animations:

```javascript
// tailwind.config.js
colors: {
  kindle: {
    paper: '#f7f4ed',
    text: '#2a2a2a',
    accent: '#e47833',
    // ... more colors
  }
}
```

### API Routes

- `/api/search` - Book search functionality
- `/api/summary` - AI-generated book summaries

## 🌟 Features in Detail

### Book Search
- Real-time search with multiple data sources
- Intelligent caching for improved performance
- Pagination for large result sets
- Error handling with retry mechanisms

### AI Summaries
- Integration with Google Gemini API
- Contextual book summaries
- Fallback handling for API failures
- Smart loading states

### Performance Optimizations
- Image optimization with Next.js Image component
- Session-based caching
- Lazy loading for better UX
- Optimized bundle size

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Anna's Archive](https://annas-archive.org) for book data
- [Google Gemini](https://ai.google.dev) for AI summaries
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Next.js](https://nextjs.org) for the framework

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/yourusername/book-archive/issues) page
2. Create a new issue if needed
3. Join our community discussions

---

**Built with ❤️ and lots of ☕**