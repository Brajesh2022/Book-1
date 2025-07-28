/**
 * Kindle Book Archive - Modern JavaScript Application
 * Fast, Beautiful, and Responsive Book Search
 */

class BookSearchApp {
  constructor() {
    this.currentQuery = '';
    this.currentPage = 1;
    this.isLoading = false;
    this.searchCache = new Map();
    this.debounceTimer = null;
    this.currentView = 'grid';
    
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    this.bindEvents();
    this.setupIntersectionObserver();
    this.setupKeyboardShortcuts();
    this.showWelcomeAnimation();
  }

  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Search form
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    searchForm.addEventListener('submit', (e) => this.handleSearch(e));
    searchInput.addEventListener('input', (e) => this.handleSearchInput(e));
    
    // Suggestion tags
    document.querySelectorAll('.suggestion-tag').forEach(tag => {
      tag.addEventListener('click', (e) => this.handleSuggestionClick(e));
    });
    
    // View toggle buttons
    document.getElementById('grid-view').addEventListener('click', () => this.setView('grid'));
    document.getElementById('list-view').addEventListener('click', () => this.setView('list'));
    
    // Modal events
    document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
    document.getElementById('summary-modal').addEventListener('click', (e) => this.handleModalBackdropClick(e));
    
    // Back to top button
    document.getElementById('back-to-top').addEventListener('click', () => this.scrollToTop());
    
    // Retry button
    document.getElementById('retry-button').addEventListener('click', () => this.retrySearch());
    
    // Window events
    window.addEventListener('scroll', this.throttle(() => this.handleScroll(), 100));
    window.addEventListener('resize', this.throttle(() => this.handleResize(), 250));
    
    // Keyboard events
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  /**
   * Handle search form submission
   */
  async handleSearch(e) {
    e.preventDefault();
    
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    
    if (!query) {
      this.showToast('Please enter a search term', 'error');
      searchInput.focus();
      return;
    }
    
    this.currentQuery = query;
    this.currentPage = 1;
    await this.performSearch(query, 1);
  }

  /**
   * Handle search input changes (for autocomplete/suggestions)
   */
  handleSearchInput(e) {
    const query = e.target.value.trim();
    
    // Clear previous debounce timer
    clearTimeout(this.debounceTimer);
    
    // Debounce search suggestions
    if (query.length >= 2) {
      this.debounceTimer = setTimeout(() => {
        // Here you could implement search suggestions
        console.log('Search suggestions for:', query);
      }, 300);
    }
  }

  /**
   * Handle suggestion tag clicks
   */
  handleSuggestionClick(e) {
    const query = e.target.dataset.query;
    document.getElementById('search-input').value = query;
    this.currentQuery = query;
    this.currentPage = 1;
    this.performSearch(query, 1);
  }

