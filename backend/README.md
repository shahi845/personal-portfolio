## Portfolio backend (AI chatbot + contact email)

This folder runs an Express API used by the portfolio frontend.

### Features

- **POST `/api/chat`**: Server-side AI chatbot (keeps API key secret)
- **POST `/api/contact`**: Sends contact form messages to your email
- **GET `/api/health`**: Simple health check

### Setup

1) Install dependencies:

```bash
npm install
```

2) Create/update `.env`:

- **`OPENAI_API_KEY`**: your OpenAI API key
- **`EMAIL_USER`**: your Gmail address (or the inbox you want to receive messages on)
- **`EMAIL_PASS`**: a **Gmail App Password** (recommended)  
- **`FRONTEND_ORIGINS`**: comma-separated allowed origins (for CORS)

3) Run the server:

```bash
npm start
```

Server will start on `http://localhost:3000` by default.

### Frontend note

The frontend (`portfolio/frontend/index.html`) calls:

- `http://localhost:3000/api/contact` and `http://localhost:3000/api/chat` when opened on localhost
- `/api/contact` and `/api/chat` when deployed on the same domain as the backend (recommended)

