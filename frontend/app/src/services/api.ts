import { getToken } from '@/utils/auth';

const API_URL = 'http://localhost:8000/api/v1';

interface ApiOptions {
  method: string;
  headers: Record<string, string>;
  body?: string;
}

async function fetcher<T>(url: string, options: ApiOptions): Promise<T> {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'An error occurred');
  }
  
  return response.json();
}

export async function apiRequest<T>(
  endpoint: string, 
  method: string = 'GET', 
  data?: any, 
  requiresAuth: boolean = true
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const options: ApiOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (requiresAuth) {
    const token = getToken();
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  return fetcher<T>(url, options);
}

// Auth APIs
export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export async function registerUser(data: RegisterData): Promise<UserResponse> {
  return apiRequest<UserResponse>('/auth/register', 'POST', data, false);
}

export async function loginUser(data: LoginData): Promise<TokenResponse> {
  const formData = new URLSearchParams();
  formData.append('username', data.username);
  formData.append('password', data.password);
  
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Login failed');
  }
  
  return response.json();
}

export async function getCurrentUser(): Promise<UserResponse> {
  return apiRequest<UserResponse>('/auth/me');
}

export async function updateUser(data: {
  email?: string;
  username?: string;
  password?: string;
}): Promise<UserResponse> {
  return apiRequest<UserResponse>('/auth/me', 'PUT', data);
}

export async function deleteUser(): Promise<void> {
  return apiRequest<void>('/auth/me', 'DELETE');
}

// Q&A APIs
export interface QuestionRequest {
  question: string;
  context?: string;
}

export interface QuestionResponse {
  answer: string;
  success: boolean;
  request_id: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface HistoryItem {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
}

export interface HistoryResponse {
  items: HistoryItem[];
  count: number;
}

export async function askQuestion(data: QuestionRequest): Promise<QuestionResponse> {
  return apiRequest<QuestionResponse>('/ask', 'POST', data);
}

export async function getHistory(limit: number = 10, skip: number = 0): Promise<HistoryResponse> {
  return apiRequest<HistoryResponse>(`/history?limit=${limit}&skip=${skip}`);
}