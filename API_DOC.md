# Copilot Studio Chat API - UI Integration Guide

## Base URL
```
http://localhost:8000
```

---

## API Endpoints

### 1. Health Check
**GET** `/health`

Check if the API is running.

**cURL Example:**
```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "ok",
  "agent": "your-agent-id",
  "environment": "your-environment-id",
  "api": "DirectLine"
}
```

---

### 2. Chat Endpoint
**POST** `/chat`

Main endpoint for chatting with the Copilot Studio agent.

**Content-Type:** `application/json` OR `multipart/form-data`

---

## Request Structure (Input)

### JSON Request Format

```typescript
interface ChatRequest {
  message?: string;              // User's message (optional for new conversations)
  conversation_id?: string;      // Conversation ID to continue existing conversation
  attachments?: Attachment[];    // Array of attachment objects (optional)
}

interface Attachment {
  contentType: string;           // MIME type (e.g., "image/png", "application/pdf")
  contentUrl?: string;           // URL to the attachment
  name?: string;                // Name of the attachment
  content?: object;              // Additional content data
}
```

### Multipart/Form-Data Request Format

For file uploads, use `multipart/form-data`:

- `message` (string, optional): User's message
- `conversation_id` (string, optional): Conversation ID
- `files` (file[], optional): One or more files to upload

---

## Response Structure (Output)

### Success Response

```typescript
interface ChatResponse {
  success: boolean;              // Always true for successful requests
  conversation_id: string;       // Unique conversation ID (SAVE THIS!)
  responses: ResponseItem[];     // Array of bot responses
  error: null;                   // null on success
}

interface ResponseItem {
  type: string;                  // Usually "message"
  text: string;                  // Bot's text response (cleaned, JSON removed)
  attachments: Attachment[];     // Array of attachment objects
  suggested_actions: SuggestedAction[];  // Array of action buttons
  secondary_output?: any[][];    // Extracted JSON arrays (events, news, etc.)
}

interface Attachment {
  contentType: string;
  content: object;               // Card content or attachment data
  contentUrl?: string;
  name?: string;
  thumbnailUrl?: string;
}

interface SuggestedAction {
  type: string;                  // Usually "imBack" or "postBack"
  title: string;                 // Button label
  value: string;                 // Value sent when clicked
  image?: string;                // Optional button image URL
}
```

### Error Response

```typescript
interface ErrorResponse {
  success: false;
  conversation_id: string | null;
  responses: [];
  error: string;                 // Error message
}
```

---

## Request Examples

### 1. Initialize New Conversation (Get Greeting)

**Request:**
```json
POST /chat
Content-Type: application/json

{
  "message": ""
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": ""}'
```

**Response:**
```json
{
  "success": true,
  "conversation_id": "abc123xyz789",
  "responses": [
    {
      "type": "message",
      "text": "Hello! How can I help you today?",
      "attachments": [],
      "suggested_actions": []
    }
  ],
  "error": null
}
```

---

### 2. Send Text Message

**Request:**
```json
POST /chat
Content-Type: application/json

{
  "message": "What events are happening at Aspirezone?",
  "conversation_id": "abc123xyz789"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What events are happening at Aspirezone?",
    "conversation_id": "abc123xyz789"
  }'
```

