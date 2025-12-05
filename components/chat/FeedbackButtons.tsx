'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useChatStore, type FeedbackState } from '@/store/chatStore';

interface FeedbackButtonsProps {
    messageId: string;
    feedbackState: FeedbackState;
}

export default function FeedbackButtons({ messageId, feedbackState }: FeedbackButtonsProps) {
    const submitFeedback = useChatStore((state) => state.submitFeedback);
    const [selectedReaction, setSelectedReaction] = useState<'like' | 'dislike' | null>(null);
    const [feedbackText, setFeedbackText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const hasGivenFeedback = feedbackState === 'like' || feedbackState === 'dislike';
    const isPending = feedbackState === 'pending' || isSubmitting;
    const showInputArea = selectedReaction !== null && !hasGivenFeedback;

    // Auto-focus textarea when input area opens
    useEffect(() => {
        if (showInputArea && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [showInputArea]);

    const handleReactionClick = useCallback((reaction: 'like' | 'dislike') => {
        if (hasGivenFeedback || isPending) return;
        setSelectedReaction(reaction);
    }, [hasGivenFeedback, isPending]);

    const handleSubmit = useCallback(async () => {
        if (!selectedReaction || isPending) return;

        setIsSubmitting(true);
        const success = await submitFeedback(messageId, selectedReaction, feedbackText);
        setIsSubmitting(false);

        if (success) {
            setFeedbackText('');
            setSelectedReaction(null);
        }
    }, [messageId, selectedReaction, feedbackText, isPending, submitFeedback]);

    const handleCancel = useCallback(() => {
        setSelectedReaction(null);
        setFeedbackText('');
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            handleCancel();
        }
        // Submit on Ctrl/Cmd + Enter
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleSubmit();
        }
    }, [handleCancel, handleSubmit]);

    // Already given feedback - show confirmation
    if (hasGivenFeedback) {
        return (
            <div className="flex items-center gap-2 mt-2 animate-in fade-in duration-300">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50">
                    {feedbackState === 'like' ? (
                        <>
                            <ThumbsUpFilledIcon className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-xs text-emerald-600 font-medium">Thanks for your feedback!</span>
                        </>
                    ) : (
                        <>
                            <ThumbsDownFilledIcon className="w-3.5 h-3.5 text-rose-500" />
                            <span className="text-xs text-rose-500 font-medium">Thanks for your feedback!</span>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="mt-2">
            {/* Feedback buttons */}
            <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-400 mr-1">Was this helpful?</span>

                <button
                    onClick={() => handleReactionClick('like')}
                    disabled={isPending}
                    className={`
            group flex items-center justify-center w-7 h-7 rounded-full
            transition-all duration-200 ease-out
            ${selectedReaction === 'like' ? 'bg-emerald-100 scale-110' : ''}
            ${isPending
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-emerald-50 hover:scale-110 active:scale-95'
                        }
          `}
                    title="Helpful"
                    aria-label="Mark as helpful"
                >
                    {selectedReaction === 'like' ? (
                        <ThumbsUpFilledIcon className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                        <ThumbsUpIcon className={`
              w-3.5 h-3.5 transition-colors duration-200
              ${isPending ? 'text-gray-300' : 'text-gray-400 group-hover:text-emerald-600'}
            `} />
                    )}
                </button>

                <button
                    onClick={() => handleReactionClick('dislike')}
                    disabled={isPending}
                    className={`
            group flex items-center justify-center w-7 h-7 rounded-full
            transition-all duration-200 ease-out
            ${selectedReaction === 'dislike' ? 'bg-rose-100 scale-110' : ''}
            ${isPending
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-rose-50 hover:scale-110 active:scale-95'
                        }
          `}
                    title="Not helpful"
                    aria-label="Mark as not helpful"
                >
                    {selectedReaction === 'dislike' ? (
                        <ThumbsDownFilledIcon className="w-3.5 h-3.5 text-rose-500" />
                    ) : (
                        <ThumbsDownIcon className={`
              w-3.5 h-3.5 transition-colors duration-200
              ${isPending ? 'text-gray-300' : 'text-gray-400 group-hover:text-rose-500'}
            `} />
                    )}
                </button>

                {isPending && !showInputArea && (
                    <div className="ml-1">
                        <LoadingSpinner className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                )}
            </div>

            {/* Inline feedback input area */}
            {showInputArea && (
                <div
                    className="mt-2 animate-in slide-in-from-top-2 fade-in duration-200"
                    onKeyDown={handleKeyDown}
                >
                    <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                        {/* Header */}
                        <div className="px-3 py-2 flex items-center gap-2 border-b border-gray-200 bg-gray-100">
                            {selectedReaction === 'like' ? (
                                <>
                                    <ThumbsUpFilledIcon className="w-4 h-4 text-emerald-600" />
                                    <span className="text-xs font-medium text-gray-700">
                                        What did you like? (optional)
                                    </span>
                                </>
                            ) : (
                                <>
                                    <ThumbsDownFilledIcon className="w-4 h-4 text-rose-500" />
                                    <span className="text-xs font-medium text-gray-700">
                                        What went wrong? (optional)
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Textarea */}
                        <textarea
                            ref={textareaRef}
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder={
                                selectedReaction === 'like'
                                    ? "This was helpful because..."
                                    : "The response was incorrect, incomplete, or unclear..."
                            }
                            className="w-full px-3 py-2 text-sm resize-none focus:outline-none bg-white text-gray-900 placeholder:text-gray-400"
                            rows={2}
                            disabled={isSubmitting}
                        />

                        {/* Actions */}
                        <div className="px-3 py-2 flex items-center justify-between gap-2 border-t border-gray-200 bg-gray-50">
                            <span className="text-[10px] text-gray-500">
                                Press Esc to cancel • ⌘+Enter to submit
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCancel}
                                    disabled={isSubmitting}
                                    className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 
                    rounded-lg hover:bg-gray-50 transition-colors duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className={`
                    px-3 py-1.5 text-xs font-medium text-white rounded-lg
                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center gap-1.5
                    ${selectedReaction === 'like'
                                            ? 'bg-emerald-600 hover:bg-emerald-700'
                                            : 'bg-rose-500 hover:bg-rose-600'
                                        }
                  `}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <LoadingSpinner className="w-3 h-3 text-white" />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        'Submit'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Icon components
function ThumbsUpIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
    );
}

function ThumbsUpFilledIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
        </svg>
    );
}

function ThumbsDownIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
        </svg>
    );
}

function ThumbsDownFilledIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.73 5.25h1.035A7.465 7.465 0 0118 9.375a7.465 7.465 0 01-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218C7.74 15.724 7.366 15 6.748 15H3.622c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 011.5 12c0-2.848.992-5.464 2.649-7.521.388-.482.987-.729 1.605-.729H9.77a4.5 4.5 0 011.423.23l3.114 1.04a4.5 4.5 0 001.423.23zM21.669 13.773c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.959 8.959 0 01-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227z" />
        </svg>
    );
}

function LoadingSpinner({ className }: { className?: string }) {
    return (
        <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    );
}
