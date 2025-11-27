import { create } from 'zustand';
import { chatApi, type ChatMessage, type ChatResponse, type NewsItem, type EventItem } from '@/lib/api/chat';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  attachments?: ChatMessage['attachments'];
  suggestedActions?: ChatMessage['suggested_actions'];
  secondaryOutput?: ChatMessage['secondary_output'];
}

interface ChatState {
  messages: Message[];
  conversationId: string | null;
  isLoading: boolean;
  error: string | null;
  isTyping: boolean;
  isInitialized: boolean;
  
  // Actions
  sendMessage: (text: string, files?: File[]) => Promise<void>;
  initializeConversation: () => Promise<void>;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setConversationId: (id: string | null) => void;
  clearChat: () => void;
  setError: (error: string | null) => void;
  setTyping: (typing: boolean) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  conversationId: null,
  isLoading: false,
  error: null,
  isTyping: false,
  isInitialized: false,

  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    };
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  setConversationId: (id) => {
    set({ conversationId: id });
  },

  clearChat: () => {
    set({
      messages: [],
      conversationId: null,
      error: null,
      isInitialized: false,
    });
  },

  setError: (error) => {
    set({ error });
  },

  setTyping: (typing) => {
    set({ isTyping: typing });
  },

  initializeConversation: async () => {
    const state = get();
    
    // Don't initialize if already initialized or if there's already a conversation ID
    if (state.isInitialized || state.conversationId) {
      return;
    }

    set({ isLoading: true, error: null, isTyping: true });

    try {
      // Send empty message without conversation_id to initialize conversation
      const response: ChatResponse = await chatApi.sendMessage('', undefined);

      if (response.success) {
        // Store conversation ID from response
        if (response.conversation_id) {
          get().setConversationId(response.conversation_id);
        }

        // Add bot greeting message
        response.responses.forEach((botMessage) => {
          get().addMessage({
            text: botMessage.text,
            sender: 'bot',
            attachments: botMessage.attachments,
            suggestedActions: botMessage.suggested_actions,
            secondaryOutput: botMessage.secondary_output,
          });
        });

        set({ isInitialized: true });
      } else {
        throw new Error(response.error || 'Failed to initialize conversation');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      get().setError(errorMessage);
    } finally {
      set({ isLoading: false, isTyping: false });
    }
  },

  sendMessage: async (text: string, files?: File[]) => {
    const state = get();
    
    // Initialize conversation if not already initialized
    if (!state.isInitialized && !state.conversationId) {
      await get().initializeConversation();
    }
    
    // Add user message immediately
    get().addMessage({
      text,
      sender: 'user',
    });

    set({ isLoading: true, error: null, isTyping: true });

    try {
      // Use conversationId if available, otherwise undefined (will be set from response)
      const response: ChatResponse = await chatApi.sendMessage(
        text,
        state.conversationId || undefined,
        files
      );

      if (response.success) {
        // Update conversation ID
        if (response.conversation_id) {
          get().setConversationId(response.conversation_id);
        }

        // Add bot responses
        response.responses.forEach((botMessage) => {
          get().addMessage({
            text: botMessage.text,
            sender: 'bot',
            attachments: botMessage.attachments,
            suggestedActions: botMessage.suggested_actions,
            secondaryOutput: botMessage.secondary_output,
          });
        });
      } else {
        throw new Error(response.error || 'Failed to get response');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      get().setError(errorMessage);
      get().addMessage({
        text: `Sorry, I encountered an error: ${errorMessage}`,
        sender: 'bot',
      });
    } finally {
      set({ isLoading: false, isTyping: false });
    }
  },
}));