**Response:**
```json
{
  "success": true,
  "conversation_id": "abc123xyz789",
  "responses": [
    {
      "type": "message",
      "text": "Here are the upcoming events at Aspirezone:",
      "attachments": [],
      "suggested_actions": [],
      "secondary_output": [
        [
          {
            "event_name": "Paralympic Day 2025",
            "event_link": "https://www.aspirezone.qa/en/events/paralympic-day-2025",
            "event_image_url": "https://www.aspirezone.qa/WebContent/aspirezonecropped/638985421537247963.jpg",
            "event_summary": "Celebrate Paralympic Day at Aspire Dome on December 3, 2025.",
            "event_date": "2025-12-03",
            "event_location": "Aspire Dome",
            "is_upcoming": true
          },
          {
            "event_name": "Relay for Life 2025",
            "event_link": "https://www.aspirezone.qa/en/events/relay-for-life-2025",
            "event_image_url": "https://www.aspirezone.qa/WebContent/aspirezonecropped/638960455857304145.jpg",
            "event_summary": "Join Relay for Life 2025 at Ladies Sports Hall on October 31, 2025.",
            "event_date": "2025-10-31",
            "event_location": "Ladies Sports Hall",
            "is_upcoming": false
          }
        ]
      ]
    }
  ],
  "error": null
}
```

---

### 3. Send Message with Attachment (JSON)

**Request:**
```json
POST /chat
Content-Type: application/json

{
  "message": "What do you think about this image?",
  "conversation_id": "abc123xyz789",
  "attachments": [
    {
      "contentType": "image/png",
      "contentUrl": "https://example.com/image.png",
      "name": "image.png"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What do you think about this image?",
    "conversation_id": "abc123xyz789",
    "attachments": [
      {
        "contentType": "image/png",
        "contentUrl": "https://example.com/image.png",
        "name": "image.png"
      }
    ]
  }'
```

---

### 4. Upload File (Multipart)

**Request:**
```
POST /chat
Content-Type: multipart/form-data

message: "Please analyze this document"
conversation_id: "abc123xyz789"
files: [file1.pdf, file2.jpg]
```

**cURL Example:**
```bash
# Single file upload
curl -X POST http://localhost:8000/chat \
  -F "message=Please analyze this document" \
  -F "conversation_id=abc123xyz789" \
  -F "files=@/path/to/document.pdf"

# Multiple files upload
curl -X POST http://localhost:8000/chat \
  -F "message=Please analyze these files" \
  -F "conversation_id=abc123xyz789" \
  -F "files=@/path/to/file1.pdf" \
  -F "files=@/path/to/file2.jpg"
```

---

## Response Data Structures

### Secondary Output - Events

When the bot returns event data, it appears in `secondary_output[0]`:

```typescript
interface Event {
  event_name: string;
  event_link: string;
  event_image_url: string;
  event_summary: string;
  event_date: string;           // Format: "YYYY-MM-DD"
  event_location: string;
  is_upcoming: boolean;
}
```

### Secondary Output - News

When the bot returns news data:

```typescript
interface News {
  news_name: string;
  news_link: string;
  news_image_url: string;
  news_summary: string;
  news_date: string;            // Format: "YYYY-MM-DD"
  news_category: string;
}
```

---

## JavaScript/TypeScript Integration Examples

### Initialize Conversation

```javascript
async function initializeConversation() {
  const response = await fetch('http://localhost:8000/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: ''
    })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Save conversation_id in localStorage or state
  localStorage.setItem('conversation_id', data.conversation_id);
  
  return data;
}
```

### Send Message

```javascript
async function sendMessage(message, conversationId) {
  const response = await fetch('http://localhost:8000/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message,
      conversation_id: conversationId
    })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}
```

### Handle Response with Events

