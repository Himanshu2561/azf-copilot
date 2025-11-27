# Standard Response Formats

This document shows the exact response formats the backend sends for different scenarios.

---

## Response Type 1: Initial Greeting

**Request:**
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
      "text": "Hello! Welcome to Aspirezone. How can I help you today?",
      "attachments": [],
      "suggested_actions": [
        {
          "type": "imBack",
          "title": "Events",
          "value": "What events are happening?",
          "image": null
        },
        {
          "type": "imBack",
          "title": "News",
          "value": "What's the latest news?",
          "image": null
        }
      ]
    }
  ],
  "error": null
}
```

---

## Response Type 2: Simple Text Response

**Request:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me about Aspirezone",
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
      "text": "Aspirezone is a world-class sports complex located in Qatar. It offers various facilities including sports halls, training centers, and event venues.",
      "attachments": [],
      "suggested_actions": []
    }
  ],
  "error": null
}
```

---

## Response Type 3: Events Response

**Request:**
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
      "secondary_output": {
        "events": [
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
      }
    }
  ],
  "error": null
}
```

---

## Response Type 4: News Response

**Request:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the latest news?",
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
      "text": "Here are the latest news updates:",
      "attachments": [],
      "suggested_actions": [],
      "secondary_output": {
        "news": [
          {
            "news_name": "H.E. India's Minister of Labour and Sports Visits Aspire Zone",
            "news_link": "https://www.aspirezone.qa/en/media-centre/news/h-e-indias-minister-of-labour-and-sports-visits-aspire-zone-foundation",
            "news_image_url": "https://www.aspirezone.qa/WebContent/aspirezonecropped/638982834034377079.jpg",
            "news_summary": "India's Minister of Labour and Sports pays a visit to Aspire Zone in Qatar.",
            "news_date": "6 Nov 2025",
            "news_category": "Business"
          },
          {
            "news_name": "Aspire Zone Foundation Welcomes Vice President of the People's Republic of China",
            "news_link": "https://www.aspirezone.qa/en/media-centre/news/aspire-zone-foundation-welcomes-vice-president-of-the-peoples-republic-of-china",
            "news_image_url": "https://www.aspirezone.qa/WebContent/aspirezonecropped/638979381332253578.jpg",
            "news_summary": "Aspire Zone Foundation in Qatar welcomes the Vice President of the People in a recent development.",
            "news_date": "5 Nov 2025",
            "news_category": "Business"
          }
        ]
      }
    }
  ],
  "error": null
}
```

---

## Response Type 5: Contact Information Card

**Request:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How can I contact Aspirezone?",
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
      "text": "Here is our contact information:",
      "attachments": [
        {
          "contentType": "application/vnd.microsoft.card.hero",
          "content": {
            "title": "Aspirezone Contact",
            "subtitle": "Get in touch with us",
            "text": "For inquiries, please contact us:",
            "images": [
              {
                "url": "https://www.aspirezone.qa/images/logo.png",
                "alt": "Aspirezone Logo"
              }
            ],
            "buttons": [
              {
                "type": "openUrl",
                "title": "Visit Website",
                "value": "https://www.aspirezone.qa"
              },
              {
                "type": "call",
                "title": "Call Us",
                "value": "+974-1234-5678"
              },
              {
                "type": "openUrl",
                "title": "Email Us",
                "value": "mailto:info@aspirezone.qa"
              }
            ]
          },
          "contentUrl": null,
          "name": null,
          "thumbnailUrl": null
        }
      ],
      "suggested_actions": []
    }
  ],
  "error": null
}
```

---

## Response Type 6: Adaptive Card

**Request:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Show me facility information",
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
      "text": "",
      "attachments": [
        {
          "contentType": "application/vnd.microsoft.card.adaptive",
          "content": {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.0",
            "body": [
              {
                "type": "TextBlock",
                "text": "Facility Information",
                "weight": "bolder",
                "size": "medium"
              },
              {
                "type": "ColumnSet",
                "columns": [
                  {
                    "type": "Column",
                    "items": [
                      {
                        "type": "Image",
                        "url": "https://www.aspirezone.qa/images/facility.jpg",
                        "size": "medium"
                      }
                    ]
                  },
                  {
                    "type": "Column",
                    "items": [
                      {
                        "type": "TextBlock",
                        "text": "Aspire Dome",
                        "weight": "bolder"
                      },
                      {
                        "type": "TextBlock",
                        "text": "World-class indoor sports facility"
                      }
                    ]
                  }
                ]
              }
            ],
            "actions": [
              {
                "type": "Action.OpenUrl",
                "title": "Learn More",
                "url": "https://www.aspirezone.qa/facilities"
              }
            ]
          },
          "contentUrl": null,
          "name": null,
          "thumbnailUrl": null
        }
      ],
      "suggested_actions": []
    }
  ],
  "error": null
}
```

---

## Response Type 7: Receipt/List Card

