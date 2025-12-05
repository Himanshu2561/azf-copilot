import { create } from "zustand";
import {
  chatApi,
  type ChatMessage,
  type ChatResponse,
  type NewsItem,
  type EventItem,
} from "@/lib/api/chat";

export type FeedbackState = "none" | "like" | "dislike" | "pending";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  activityId?: string;
  feedbackState: FeedbackState;
  attachments?: ChatMessage["attachments"];
  suggestedActions?: ChatMessage["suggested_actions"];
  secondaryOutput?: ChatMessage["secondary_output"];
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
  addMessage: (
    message: Omit<Message, "id" | "timestamp" | "feedbackState">
  ) => void;
  setConversationId: (id: string | null) => void;
  clearChat: () => void;
  setError: (error: string | null) => void;
  setTyping: (typing: boolean) => void;
  submitFeedback: (
    messageId: string,
    reaction: "like" | "dislike",
    feedbackText?: string
  ) => Promise<boolean>;
  updateMessageFeedback: (messageId: string, state: FeedbackState) => void;
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
      feedbackState: "none",
    };
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  updateMessageFeedback: (messageId, state) => {
    set((prev) => ({
      messages: prev.messages.map((msg) =>
        msg.id === messageId ? { ...msg, feedbackState: state } : msg
      ),
    }));
  },

  submitFeedback: async (messageId, reaction, feedbackText) => {
    const state = get();
    const message = state.messages.find((m) => m.id === messageId);

    if (!message?.activityId || !state.conversationId) {
      console.error(
        "Cannot submit feedback: missing activityId or conversationId"
      );
      return false;
    }

    // Set pending state
    get().updateMessageFeedback(messageId, "pending");

    try {
      await chatApi.submitFeedback(
        state.conversationId,
        message.activityId,
        reaction,
        feedbackText
      );

      // Update to final state
      get().updateMessageFeedback(messageId, reaction);
      return true;
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      // Reset to none on error
      get().updateMessageFeedback(messageId, "none");
      return false;
    }
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
      const response: ChatResponse = await chatApi.sendMessage("", undefined);

      if (response.success) {
        // Store conversation ID from response
        if (response.conversation_id) {
          get().setConversationId(response.conversation_id);
        }

        // Add bot greeting message
        response.responses.forEach((botMessage) => {
          get().addMessage({
            text: botMessage.text,
            sender: "bot",
            activityId: botMessage.activity_id,
            attachments: botMessage.attachments,
            suggestedActions: botMessage.suggested_actions,
            secondaryOutput: botMessage.secondary_output,
          });
        });

        set({ isInitialized: true });
      } else {
        throw new Error(response.error || "Failed to initialize conversation");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
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
      sender: "user",
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
            sender: "bot",
            activityId: botMessage.activity_id,
            attachments: botMessage.attachments,
            suggestedActions: botMessage.suggested_actions,
            secondaryOutput: botMessage.secondary_output,
          });
        });
      } else {
        throw new Error(response.error || "Failed to get response");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      get().setError(errorMessage);
      get().addMessage({
        text: `Sorry, I encountered an error: ${errorMessage}`,
        sender: "bot",
      });
    } finally {
      set({ isLoading: false, isTyping: false });
    }
  },
}));
