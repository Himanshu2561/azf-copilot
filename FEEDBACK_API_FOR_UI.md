# Feedback API Documentation (For UI Team)

## Base URL
```
http://localhost:8001
```

---

## Endpoint: Submit Feedback

**POST** `/feedback`

Submit like/dislike feedback for a specific bot response.

### Headers
```
Content-Type: application/json
```

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `conversation_id` | string | ✅ Yes | The conversation ID from chat response |
| `activity_id` | string | ✅ Yes | The activity ID of the bot message |
| `reaction` | string | ✅ Yes | Either `"like"` or `"dislike"` |
| `feedback_text` | string | ❌ No | Optional text feedback (works for both like/dislike) |

### Response

**Success (200 OK):**
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "error": null
}
```

**Error (400 Bad Request):**
```json
{
  "detail": "Reaction must be 'like' or 'dislike'"
}
```

**Error (404 Not Found):**
```json
{
  "detail": "Conversation not found"
}
```

---

## cURL Examples

### 1. Like Without Text (Most Common)
```bash
curl -X POST http://localhost:8001/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": "abc123xyz789",
    "activity_id": "abc123xyz789|0000001",
    "reaction": "like"
  }'
```

### 2. Like With Text (Optional)
```bash
curl -X POST http://localhost:8001/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": "abc123xyz789",
    "activity_id": "abc123xyz789|0000001",
    "reaction": "like",
    "feedback_text": "Very clear and helpful explanation!"
  }'
```

### 3. Dislike Without Text
```bash
curl -X POST http://localhost:8001/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": "abc123xyz789",
    "activity_id": "abc123xyz789|0000001",
    "reaction": "dislike"
  }'
```

### 4. Dislike With Text (Recommended)
```bash
curl -X POST http://localhost:8001/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": "abc123xyz789",
    "activity_id": "abc123xyz789|0000001",
    "reaction": "dislike",
    "feedback_text": "The information was outdated"
  }'
```

---

## Complete Workflow Example

### Step 1: Get Chat Response
```bash
# Send a message
curl -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about admissions"}'
```

**Response:**
```json
{
  "success": true,
  "conversation_id": "DYVd1VmfG3H9cMEZ117n6c-eu",
  "responses": [
    {
      "type": "message",
      "text": "Here's information about admissions...",
      "activity_id": "DYVd1VmfG3H9cMEZ117n6c-eu|0000001",
      "attachments": [],
      "suggested_actions": []
    }
  ]
}
```

### Step 2: Save Required Values
From the chat response, extract:
- `conversation_id`: `"DYVd1VmfG3H9cMEZ117n6c-eu"`
- `activity_id`: `"DYVd1VmfG3H9cMEZ117n6c-eu|0000001"`

### Step 3: Submit Feedback
```bash
curl -X POST http://localhost:8001/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": "DYVd1VmfG3H9cMEZ117n6c-eu",
    "activity_id": "DYVd1VmfG3H9cMEZ117n6c-eu|0000001",
    "reaction": "like"
  }'
```

---

## JavaScript/TypeScript Examples

### Vanilla JavaScript
```javascript
async function submitFeedback(conversationId, activityId, reaction, feedbackText = null) {
  const payload = {
    conversation_id: conversationId,
    activity_id: activityId,
    reaction: reaction
  };
  
  // Add feedback text if provided
  if (feedbackText) {
    payload.feedback_text = feedbackText;
  }
  
  const response = await fetch('http://localhost:8001/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    throw new Error(`Feedback failed: ${response.statusText}`);
  }
  
  return await response.json();
}

// Usage Examples
// Like without text
await submitFeedback('abc123', 'abc123|0001', 'like');

// Like with text
await submitFeedback('abc123', 'abc123|0001', 'like', 'Very helpful!');

// Dislike with text
await submitFeedback('abc123', 'abc123|0001', 'dislike', 'Information was incorrect');
```

### React Example
```jsx
import { useState } from 'react';

function BotMessage({ message, activityId, conversationId }) {
  const [feedbackGiven, setFeedbackGiven] = useState(null);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const handleLike = async () => {
    try {
      await fetch('http://localhost:8001/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          activity_id: activityId,
          reaction: 'like'
        })
      });
      setFeedbackGiven('like');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const handleDislike = () => {
    setShowFeedbackInput(true);
  };

  const submitDislike = async () => {
    try {
      await fetch('http://localhost:8001/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          activity_id: activityId,
          reaction: 'dislike',
          feedback_text: feedbackText || undefined
        })
      });
      setFeedbackGiven('dislike');
      setShowFeedbackInput(false);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  return (
    <div className="bot-message">
      <p>{message}</p>
      
      {!feedbackGiven && (
        <div className="feedback-buttons">
          <button onClick={handleLike} disabled={feedbackGiven}>
            👍 Like
          </button>
          <button onClick={handleDislike} disabled={feedbackGiven}>
            👎 Dislike
          </button>
        </div>
      )}

      {showFeedbackInput && (
        <div className="feedback-form">
          <textarea
            placeholder="What went wrong? (optional)"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
          <button onClick={submitDislike}>Submit</button>
          <button onClick={() => setShowFeedbackInput(false)}>Cancel</button>
        </div>
      )}

      {feedbackGiven && (
        <p className="feedback-thank-you">
          Thank you for your feedback! {feedbackGiven === 'like' ? '👍' : '👎'}
        </p>
      )}
    </div>
  );
}
```

### Axios Example
```javascript
import axios from 'axios';

