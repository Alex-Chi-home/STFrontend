This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

````bash

pnpm dev


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.



To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

#### Health Check

```javascript
fetch("http://localhost:5555/api/auth/health")
  .then((res) => res.json())
  .then((data) => console.log(data));
// Response: { "status": "ok", "timestamp": "2025-12-09T12:00:00.000Z" }
````

#### Register

```javascript
fetch("http://localhost:5555/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    username: "john_doe",
    email: "john@example.com",
    password: "password123",
  }),
}).then((res) => res.json());
// Response: { "status": "success", "data": { "user": { "id": 1, "username": "john_doe", "email": "john@example.com" } } }
```

#### Login

```javascript
fetch("http://localhost:5555/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    email: "john@example.com",
    password: "password123",
  }),
}).then((res) => res.json());
// Response: { "status": "success", "data": { "user": { "id": 1, "username": "john_doe", "email": "john@example.com" } } }
```

#### Logout

```javascript
fetch("http://localhost:5555/api/auth/logout", {
  method: "POST",
  credentials: "include",
}).then((res) => res.json());
// Response: { "status": "success", "message": "Logged out" }
```

---

### User Endpoints

#### Get Current User

```javascript
fetch("http://localhost:5555/api/user", {
  credentials: "include",
}).then((res) => res.json());
// Response: { "status": "success", "data": { "id": 1, "username": "john_doe", "email": "john@example.com" } }
```

#### Get All Users

```javascript
fetch("http://localhost:5555/api/users", {
  credentials: "include",
}).then((res) => res.json());
// Response: { "status": "success", "data": [{ "id": 1, "username": "john_doe" }, ...] }
```

---

### Chat Endpoints

#### Get User's Chats

```javascript
fetch("http://localhost:5555/api/chats", {
  credentials: "include",
}).then((res) => res.json());
// Response: { "status": "success", "data": [{ "id": 1, "type": "private", "members": [...] }, ...] }
```

#### Create Private Chat

```javascript
fetch("http://localhost:5555/api/chats/private", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    otherUserId: 2,
  }),
}).then((res) => res.json());
// Response: { "status": "success", "data": { "id": 1, "type": "private", "members": [...] } }
```

#### Create Group Chat

```javascript
fetch("http://localhost:5555/api/chats/group", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    name: "My Group",
    memberIds: [2, 3, 4],
  }),
}).then((res) => res.json());
// Response: { "status": "success", "data": { "id": 2, "type": "group", "name": "My Group", "members": [...] } }
```

#### Delete Chat

```javascript
fetch("http://localhost:5555/api/chats/1", {
  method: "DELETE",
  credentials: "include",
}).then((res) => res.json());
// Response: { "status": "success", "data": { "message": "Chat deleted" } }
```

---

### Message Endpoints

#### Get Chat Messages

```javascript
fetch("http://localhost:5555/api/messages/1", {
  credentials: "include",
}).then((res) => res.json());
// Response: { "status": "success", "data": [{ "id": 1, "content": "Hello!", "senderId": 1, "createdAt": "..." }, ...] }
```

#### Send Message

```javascript
fetch("http://localhost:5555/api/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    chatId: 1,
    content: "Hello, World!",
  }),
}).then((res) => res.json());
// Response: { "status": "success", "data": { "id": 1, "content": "Hello, World!", "senderId": 1, "chatId": 1 } }
```

#### Delete Message

```javascript
fetch("http://localhost:5555/api/messages", {
  method: "DELETE",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    chatId: 1,
    id: 1,
  }),
}).then((res) => res.json());
// Response: { "status": "success", "data": { "message": "Message deleted" } }
```

---

### Relationship Endpoints

#### Get Relationships

```javascript
fetch("http://localhost:5555/api/relationships", {
  credentials: "include",
}).then((res) => res.json());
// Response: { "status": "success", "data": [{ "id": 1, "type": "friend", "relatedUserId": 2 }, ...] }
```

#### Add Relationship

```javascript
fetch("http://localhost:5555/api/relationships", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    relatedUserId: 2,
    type: "friend", // "friend" | "follower" | "blocked"
  }),
}).then((res) => res.json());
// Response: { "status": "success", "data": { "id": 1, "type": "friend", "relatedUserId": 2 } }
```

---

### WebSocket Events

Connect to WebSocket:

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:5555", {
  auth: { token: "your_jwt_token" },
  transports: ["websocket", "polling"],
});

// Connection ready - rejoin chats
socket.on("connection:ready", (data) => {
  console.log("Connected:", data);
  socket.emit("join:chat", chatId);
});

// Join a chat room
socket.emit("join:chat", 1);
socket.on("joined:chat", ({ chatId }) => console.log("Joined chat:", chatId));

// Leave a chat room
socket.emit("leave:chat", 1);

// Receive new messages
socket.on("message:new", (message) => console.log("New message:", message));

// Receive new chats
socket.on("chat:new", (chat) => console.log("New chat:", chat));

// Chat deleted
socket.on("chat:deleted", ({ chatId }) => console.log("Chat deleted:", chatId));

// Typing indicators
socket.emit("typing:start", { chatId: 1 });
socket.emit("typing:stop", { chatId: 1 });
socket.on("user:typing", ({ userId, chatId }) => console.log("User typing..."));
socket.on("user:stopped-typing", ({ userId, chatId }) =>
  console.log("User stopped typing")
);

// Message read status
socket.emit("message:read", { messageId: 1, chatId: 1 });
socket.on("message:read-status", ({ messageId, userId, status }) =>
  console.log("Message read")
);
```
