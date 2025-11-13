const API_BASE_URL = 'https://blenderapi.rsanjur.com/api';

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
  const response = await fetch(`${API_BASE_URL}/chapters`);
  if (!response.ok) {
    throw new Error('Failed to fetch chapters');
  }
  return response.json();
}

export async function getChapterById(id: string | number): Promise<Chapter> {
  const response = await fetch(`${API_BASE_URL}/chapters/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch chapter');
  }
  return response.json();
}