**Request:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What facilities are available?",
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
      "text": "Here are the available facilities:",
      "attachments": [
        {
          "contentType": "application/vnd.microsoft.card.receipt",
          "content": {
            "title": "Facilities",
            "items": [
              {
                "title": "Aspire Dome",
                "subtitle": "Indoor Sports Facility",
                "text": "Multi-purpose indoor arena",
                "image": {
                  "url": "https://www.aspirezone.qa/images/dome.jpg",
                  "alt": "Aspire Dome"
                },
                "price": "Available",
                "quantity": "Open"
              },
              {
                "title": "Aspire Park",
                "subtitle": "Outdoor Recreation",
                "text": "Public park with sports facilities",
                "image": {
                  "url": "https://www.aspirezone.qa/images/park.jpg",
                  "alt": "Aspire Park"
                },
                "price": "Available",
                "quantity": "Open"
              }
            ],
            "total": "2 facilities available"
          },
          "contentUrl": null,
          "name": null,
          "thumbnailUrl": null
        }
      ],
      "suggested_actions": []
    }
  ],
  "error": null
}
```

---

## Response Type 8: Response with Suggested Actions

**Request:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What can you help me with?",
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
      "text": "What would you like to know more about?",
      "attachments": [],
      "suggested_actions": [
        {
          "type": "imBack",
          "title": "Events",
          "value": "Show me upcoming events",
          "image": null
        },
        {
          "type": "imBack",
          "title": "News",
          "value": "What's the latest news?",
          "image": null
        },
        {
          "type": "postBack",
          "title": "Contact",
          "value": "contact_info",
          "image": "https://www.aspirezone.qa/icons/contact.png"
        }
      ]
    }
  ],
  "error": null
}
```

---

## Response Type 9: Combined Response (Text + Events + Card)

**Request:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me about events and how to contact you",
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
      "text": "Here are the upcoming events and our contact information:",
      "attachments": [
        {
          "contentType": "application/vnd.microsoft.card.hero",
          "content": {
            "title": "Contact Us",
            "text": "For event inquiries, contact us at info@aspirezone.qa",
            "buttons": [
              {
                "type": "openUrl",
                "title": "Website",
                "value": "https://www.aspirezone.qa"
              }
            ]
          },
          "contentUrl": null,
          "name": null,
          "thumbnailUrl": null
        }
      ],
      "suggested_actions": [],
      "secondary_output": {
        "events": [
          {
            "event_name": "Paralympic Day 2025",
            "event_link": "https://www.aspirezone.qa/en/events/paralympic-day-2025",
            "event_image_url": "https://www.aspirezone.qa/WebContent/aspirezonecropped/638985421537247963.jpg",
            "event_summary": "Celebrate Paralympic Day at Aspire Dome on December 3, 2025.",
            "event_date": "2025-12-03",
            "event_location": "Aspire Dome",
            "is_upcoming": true
          }
        ]
      }
    }
  ],
  "error": null
}
```

---

## Response Type 10: Multiple Response Items

**Request:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me about events and news",
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
      "text": "Here are the events:",
      "attachments": [],
      "suggested_actions": [],
      "secondary_output": {
        "events": [
          {
            "event_name": "Paralympic Day 2025",
            "event_link": "https://www.aspirezone.qa/en/events/paralympic-day-2025",
            "event_image_url": "https://www.aspirezone.qa/WebContent/aspirezonecropped/638985421537247963.jpg",
            "event_summary": "Celebrate Paralympic Day at Aspire Dome on December 3, 2025.",
            "event_date": "2025-12-03",
            "event_location": "Aspire Dome",
            "is_upcoming": true
          }
        ]
      }
    },
    {
      "type": "message",
      "text": "And here is the latest news:",
      "attachments": [],
      "suggested_actions": [],
      "secondary_output": {
        "news": [
          {
            "news_name": "H.E. India's Minister of Labour and Sports Visits Aspire Zone",
            "news_link": "https://www.aspirezone.qa/en/media-centre/news/h-e-indias-minister-of-labour-and-sports-visits-aspire-zone-foundation",
            "news_image_url": "https://www.aspirezone.qa/WebContent/aspirezonecropped/638982834034377079.jpg",
            "news_summary": "India's Minister of Labour and Sports pays a visit to Aspire Zone in Qatar.",
            "news_date": "6 Nov 2025",
            "news_category": "Business"
          }
        ]
      }
    }
  ],
  "error": null
}
```

---

## Response Type 11: Error Response

**Request:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "test",
    "conversation_id": "invalid_id"
  }'
```

**Response:**
```json
{
  "success": false,
  "conversation_id": "invalid_id",
  "responses": [],
  "error": "Failed to get bot response. Please try again."
}
```

---

## Response Type 12: Events and News Together

**Request:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Show me events and news",
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
      "text": "Here are the events and news:",
      "attachments": [],
      "suggested_actions": [],
      "secondary_output": {
        "events": [
          {
            "event_name": "Paralympic Day 2025",
            "event_link": "https://www.aspirezone.qa/en/events/paralympic-day-2025",
            "event_image_url": "https://www.aspirezone.qa/WebContent/aspirezonecropped/638985421537247963.jpg",
            "event_summary": "Celebrate Paralympic Day at Aspire Dome on December 3, 2025.",
            "event_date": "2025-12-03",
            "event_location": "Aspire Dome",
            "is_upcoming": true
          }
        ],
        "news": [
          {
            "news_name": "H.E. India's Minister of Labour and Sports Visits Aspire Zone",
            "news_link": "https://www.aspirezone.qa/en/media-centre/news/h-e-indias-minister-of-labour-and-sports-visits-aspire-zone-foundation",
            "news_image_url": "https://www.aspirezone.qa/WebContent/aspirezonecropped/638982834034377079.jpg",
            "news_summary": "India's Minister of Labour and Sports pays a visit to Aspire Zone in Qatar.",
            "news_date": "6 Nov 2025",
            "news_category": "Business"
          }
        ]
      }
    }
  ],
  "error": null
}
```

---

## Notes

1. **`conversation_id`**: Always save and include in subsequent requests
2. **`secondary_output`**: Only present when events or news are returned. Structure: `{"events": [...], "news": [...]}`
3. **`attachments`**: Array of cards (contact cards, adaptive cards, etc.) from the agent
4. **`suggested_actions`**: Quick action buttons - when clicked, send `value` as a new message
5. **Resource references**: Automatically removed from `text` when `secondary_output` contains events or news
6. **Multiple responses**: `responses` array may contain multiple items - process each one