  /**
   * Perform the actual search
   */
  async performSearch(query, page = 1) {
    if (this.isLoading) return;
    
    try {
      this.setLoading(true);
      this.hideError();
      
      // Check cache first
      const cacheKey = `${query}-${page}`;
      if (this.searchCache.has(cacheKey)) {
        const cachedData = this.searchCache.get(cacheKey);
        this.displayResults(cachedData, query);
        this.setLoading(false);
        return;
      }
      
      // Make API request
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&page=${page}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Cache the result
      this.searchCache.set(cacheKey, data);
      
      // Limit cache size
      if (this.searchCache.size > 50) {
        const firstKey = this.searchCache.keys().next().value;
        this.searchCache.delete(firstKey);
      }
      
      this.displayResults(data, query);
      
      if (data.cached) {
        this.showToast('Results loaded from cache', 'success');
      }
      
    } catch (error) {
      console.error('Search error:', error);
      this.showError('Failed to search books. Please check your connection and try again.');
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Display search results
   */
  displayResults(data, query) {
    const { books, pagination } = data;
    
    if (!books || books.length === 0) {
      this.showError(`No books found for "${query}". Try different keywords or check your spelling.`);
      return;
    }
    
    // Update results header
    document.getElementById('results-title').textContent = `Search Results for "${query}"`;
    document.getElementById('results-count').textContent = `${books.length} books found`;
    
    // Display books
    this.renderBooks(books);
    
    // Display pagination
    this.renderPagination(pagination);
    
    // Show results
    document.getElementById('search-results').classList.remove('hidden');
    
    // Scroll to results
    document.getElementById('search-results').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }

  /**
   * Render books in the grid
   */
  renderBooks(books) {
    const booksGrid = document.getElementById('books-grid');
    booksGrid.innerHTML = '';
    
    books.forEach((book, index) => {
      const bookCard = this.createBookCard(book, index);
      booksGrid.appendChild(bookCard);
    });
    
    // Add event listeners for summary buttons
    booksGrid.addEventListener('click', (e) => {
      if (e.target.classList.contains('summary-button')) {
        e.preventDefault();
        const bookData = JSON.parse(e.target.dataset.book);
        this.showSummary(bookData);
      }
    });
  }

  /**
   * Create a book card element
   */
  createBookCard(book, index) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const bookData = JSON.stringify({
      title: book.title,
      author: book.author,
      poster: book.poster
    });
    
    card.innerHTML = `
      <div class="book-cover-container">
        <img 
          class="book-cover" 
          src="${book.poster}" 
          alt="Cover of ${this.escapeHtml(book.title)}"
          loading="lazy"
          onerror="this.src='https://via.placeholder.com/200x300/e2e8f0/334155?text=No+Image'"
        >
      </div>
      <div class="book-info">
        <h3 class="book-title" title="${this.escapeHtml(book.title)}">
          ${this.escapeHtml(book.title)}
        </h3>
        <p class="book-author" title="${this.escapeHtml(book.author)}">
          ${this.escapeHtml(book.author)}
        </p>
        <p class="book-description" title="${this.escapeHtml(book.description)}">
          ${this.escapeHtml(book.description)}
        </p>
        <div class="book-meta">
          <span class="book-size">${book.size}</span>
          <div class="book-actions">
            <button 
              class="action-button summary-button" 
              data-book='${this.escapeHtml(bookData)}'
              title="Get AI summary"
            >
              ✨ Summary
            </button>
            <a 
              href="${book.downloadLink}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="action-button download-button"
              title="Download book"
            >
              📥 Download
            </a>
          </div>
        </div>
      </div>
    `;
    
    return card;
  }

  /**
   * Render pagination
   */
  renderPagination(pagination) {
    const paginationContainer = document.getElementById('pagination');
    
    if (!pagination || pagination.totalPages <= 1) {
      paginationContainer.classList.add('hidden');
      return;
    }
    
    paginationContainer.classList.remove('hidden');
    paginationContainer.innerHTML = '';
    
    const { currentPage, totalPages, pages } = pagination;
    
    // Previous button
    if (currentPage > 1) {
      const prevBtn = this.createPaginationButton('‹ Previous', currentPage - 1);
      paginationContainer.appendChild(prevBtn);
    }
    
    // Page numbers
    pages.forEach(page => {
      const btn = this.createPaginationButton(page, page, page === currentPage);
      paginationContainer.appendChild(btn);
    });
    
    // Next button
    if (currentPage < totalPages) {
      const nextBtn = this.createPaginationButton('Next ›', currentPage + 1);
      paginationContainer.appendChild(nextBtn);
    }
  }

  /**
   * Create pagination button
   */
  createPaginationButton(text, page, isActive = false) {
    const button = document.createElement('button');
    button.className = `pagination-button ${isActive ? 'active' : ''}`;
    button.textContent = text;
    button.dataset.page = page;
    
    if (!isActive) {
      button.addEventListener('click', () => {
        this.currentPage = page;
        this.performSearch(this.currentQuery, page);
      });
    }
    
    return button;
  }

  /**
   * Show AI summary modal
   */
  async showSummary(book) {
    const modal = document.getElementById('summary-modal');
    const loadingEl = document.getElementById('summary-loading');
    const contentEl = document.getElementById('summary-content');
    
    // Set book info
    document.getElementById('summary-book-cover').src = book.poster;
    document.getElementById('summary-book-title').textContent = book.title;
    document.getElementById('summary-book-author').textContent = book.author;
    
    // Show modal with loading state
    loadingEl.classList.remove('hidden');
    contentEl.classList.add('hidden');
    modal.classList.remove('hidden');
    
    try {
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: book.title,
          author: book.author
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Display summary
      document.getElementById('summary-text-content').textContent = data.summary;
      
      loadingEl.classList.add('hidden');
      contentEl.classList.remove('hidden');
      
      if (data.cached) {
        this.showToast('Summary loaded from cache', 'success');
      }
      
    } catch (error) {
      console.error('Summary error:', error);
      loadingEl.classList.add('hidden');
      document.getElementById('summary-text-content').textContent = 
        'Sorry, we couldn\'t generate a summary for this book right now. Please try again later.';
      contentEl.classList.remove('hidden');
    }
  }

  /**
   * Close modal
   */
  closeModal() {
    document.getElementById('summary-modal').classList.add('hidden');
  }

  /**
   * Handle modal backdrop clicks
   */
  handleModalBackdropClick(e) {
    if (e.target.classList.contains('modal-backdrop')) {
      this.closeModal();
    }
  }

  /**
   * Set view (grid or list)
   */
  setView(view) {
    this.currentView = view;
    
    const gridBtn = document.getElementById('grid-view');
    const listBtn = document.getElementById('list-view');
    const booksGrid = document.getElementById('books-grid');
    
    if (view === 'grid') {
      gridBtn.classList.add('active');
      listBtn.classList.remove('active');
      booksGrid.classList.remove('list-view');
    } else {
      listBtn.classList.add('active');
      gridBtn.classList.remove('active');
      booksGrid.classList.add('list-view');
    }
  }

  /**
   * Set loading state
   */
  setLoading(loading) {
    this.isLoading = loading;
    const loader = document.getElementById('loader');
    const searchResults = document.getElementById('search-results');
    
    if (loading) {
      loader.classList.remove('hidden');
      searchResults.classList.add('hidden');
    } else {
      loader.classList.add('hidden');
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    const errorEl = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const searchResults = document.getElementById('search-results');
    
    errorText.textContent = message;
    errorEl.classList.remove('hidden');
    searchResults.classList.add('hidden');
  }

  /**
   * Hide error message
   */
  hideError() {
    document.getElementById('error-message').classList.add('hidden');
  }

  /**
   * Retry search
   */
  retrySearch() {
    if (this.currentQuery) {
      this.performSearch(this.currentQuery, this.currentPage);
    }
  }

  /**
   * Show toast notification
   */
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (toast.parentNode) {
            container.removeChild(toast);
          }
        }, 250);
      }
    }, 3000);
  }

  /**
   * Handle scroll events
   */
  handleScroll() {
    const backToTop = document.getElementById('back-to-top');
    
    if (window.scrollY > 300) {
      backToTop.classList.remove('hidden');
    } else {
      backToTop.classList.add('hidden');
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Responsive adjustments if needed
    console.log('Window resized');
  }

  /**
   * Scroll to top smoothly
   */
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Handle keyboard shortcuts
   */
  handleKeyDown(e) {
    // Escape key closes modal
    if (e.key === 'Escape') {
      this.closeModal();
    }
    
    // Ctrl/Cmd + K focuses search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('search-input').focus();
    }
    
    // Enter key in search input
    if (e.key === 'Enter' && e.target.id === 'search-input') {
      e.preventDefault();
      document.getElementById('search-form').dispatchEvent(new Event('submit'));
    }
  }

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    // Add keyboard shortcut hints
    const searchInput = document.getElementById('search-input');
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifier = isMac ? '⌘' : 'Ctrl';
    
    searchInput.placeholder += ` (${modifier}+K)`;
  }

  /**
   * Setup intersection observer for animations
   */
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe book cards as they're added
    const originalAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function(child) {
      const result = originalAppendChild.call(this, child);
      if (child.classList && child.classList.contains('book-card')) {
        child.style.opacity = '0';
        child.style.transform = 'translateY(30px)';
        observer.observe(child);
      }
      return result;
    };
  }

  /**
   * Show welcome animation
   */
  showWelcomeAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const searchContainer = document.querySelector('.search-container');
    
    // Animate elements in sequence
    setTimeout(() => {
      heroTitle.style.opacity = '1';
      heroTitle.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
      heroSubtitle.style.opacity = '1';
      heroSubtitle.style.transform = 'translateY(0)';
    }, 300);
    
    setTimeout(() => {
      searchContainer.style.opacity = '1';
      searchContainer.style.transform = 'translateY(0)';
    }, 500);
  }

  /**
   * Utility: Throttle function calls
   */
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Utility: Escape HTML
   */
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.bookSearchApp = new BookSearchApp();
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/js/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(registrationError => {
        console.log('ServiceWorker registration failed');
      });
  });
}