```javascript
async function handleChatResponse(response) {
  const { success, conversation_id, responses, error } = response;
  
  if (!success || error) {
    console.error('Error:', error);
    return;
  }
  
  // Update conversation_id
  localStorage.setItem('conversation_id', conversation_id);
  
  // Process each response
  responses.forEach(responseItem => {
    // Display text message
    if (responseItem.text) {
      displayMessage(responseItem.text);
    }
    
    // Display suggested actions (buttons)
    if (responseItem.suggested_actions && responseItem.suggested_actions.length > 0) {
      displaySuggestedActions(responseItem.suggested_actions);
    }
    
    // Display structured data (events, news, etc.)
    if (responseItem.secondary_output && responseItem.secondary_output.length > 0) {
      const structuredData = responseItem.secondary_output[0];
      
      // Check if it's events
      if (structuredData.length > 0 && structuredData[0].event_name) {
        displayEvents(structuredData);
      }
      
      // Check if it's news
      if (structuredData.length > 0 && structuredData[0].news_name) {
        displayNews(structuredData);
      }
    }
    
    // Display attachments (cards)
    if (responseItem.attachments && responseItem.attachments.length > 0) {
      displayAttachments(responseItem.attachments);
    }
  });
}

// Example: Display events
function displayEvents(events) {
  events.forEach(event => {
    // Create event card with:
    // - event.event_name
    // - event.event_image_url
    // - event.event_summary
    // - event.event_date
    // - event.event_location
    // - event.is_upcoming
    // - event.event_link (for navigation)
  });
}
```

### Upload File

```javascript
async function uploadFile(file, message = null, conversationId) {
  const formData = new FormData();
  
  if (message) {
    formData.append('message', message);
  }
  formData.append('conversation_id', conversationId);
  formData.append('files', file);
  
  const response = await fetch('http://localhost:8000/chat', {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}
```

### Complete Chat Flow

```javascript
class ChatAPI {
  constructor(baseUrl = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
    this.conversationId = null;
  }
  
  async initialize() {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '' })
    });
    
    const data = await response.json();
    this.conversationId = data.conversation_id;
    return data;
  }
  
  async sendMessage(message) {
    if (!this.conversationId) {
      await this.initialize();
    }
    
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        conversation_id: this.conversationId
      })
    });
    
    const data = await response.json();
    this.conversationId = data.conversation_id;
    return data;
  }
  
  async uploadFile(file, message = null) {
    if (!this.conversationId) {
      await this.initialize();
    }
    
    const formData = new FormData();
    if (message) formData.append('message', message);
    formData.append('conversation_id', this.conversationId);
    formData.append('files', file);
    
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    this.conversationId = data.conversation_id;
    return data;
  }
}

// Usage
const chat = new ChatAPI();
await chat.initialize();
const response = await chat.sendMessage("What events are happening?");
```

---

## Error Handling

### HTTP Status Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid request format or missing required fields |
| 500 | Internal Server Error - Server-side error |

### Error Response Format

```json
{
  "success": false,
  "conversation_id": "abc123xyz789",
  "responses": [],
  "error": "Error message describing what went wrong"
}
```

### Error Handling Example

```javascript
try {
  const response = await fetch('http://localhost:8000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Hello' })
  });
  
  const data = await response.json();
  
  if (!data.success) {
    console.error('API Error:', data.error);
    // Handle error in UI
    return;
  }
  
  // Process successful response
  handleChatResponse(data);
  
} catch (error) {
  console.error('Network Error:', error);
  // Handle network error
}
```

---

## Important Notes for UI Developers

1. **Conversation ID Management**
   - Always save the `conversation_id` from the first response
   - Include it in all subsequent requests to maintain conversation context
   - Store it in localStorage, sessionStorage, or application state

2. **Initialization**
   - Send `{"message": ""}` to start a new conversation
   - The bot will automatically send a greeting message

3. **Secondary Output**
   - When the bot returns structured data (events, news), it's automatically extracted
   - Check `responseItem.secondary_output[0]` for structured data arrays
   - The `text` field is cleaned (JSON arrays removed) for display

4. **Response Timing**
   - The API waits up to 30 seconds for bot responses
   - Responses may take 3-10 seconds typically
   - Show a loading indicator while waiting

5. **CORS**
   - CORS is enabled for all origins
   - No additional CORS configuration needed

6. **Multiple Responses**
   - The `responses` array may contain multiple items
   - Process each item in the array

7. **Suggested Actions**
   - Display as clickable buttons
   - When clicked, send the `value` as a new message

8. **Attachments**
   - Can be cards, images, or other rich content
   - Check `contentType` to determine how to render

---

