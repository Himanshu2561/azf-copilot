const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ChatMessage {
  type: 'message';
  text: string;
  attachments: Attachment[];
  suggested_actions: SuggestedAction[];
  secondary_output?: SecondaryOutput | null;
}

export interface Citation {
  url: string;
  title: string;
}

export interface SecondaryOutput {
  events?: EventItem[];
  news?: NewsItem[];
  citations?: Citation[];
}

export interface Attachment {
  contentType: string;  // e.g., "image/png", "application/pdf", "application/vnd.microsoft.card.hero"
  content?: HeroCardContent | AdaptiveCardContent | ReceiptCardContent | any;
  contentUrl?: string | null;
  name?: string | null;
  thumbnailUrl?: string | null;
}

export interface HeroCardContent {
  title?: string;
  subtitle?: string;
  text?: string;
  images?: Array<{ url: string; alt?: string }>;
  buttons?: Array<{
    type: string;
    title: string;
    value: string;
  }>;
}

export interface AdaptiveCardContent {
  $schema?: string;
  type: string;
  version?: string;
  body?: any[];
  actions?: any[];
}

export interface ReceiptCardContent {
  title?: string;
  items?: Array<{
    title: string;
    subtitle?: string;
    text?: string;
    image?: { url: string; alt?: string };
    price?: string;
    quantity?: string;
  }>;
  total?: string;
}

export interface SuggestedAction {
  type: string;  // e.g., "imBack", "postBack"
  title: string;
  value: string;
  image?: string | null;
}

export interface NewsItem {
  news_name: string;
  news_link: string;
  news_image_url: string;
  news_summary: string;
  news_date: string;  // Format: "YYYY-MM-DD" or "DD MMM YYYY"
  news_category?: string;
}

export interface EventItem {
  event_name: string;
  event_link: string;
  event_image_url: string;
  event_summary: string;
  event_date: string;  // Format: "YYYY-MM-DD"
  event_location: string;
  is_upcoming?: boolean;
}

export interface ChatResponse {
  success: boolean;
  responses: ChatMessage[];
  conversation_id: string | null;
  error: string | null;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
}

export const chatApi = {
  async sendMessage(message: string, conversationId?: string, files?: File[]): Promise<ChatResponse> {
    // Use multipart/form-data if files are provided, otherwise use JSON
    if (files && files.length > 0) {
      const formData = new FormData();
      formData.append('message', message);
      if (conversationId) {
        formData.append('conversation_id', conversationId);
      }
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Network error' }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } else {
      // Build request body - only include conversation_id if it exists
      const requestBody: { message: string; conversation_id?: string } = {
        message,
      };
      if (conversationId) {
        requestBody.conversation_id = conversationId;
      }

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Network error' }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    }
  },

  async checkHealth(): Promise<{ status: string; agent: string; environment: string; api: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    return response.json();
  },
};