async function submitFeedback(conversationId, activityId, reaction, feedbackText = null) {
  try {
    const response = await axios.post('http://localhost:8001/feedback', {
      conversation_id: conversationId,
      activity_id: activityId,
      reaction: reaction,
      ...(feedbackText && { feedback_text: feedbackText })
    });
    
    return response.data;
  } catch (error) {
    console.error('Feedback submission failed:', error.response?.data || error.message);
    throw error;
  }
}
```

---

## TypeScript Types

```typescript
// Request type
interface FeedbackRequest {
  conversation_id: string;
  activity_id: string;
  reaction: 'like' | 'dislike';
  feedback_text?: string;
}

// Response type
interface FeedbackResponse {
  success: boolean;
  message: string;
  error: null | string;
}

// Chat response type (for reference)
interface ChatResponse {
  success: boolean;
  conversation_id: string;
  responses: Array<{
    type: string;
    text: string;
    activity_id: string;  // <- Use this for feedback
    attachments: any[];
    suggested_actions: any[];
  }>;
}
```

---

## Important Notes

### ✅ Supported Features
- ✅ Both `"like"` and `"dislike"` reactions
- ✅ Optional `feedback_text` for BOTH like and dislike
- ✅ Feedback is sent to Microsoft Copilot Studio Analytics
- ✅ Each bot message has a unique `activity_id`

### ⚠️ Requirements
- You MUST get `conversation_id` from the chat response
- You MUST get `activity_id` from each bot message in the responses array
- Only bot messages have `activity_id` (user messages don't)
- Can only submit feedback ONCE per activity_id (duplicate submissions will overwrite)

### 🚫 Validation Rules
- `reaction` must be exactly `"like"` or `"dislike"` (case-sensitive)
- `conversation_id` must be valid and active
- `activity_id` must belong to a bot message (not user message)
- `feedback_text` is optional but if provided, should not be empty string

---

## UX Recommendations

### For "Like" Button
**Option A: Simple (Recommended)**
- Click 👍 → Submit immediately without text
- Show checkmark or "Thanks!" message

**Option B: With Optional Text**
- Click 👍 → Show optional text input: "What did you like? (optional)"
- Allow submitting with or without text

### For "Dislike" Button (Recommended: Always ask for text)
- Click 👎 → Show required text input: "What went wrong?"
- Submit with text for better feedback quality

### After Submission
- Disable both buttons to prevent duplicate submissions
- Show visual confirmation: "Thank you for your feedback!"
- Optionally animate the selected button

---

## Testing

### Quick Test Script
```bash
#!/bin/bash

# Step 1: Get a chat response
RESPONSE=$(curl -s -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}')

# Step 2: Extract IDs
CONV_ID=$(echo $RESPONSE | jq -r '.conversation_id')
ACTIVITY_ID=$(echo $RESPONSE | jq -r '.responses[0].activity_id')

echo "Conversation ID: $CONV_ID"
echo "Activity ID: $ACTIVITY_ID"

# Step 3: Submit like feedback
curl -X POST http://localhost:8001/feedback \
  -H "Content-Type: application/json" \
  -d "{
    \"conversation_id\": \"$CONV_ID\",
    \"activity_id\": \"$ACTIVITY_ID\",
    \"reaction\": \"like\"
  }" | jq

# Step 4: Submit dislike with text
curl -X POST http://localhost:8001/feedback \
  -H "Content-Type: application/json" \
  -d "{
    \"conversation_id\": \"$CONV_ID\",
    \"activity_id\": \"$ACTIVITY_ID\",
    \"reaction\": \"dislike\",
    \"feedback_text\": \"Test feedback text\"
  }" | jq
```

---

## Viewing Feedback in Copilot Studio

1. Go to [https://copilotstudio.microsoft.com/](https://copilotstudio.microsoft.com/)
2. Select your agent: **Aspire Academy ChatAssist**
3. Navigate to: **Analytics → Customer Satisfaction**
4. **Important:** Check channel filter - set to **"Direct Line"** or **"All Channels"**
5. Wait 5-15 minutes for analytics to update

---

## Support

For backend issues or questions, contact the backend team.

**API Version:** 1.0.0  
**Last Updated:** December 5, 2025