## API Testing

### Using cURL

#### 1. Health Check

```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "ok",
  "agent": "your-agent-id",
  "environment": "your-environment-id",
  "api": "DirectLine"
}
```

---

#### 2. Initialize New Conversation (Get Greeting)

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": ""}'
```

**Response:**
```json
{
  "success": true,
  "conversation_id": "abc123xyz789",
  "responses": [
    {
      "type": "message",
      "text": "Hello! How can I help you today?",
      "attachments": [],
      "suggested_actions": []
    }
  ],
  "error": null
}
```

**Save the `conversation_id` from the response for subsequent requests.**

---

#### 3. Send Text Message

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What events are happening at Aspirezone?",
    "conversation_id": "abc123xyz789"
  }'
```

**Pretty-printed version:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What events are happening at Aspirezone?",
    "conversation_id": "abc123xyz789"
  }' | jq
```

---

#### 4. Send Message with Attachment (JSON)

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What do you think about this image?",
    "conversation_id": "abc123xyz789",
    "attachments": [
      {
        "contentType": "image/png",
        "contentUrl": "https://example.com/image.png",
        "name": "image.png"
      }
    ]
  }'
```

**Multiple attachments:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Please analyze these images",
    "conversation_id": "abc123xyz789",
    "attachments": [
      {
        "contentType": "image/png",
        "contentUrl": "https://example.com/image1.png",
        "name": "image1.png"
      },
      {
        "contentType": "image/jpeg",
        "contentUrl": "https://example.com/image2.jpg",
        "name": "image2.jpg"
      }
    ]
  }'
```

---

#### 5. Upload File (Multipart/Form-Data)

**Single file upload:**
```bash
curl -X POST http://localhost:8000/chat \
  -F "message=Please analyze this document" \
  -F "conversation_id=abc123xyz789" \
  -F "files=@/path/to/document.pdf"
```

**Multiple files upload:**
```bash
curl -X POST http://localhost:8000/chat \
  -F "message=Please analyze these files" \
  -F "conversation_id=abc123xyz789" \
  -F "files=@/path/to/file1.pdf" \
  -F "files=@/path/to/file2.jpg"
```

**File upload without message:**
```bash
curl -X POST http://localhost:8000/chat \
  -F "conversation_id=abc123xyz789" \
  -F "files=@/path/to/document.pdf"
```

---

#### 6. Complete Conversation Flow Example

```bash
# Step 1: Initialize conversation
CONV_ID=$(curl -s -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": ""}' | jq -r '.conversation_id')

echo "Conversation ID: $CONV_ID"

# Step 2: Send first message
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"What events are happening?\",
    \"conversation_id\": \"$CONV_ID\"
  }" | jq

# Step 3: Continue conversation
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"Tell me more about the first event\",
    \"conversation_id\": \"$CONV_ID\"
  }" | jq
```

---

#### 7. Using Variables for Cleaner Scripts

```bash
# Set base URL
BASE_URL="http://localhost:8000"

# Initialize conversation
RESPONSE=$(curl -s -X POST "$BASE_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": ""}')

# Extract conversation ID
CONV_ID=$(echo $RESPONSE | jq -r '.conversation_id')
echo "Conversation started: $CONV_ID"

# Send message
curl -X POST "$BASE_URL/chat" \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"Hello, how are you?\",
    \"conversation_id\": \"$CONV_ID\"
  }" | jq '.responses[0].text'
```

---

#### 8. Error Handling Examples

**Missing required field (for existing conversation):**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": "abc123xyz789"
  }'
```

**Response (400 Bad Request):**
```json
{
  "detail": "Either 'message' or 'attachments' must be provided"
}
```

**Invalid JSON:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test"'
```

**Response (400 Bad Request):**
```json
{
  "detail": "Invalid JSON in request body"
}
```

---

#### 9. Pretty Print Responses with jq

**Install jq (if not installed):**
```bash
# Ubuntu/Debian
sudo apt-get install jq

