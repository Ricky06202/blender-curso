const API_BASE_URL = 'https://blenderapi.rsanjur.com/api';

// Helper function to get auth token
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

// Helper function for authenticated API calls
async function apiCall(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

export interface Chapter {
  id: number;
  order: number
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  slug: string;
}

export async function getChapters(): Promise<Chapter[]> {
  const response = await apiCall(`${API_BASE_URL}/chapters`);
  if (!response.ok) {
    throw new Error('Failed to fetch chapters');
  }
  return response.json();
}

export async function getChapterById(id: string | number): Promise<Chapter> {
  const response = await apiCall(`${API_BASE_URL}/chapters/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch chapter');
  }
  return response.json();
}

// Progress management functions
export async function getUserProgress(): Promise<number[]> {
  const response = await apiCall(`${API_BASE_URL}/chapters/progress/me`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch user progress');
  }
  
  const data = await response.json();
  
  // Extract chapter IDs from the progress array
  if (data && data.progress && Array.isArray(data.progress)) {
    const chapterIds = data.progress
      .filter((item: any) => item.isCompleted && item.chapterId)
      .map((item: any) => item.chapterId);
    
    return chapterIds;
  }
  
  return [];
}

export async function markChapterAsWatched(chapterId: number): Promise<void> {
  const response = await apiCall(`${API_BASE_URL}/chapters/${chapterId}/progress`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to mark chapter as watched');
  }
}

export async function removeChapterProgress(chapterId: number): Promise<void> {
  const response = await apiCall(`${API_BASE_URL}/chapters/${chapterId}/progress`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to remove chapter progress');
  }
}
