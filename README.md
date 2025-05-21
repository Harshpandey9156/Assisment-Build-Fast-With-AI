# 🤖 Gemini-Powered Chatbot with PDF Upload & Supabase Auth

A full-stack chatbot built with **Next.js 14**, **Supabase** for authentication and PostgreSQL, **Gemini API** for intelligent responses, and **pdf-parse** for extracting text from uploaded PDF files. This app enables users to chat with a Gemini-powered assistant based on their uploaded documents.

---

## 🚀 Features

- 🔐 **User Authentication** using Supabase
- 📤 **PDF Upload** and text parsing (server-side with `pdf-parse`)
- 🤖 **Gemini API Integration** for intelligent chatbot responses
- 🗄️ **Chat History Storage** in PostgreSQL
- 💬 **Modern Chat UI** built with React (App Router)
- 🌐 **API Routes** using Next.js server functions
- ✅ Protected routes — only logged-in users can chat

---


---

## 🧑‍💻 Technologies Used

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js Server Functions
- **Auth & DB**: Supabase (PostgreSQL, Auth)
- **AI**: Google Gemini API
- **PDF Parsing**: `pdf-parse` npm library

---

## 🔐 Authentication

Implemented using Supabase:

- 🔑 JWT-based authentication
- 👤 Register / Login / Logout
- ✅ Access to chatbot only if authenticated

---

## 📬 API Routes (App Router)

| Endpoint                   | Method | Description                            |
|---------------------------|--------|----------------------------------------|
| `/api/chat/ask`           | POST   | Sends prompt to Gemini & stores reply |
| `/api/chat/history`       | POST   | Returns authenticated user's chat history |
| `/api/upload`             | POST   | Receives PDF file & extracts text     |

---

## 🛠️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/chatbot-gemini-app.git
cd chatbot-gemini-app
