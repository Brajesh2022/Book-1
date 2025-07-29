import { SearchResponse, SummaryResponse, ApiError } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  private async fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || errorData.error || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async searchBooks(query: string, page: number = 1): Promise<SearchResponse> {
    const url = `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&page=${page}`;
    return this.fetchWithErrorHandling<SearchResponse>(url);
  }

  async getSummary(title: string, author: string): Promise<SummaryResponse> {
    const url = `${API_BASE_URL}/summarize`;
    return this.fetchWithErrorHandling<SummaryResponse>(url, {
      method: 'POST',
      body: JSON.stringify({ title, author }),
    });
  }

  async getHealthStatus() {
    const url = `${API_BASE_URL}/health`;
    return this.fetchWithErrorHandling(url);
  }
}

export const apiService = new ApiService();