# macOS
brew install jq
```

**Pretty print full response:**
```bash
curl -s -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What events are happening?",
    "conversation_id": "abc123xyz789"
  }' | jq
```

**Extract specific fields:**
```bash
# Get conversation ID only
curl -s -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": ""}' | jq -r '.conversation_id'

# Get bot's text response only
curl -s -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello",
    "conversation_id": "abc123xyz789"
  }' | jq -r '.responses[0].text'

# Get events from secondary_output
curl -s -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What events are happening?",
    "conversation_id": "abc123xyz789"
  }' | jq '.responses[0].secondary_output[0]'
```

---

#### 10. Testing with Verbose Output

**See request/response headers:**
```bash
curl -v -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

**Save response to file:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What events are happening?",
    "conversation_id": "abc123xyz789"
  }' > response.json
```

---

#### 11. Testing Different Content Types

**JSON request:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "conversation_id": "abc123"}'
```

**Multipart request (file upload):**
```bash
curl -X POST http://localhost:8000/chat \
  -F "message=Hello" \
  -F "conversation_id=abc123" \
  -F "files=@document.pdf"
```

---

#### 12. Quick Test Script

Save this as `test_api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:8000"

echo "=== Testing Copilot Studio Chat API ==="
echo ""

# Health check
echo "1. Health Check:"
curl -s "$BASE_URL/health" | jq
echo ""

# Initialize conversation
echo "2. Initializing conversation:"
INIT_RESPONSE=$(curl -s -X POST "$BASE_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": ""}')

CONV_ID=$(echo $INIT_RESPONSE | jq -r '.conversation_id')
echo "Conversation ID: $CONV_ID"
echo "Greeting: $(echo $INIT_RESPONSE | jq -r '.responses[0].text')"
echo ""

# Send message
echo "3. Sending message:"
curl -s -X POST "$BASE_URL/chat" \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"What events are happening at Aspirezone?\",
    \"conversation_id\": \"$CONV_ID\"
  }" | jq '.responses[0] | {text, has_events: (.secondary_output != null)}'
echo ""

echo "=== Test Complete ==="
```

**Make it executable and run:**
```bash
chmod +x test_api.sh
./test_api.sh
```

---

### Interactive API Documentation

Swagger UI is available at:
```
http://localhost:8000/docs
```

---

## Data Type Reference

### Request Types

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | No* | User's message text |
| `conversation_id` | string | No | Conversation ID for continuing conversation |
| `attachments` | Attachment[] | No | Array of attachment objects (JSON only) |
| `files` | File[] | No | Files to upload (multipart only) |

*`message` is optional for new conversations (to get greeting), but required for existing conversations if no attachments/files are provided.

### Response Types

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Request success status |
| `conversation_id` | string | Unique conversation identifier |
| `responses` | ResponseItem[] | Array of bot responses |
| `error` | string \| null | Error message if request failed |

### ResponseItem Types

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Response type (usually "message") |
| `text` | string | Bot's text response |
| `attachments` | Attachment[] | Array of attachment objects |
| `suggested_actions` | SuggestedAction[] | Array of action buttons |
| `secondary_output` | any[][] \| null | Extracted JSON arrays (events, news, etc.) |

---

## Quick Start Checklist

- [ ] Initialize conversation with empty message
- [ ] Save `conversation_id` from response
- [ ] Include `conversation_id` in all subsequent requests
- [ ] Handle `responses` array (may contain multiple items)
- [ ] Check `secondary_output` for structured data (events/news)
- [ ] Display `suggested_actions` as clickable buttons
- [ ] Show loading indicator (responses can take 3-10 seconds)
- [ ] Handle errors gracefully
- [ ] Test with different message types

---

**Last Updated:** 2025-01-XX  
**API Version:** 1.0.0  
**Base URL:** http://localhost:8000
