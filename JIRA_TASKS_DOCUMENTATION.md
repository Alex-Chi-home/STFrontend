# Simple Telegram Frontend - Jira Tasks Documentation

## Project Overview

This is a Progressive Web Application (PWA) built with Next.js 16, React 19, TypeScript, and Tailwind CSS. It's a real-time messaging application similar to Telegram, featuring WebSocket-based communication, authentication, private and group chats, typing indicators, and message management.

**Tech Stack:**

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS 4, Framer Motion
- **State Management:** Zustand
- **Real-time Communication:** Socket.io Client
- **Validation:** Zod
- **Icons:** Radix UI Icons
- **Notifications:** React Toastify

---

## Task Organization

Tasks are organized into logical groups following the natural development flow. Each task is sized appropriately for student developers (2-8 hours of work).

---

## EPIC 1: Project Setup & Configuration

### Task 1.1: Initialize Next.js Project with TypeScript

**Priority:** Highest
**Story Points:** 2
**Dependencies:** None

**Description:**
Set up a new Next.js 16 project with TypeScript, configure the development environment, and establish the basic project structure.

**Technical Requirements:**

- Initialize Next.js 16 project using `create-next-app`
- Configure TypeScript with strict mode enabled
- Set up path aliases (`@/*` pointing to root)
- Configure target as ES2017
- Enable incremental compilation

**Acceptance Criteria:**

- [ ] Project runs successfully with `npm run dev`
- [ ] TypeScript compilation works without errors
- [ ] Path aliases are functional
- [ ] `tsconfig.json` is properly configured with strict mode

**Files to Create:**

- `tsconfig.json`
- `next.config.ts`
- `next-env.d.ts`

---

### Task 1.2: Configure Tailwind CSS and Styling

**Priority:** Highest
**Story Points:** 2
**Dependencies:** Task 1.1

**Description:**
Set up Tailwind CSS 4 with PostCSS configuration and create global styles for the application.

**Technical Requirements:**

- Install and configure Tailwind CSS 4
- Set up PostCSS configuration
- Create global CSS file with Tailwind directives
- Configure custom fonts (Geist Sans and Geist Mono)
- Set up utility function for className merging (cn utility)

**Acceptance Criteria:**

- [ ] Tailwind CSS classes work in components
- [ ] Custom fonts load correctly
- [ ] Global styles are applied
- [ ] `cn()` utility function works for conditional classes

**Files to Create:**

- `postcss.config.mjs`
- `styles/tailwind.css`
- `app/globals.css`
- `lib/utils.ts` (cn utility function)

---

### Task 1.3: Install and Configure Dependencies

**Priority:** Highest
**Story Points:** 1
**Dependencies:** Task 1.1

**Description:**
Install all required npm packages for the project including UI libraries, state management, WebSocket client, and development tools.

**Technical Requirements:**

- Install production dependencies:
  - `@radix-ui/react-icons` - Icon library
  - `socket.io-client` - WebSocket client
  - `zustand` - State management
  - `zod` - Schema validation
  - `framer-motion` - Animations
  - `react-toastify` - Toast notifications
  - `clsx` and `tailwind-merge` - Utility functions
  - `next-pwa` - PWA support
- Install development dependencies:
  - ESLint and Prettier for code quality
  - TypeScript type definitions

**Acceptance Criteria:**

- [ ] All dependencies install without errors
- [ ] `package.json` contains all required packages
- [ ] Lock file is generated (pnpm-lock.yaml)

**Files to Modify:**

- `package.json`

---

### Task 1.4: Configure ESLint and Prettier

**Priority:** High
**Story Points:** 1
**Dependencies:** Task 1.3

**Description:**
Set up code quality tools including ESLint and Prettier with appropriate configurations for Next.js and React.

**Technical Requirements:**

- Configure ESLint with Next.js and Prettier plugins
- Set up Prettier formatting rules
- Add npm scripts for linting and formatting
- Configure format-on-save behavior

**Acceptance Criteria:**

- [ ] `npm run lint` executes successfully
- [ ] `npm run format` formats all files
- [ ] ESLint catches common errors
- [ ] Prettier enforces consistent code style

**Files to Create:**

- `eslint.config.mjs`

---

### Task 1.5: Configure API Proxy and Environment Variables

**Priority:** High
**Story Points:** 2
**Dependencies:** Task 1.1

**Description:**
Set up Next.js rewrites for API proxy to handle CORS and configure environment variables for API endpoints.

**Technical Requirements:**

- Configure Next.js rewrites to proxy `/api/*` requests
- Set up environment variable for `NEXT_PUBLIC_API_URL`
- Handle both development and production environments
- Configure image domains for Next.js Image component

**Acceptance Criteria:**

- [ ] API requests are proxied correctly in development
- [ ] Environment variables are accessible
- [ ] Production build uses relative paths for API calls
- [ ] Image optimization works for localhost domain

**Files to Create/Modify:**

- `next.config.ts`
- `.env.local` (not in repo, document in README)

---

## EPIC 2: Type Definitions & Data Models

### Task 2.1: Define Core TypeScript Types and Interfaces

**Priority:** Highest
**Story Points:** 2
**Dependencies:** Task 1.1

**Description:**
Create TypeScript type definitions for all core data models including User, Chat, Message, and related types.

**Technical Requirements:**

- Define `User` interface with id, username, email, avatarUrl
- Define `Chat` interface with chat_type, members, created_by, timestamps
- Define `Message` interface with content, sender, timestamps, edit/delete flags
- Define `ChatType` enum (Private, Group)
- Ensure all fields are properly typed (nullable where appropriate)

**Acceptance Criteria:**

- [ ] All core types are defined in `lib/types.ts`
- [ ] Types are exported and reusable across the app
- [ ] Optional fields are marked with `?`
- [ ] Enums are properly defined

**Files to Create:**

- `lib/types.ts`

---

### Task 2.2: Define WebSocket Event Types

**Priority:** High
**Story Points:** 3
**Dependencies:** Task 2.1

**Description:**
Create comprehensive TypeScript types for WebSocket communication including client/server events, payloads, and connection states.

**Technical Requirements:**

- Define `ConnectionStatus` type (connecting, connected, disconnected, reconnecting)
- Define `ClientEvents` enum (JOIN_CHAT, LEAVE_CHAT, TYPING_START, TYPING_STOP, MESSAGE_READ)
- Define `ServerEvents` enum (MESSAGE_NEW, MESSAGE_DELETED, CHAT_NEW, CHAT_DELETED, USER_TYPING, etc.)
- Define payload interfaces for all events
- Define `ServerToClientEvents` and `ClientToServerEvents` interfaces for Socket.io typing
- Define `TypingState` and `WebSocketState` interfaces

**Acceptance Criteria:**

- [ ] All WebSocket events are typed
- [ ] Payload interfaces match backend expectations
- [ ] Socket.io generic types are properly configured
- [ ] Connection status types are defined

**Files to Create:**

- `lib/websocket/types.ts`

---

### Task 2.3: Create Zod Validation Schemas

**Priority:** Medium
**Story Points:** 1
**Dependencies:** Task 1.3, Task 2.1

**Description:**
Define Zod schemas for form validation, particularly for authentication forms.

**Technical Requirements:**

- Create `loginSchema` with email and password validation
- Create `registerSchema` extending loginSchema with username
- Email must be valid email format
- Password must be minimum 6 characters
- Username must be minimum 3 characters

**Acceptance Criteria:**

- [ ] Login schema validates email and password
- [ ] Register schema validates username, email, and password
- [ ] Validation errors provide helpful messages
- [ ] Schemas are exported for use in components

**Files to Create:**

- `lib/models.ts`

---

## EPIC 3: State Management with Zustand

### Task 3.1: Implement User Store

**Priority:** Highest
**Story Points:** 3
**Dependencies:** Task 2.1

**Description:**
Create Zustand store for managing user authentication state with localStorage persistence.

**Technical Requirements:**

- Create user store with `user`, `setUser`, and `logout` actions
- Implement localStorage helper functions (setUser, getUser, removeUser, updateUser, hasUser)
- Store user data in localStorage with key "telegramCloneUser"
- Handle SSR safely (check for window object)
- Integrate with logout API call

**Acceptance Criteria:**

- [ ] User state persists across page refreshes
- [ ] `setUser` updates both store and localStorage
- [ ] `logout` clears store and localStorage
- [ ] SSR doesn't cause errors
- [ ] Type safety is maintained

**Files to Create:**

- `lib/store/user.ts`
- `lib/utils.ts` (userStorageHelper)

---

### Task 3.2: Implement Chat Store

**Priority:** High
**Story Points:** 2
**Dependencies:** Task 2.1

**Description:**
Create Zustand store for managing active chat state.

**Technical Requirements:**

- Create chat store with `activeChatId` state
- Implement `setActiveChatId` action
- Support null value (no chat selected)
- Provide type-safe access to active chat ID

**Acceptance Criteria:**

- [ ] Active chat ID is tracked in store
- [ ] Setting active chat updates state correctly
- [ ] Null state is handled properly
- [ ] Store is accessible from components

**Files to Create:**

- `lib/store/chats.ts`

---

### Task 3.3: Implement Admin/UI Store

**Priority:** Medium
**Story Points:** 1
**Dependencies:** Task 1.1

**Description:**
Create Zustand store for managing UI state like sidebar visibility (for mobile responsiveness).

**Technical Requirements:**

- Create admin store with `sidebarIsOpen` state
- Implement `setSidebarIsOpen` action
- Default sidebar to closed state

**Acceptance Criteria:**

- [ ] Sidebar state is tracked
- [ ] Toggle functionality works
- [ ] State updates trigger re-renders

**Files to Create:**

- `lib/store/admin.ts`

---

### Task 3.4: Implement WebSocket Store

**Priority:** High
**Story Points:** 2
**Dependencies:** Task 2.2

**Description:**
Create Zustand store for managing WebSocket connection state and typing indicators.

**Technical Requirements:**

- Track connection status (connecting, connected, disconnected, reconnecting)
- Track current chat ID
- Track typing users per chat (TypingState)
- Track joined chats (Set of chat IDs)
- Implement actions: setStatus, setCurrentChatId, addTypingUser, removeTypingUser, clearTypingUsers

**Acceptance Criteria:**

- [ ] Connection status updates correctly
- [ ] Typing users are tracked per chat
- [ ] Joined chats are maintained
- [ ] All actions work as expected

**Files to Create:**

- `lib/websocket/store.ts`

---

## EPIC 4: API Client & HTTP Communication

### Task 4.1: Create Base HTTP Client

**Priority:** Highest
**Story Points:** 4
**Dependencies:** Task 1.5

**Description:**
Build a robust HTTP client with authentication, error handling, and proper headers for API communication.

**Technical Requirements:**

- Create base API client with GET, POST, PUT, PATCH, DELETE methods
- Handle authentication tokens from cookies
- Set proper headers (Content-Type, Authorization, Cookie)
- Support both JSON and FormData requests
- Handle credentials with `include` mode
- Add ngrok-skip-browser-warning header for development
- Return response with ok status and data
- Handle different base URLs for development vs production

**Acceptance Criteria:**

- [ ] All HTTP methods work correctly
- [ ] Authentication headers are included
- [ ] Cookies are sent with requests
- [ ] FormData is handled properly
- [ ] Error responses are returned with status

**Files to Create:**

- `lib/api/client.ts`
- `lib/api/utils.ts` (for token extraction)

---

### Task 4.2: Define API Endpoints

**Priority:** High
**Story Points:** 1
**Dependencies:** Task 4.1

**Description:**
Create a centralized configuration for all API endpoints used in the application.

**Technical Requirements:**

- Define endpoints for authentication (register, login, logout)
- Define endpoints for users (user, users list)
- Define endpoints for chats (get chats, private chats, group chats, delete chat)
- Define endpoints for messages (get messages, send message, delete message)
- Use factory functions for dynamic endpoints (e.g., `/chats/${chatId}`)

**Acceptance Criteria:**

- [ ] All endpoints are defined in one place
- [ ] Dynamic endpoints use functions
- [ ] Endpoints match backend API structure
- [ ] Easy to update and maintain

**Files to Create:**

- `lib/api/api-endpoints.ts`

---

### Task 4.3: Implement Authentication API Functions

**Priority:** Highest
**Story Points:** 3
**Dependencies:** Task 4.1, Task 4.2

**Description:**
Create API functions for user authentication including register, login, and logout.

**Technical Requirements:**

- Implement `registerUserAPI(payload)` - returns User or null
- Implement `loginUserAPI(payload)` - returns User or null
- Implement `logoutUserAPI()` - clears session
- Show toast notifications for success/error
- Handle API errors gracefully
- Type payloads with interfaces

**Acceptance Criteria:**

- [ ] Register creates new user account
- [ ] Login authenticates user and returns user data
- [ ] Logout clears authentication
- [ ] Toast notifications appear on success/error
- [ ] Errors are caught and handled

**Files to Create:**

- `lib/api/auth.ts`

---

### Task 4.4: Implement Chat API Functions

**Priority:** High
**Story Points:** 3
**Dependencies:** Task 4.1, Task 4.2

**Description:**
Create API functions for chat management including fetching chats, creating private/group chats, and deleting chats.

**Technical Requirements:**

- Implement `getChatsAPI()` - returns array of chats
- Implement `createPrivateChatAPI(payload)` - creates private chat with one user
- Implement `createGroupChatAPI(payload)` - creates group chat with name and members
- Implement `deleteGroupChatAPI(chatId)` - deletes a chat
- Show toast notifications for errors
- Type all payloads and responses

**Acceptance Criteria:**

- [ ] Fetching chats returns all user's chats
- [ ] Private chat creation works with otherUserId
- [ ] Group chat creation works with name and memberIds
- [ ] Chat deletion removes chat
- [ ] Error handling with toasts

**Files to Create:**

- `lib/api/chats.ts`

---

### Task 4.5: Implement Message API Functions

**Priority:** High
**Story Points:** 2
**Dependencies:** Task 4.1, Task 4.2

**Description:**
Create API functions for message operations including sending, fetching, and deleting messages.

**Technical Requirements:**

- Implement `sendMessageAPI(payload)` - sends message to chat
- Implement `getMessagesAPI(chatId)` - fetches messages for a chat
- Implement `deleteMessageAPI(payload)` - deletes a message
- Type payloads: SendMessageData (chatId, content), DeleteMessageData (chatId, id)
- Show toast notifications for errors

**Acceptance Criteria:**

- [ ] Sending messages works and returns message object
- [ ] Fetching messages returns array of messages for chat
- [ ] Deleting messages removes message
- [ ] All functions handle errors with toasts

**Files to Create:**

- `lib/api/messages.ts`

---

### Task 4.6: Implement Users API Functions

**Priority:** Medium
**Story Points:** 1
**Dependencies:** Task 4.1, Task 4.2

**Description:**
Create API function to fetch list of all users (for creating new chats).

**Technical Requirements:**

- Implement `getUsersAPI()` - returns array of all users
- Handle errors with toast notifications
- Return null on error

**Acceptance Criteria:**

- [ ] Function fetches all users from backend
- [ ] Returns typed User array
- [ ] Errors show toast notifications

**Files to Create:**

- `lib/api/users.ts`

---

## EPIC 5: WebSocket Service & Real-time Communication

### Task 5.1: Implement WebSocket Service Core

**Priority:** Highest
**Story Points:** 5
**Dependencies:** Task 2.2, Task 3.4

**Description:**
Create a singleton WebSocket service using Socket.io client for real-time communication with proper connection management.

**Technical Requirements:**

- Implement singleton pattern for WebSocketService
- Connect to WebSocket server with authentication token
- Configure Socket.io options (transports, reconnection, timeout)
- Implement connection lifecycle methods (connect, disconnect)
- Set up connection event handlers (connect, disconnect, reconnect_attempt, reconnect)
- Implement status change notifications
- Handle connection errors and logging
- Support WebSocket URL from environment variable

**Acceptance Criteria:**

- [ ] Service connects to WebSocket server with token
- [ ] Singleton pattern ensures one instance
- [ ] Connection status updates correctly
- [ ] Reconnection works automatically
- [ ] Status listeners are notified of changes
- [ ] Logging helps with debugging

**Files to Create:**

- `lib/websocket/service.ts`

---

### Task 5.2: Implement WebSocket Event Handling

**Priority:** Highest
**Story Points:** 4
**Dependencies:** Task 5.1

**Description:**
Add event listener system and server event handlers to the WebSocket service.

**Technical Requirements:**

- Implement event listener registration system (on/off methods)
- Set up handlers for all server events:
  - CONNECTION_READY, MESSAGE_NEW, MESSAGE_DELETED
  - CHAT_NEW, CHAT_DELETED
  - USER_TYPING, USER_STOPPED_TYPING
  - JOINED_CHAT, LEFT_CHAT
- Implement internal emit system to notify listeners
- Handle errors in event callbacks
- Log all received events for debugging

**Acceptance Criteria:**

- [ ] Components can subscribe to events
- [ ] All server events are handled
- [ ] Multiple listeners can subscribe to same event
- [ ] Unsubscribe functionality works
- [ ] Errors in callbacks don't crash service

**Files to Modify:**

- `lib/websocket/service.ts`

---

### Task 5.3: Implement Chat Room Management

**Priority:** High
**Story Points:** 3
**Dependencies:** Task 5.2

**Description:**
Add functionality to join and leave chat rooms via WebSocket.

**Technical Requirements:**

- Implement `joinChat(chatId)` method
- Implement `leaveChat(chatId)` method
- Track joined chats in a Set
- Prevent duplicate join attempts
- Handle join/leave when socket is disconnected
- Re-join chats on reconnection
- Emit JOIN_CHAT and LEAVE_CHAT events to server

**Acceptance Criteria:**

- [ ] Joining chat sends event to server
- [ ] Leaving chat sends event to server
- [ ] Duplicate joins are prevented
- [ ] Joined chats are tracked
- [ ] Chats are rejoined after reconnection

**Files to Modify:**

- `lib/websocket/service.ts`

---

### Task 5.4: Implement Typing Indicators via WebSocket

**Priority:** Medium
**Story Points:** 2
**Dependencies:** Task 5.3

**Description:**
Add typing indicator functionality with automatic timeout management.

**Technical Requirements:**

- Implement `startTyping(chatId)` method
- Implement `stopTyping(chatId)` method
- Track typing timeouts per chat
- Clear existing timeout when starting typing again
- Emit TYPING_START and TYPING_STOP events to server

**Acceptance Criteria:**

- [ ] Starting typing sends event to server
- [ ] Stopping typing sends event to server
- [ ] Timeouts are managed correctly
- [ ] Multiple rapid typing events are handled

**Files to Modify:**

- `lib/websocket/service.ts`

---

### Task 5.5: Create WebSocket React Hooks

**Priority:** Highest
**Story Points:** 4
**Dependencies:** Task 5.4

**Description:**
Create custom React hooks for easy WebSocket integration in components.

**Technical Requirements:**

- Create `useWebSocketConnection(token)` hook - manages connection lifecycle
- Create `useChatRoom(chatId)` hook - joins/leaves chat rooms automatically
- Create `useTypingIndicator(chatId)` hook - manages typing state
- Create `useMessageEvents(onNewMessage, onMessageDeleted)` hook
- Create `useChatEvents(onNewChat, onChatDeleted)` hook
- Create `useMessageReadStatus()` hook
- Handle cleanup on unmount for all hooks
- Ensure type safety

**Acceptance Criteria:**

- [ ] All hooks properly manage subscriptions
- [ ] Cleanup happens on unmount
- [ ] Hooks are type-safe
- [ ] Dependencies are handled correctly
- [ ] Hooks are reusable across components

**Files to Create:**

- `lib/websocket/hooks.ts`

---

### Task 5.6: Create WebSocket Provider Component

**Priority:** High
**Story Points:** 2
**Dependencies:** Task 5.5

**Description:**
Create React context provider for WebSocket connection with authentication token management.

**Technical Requirements:**

- Create WebSocketProvider component
- Create useWebSocket context hook
- Implement useAuthToken hook to fetch token from server
- Provide connection status and methods via context
- Handle token fetching and errors
- Prevent memory leaks with cleanup

**Acceptance Criteria:**

- [ ] Provider wraps chat components
- [ ] Token is fetched automatically
- [ ] Connection status is accessible via context
- [ ] Disconnect/reconnect methods work
- [ ] Errors are logged

**Files to Create:**

- `providers/WebSocketProvider.tsx`

---

## EPIC 6: Authentication & Route Protection

### Task 6.1: Create Login/Register Page

**Priority:** Highest
**Story Points:** 5
**Dependencies:** Task 2.3, Task 3.1, Task 4.3

**Description:**
Build authentication page with login and register forms, validation, and animations.

**Technical Requirements:**

- Create form with email, password, and username (for register) fields
- Toggle between login and register modes
- Implement Zod validation with error display
- Add loading states during API calls
- Show success message and redirect on successful auth
- Use Framer Motion for smooth transitions
- Style with Tailwind CSS (gradient background, rounded card)
- Integrate with user store to set authenticated user

**Acceptance Criteria:**

- [ ] Form validates input with Zod schemas
- [ ] Login and register modes work correctly
- [ ] Validation errors display under fields
- [ ] Loading state shows during API call
- [ ] Success redirects to home page
- [ ] Animations are smooth
- [ ] User is stored in Zustand and localStorage

**Files to Create:**

- `app/login/page.tsx`
- `app/login/layout.tsx`

---

### Task 6.2: Create AuthGuard Provider

**Priority:** Highest
**Story Points:** 3
**Dependencies:** Task 3.1

**Description:**
Implement route protection to redirect unauthenticated users to login and authenticated users away from login.

**Technical Requirements:**

- Create AuthGuard component that wraps app
- Check user authentication status from user store
- Redirect to /login if user is not authenticated
- Redirect to / if authenticated user visits /login
- Use Next.js useRouter and usePathname hooks
- Handle redirects in useEffect

**Acceptance Criteria:**

- [ ] Unauthenticated users are redirected to /login
- [ ] Authenticated users can't access /login
- [ ] Redirects happen automatically
- [ ] No flash of wrong content
- [ ] Works on page refresh

**Files to Create:**

- `providers/AuthGuard.tsx`

---

### Task 6.3: Create UserProvider

**Priority:** Medium
**Story Points:** 2
**Dependencies:** Task 3.1, Task 4.3

**Description:**
Create provider component to fetch and set current user data on app initialization.

**Technical Requirements:**

- Fetch current user from API on mount
- Set user in Zustand store
- Handle loading state
- Handle errors gracefully
- Wrap children components

**Acceptance Criteria:**

- [ ] User data is fetched on app load
- [ ] User is set in store
- [ ] Loading state is handled
- [ ] Errors don't crash app

**Files to Create:**

- `providers/UserProvider.tsx`

---

## EPIC 7: Layout Components

### Task 7.1: Create Root Layout

**Priority:** Highest
**Story Points:** 3
**Dependencies:** Task 6.2, Task 6.3

**Description:**
Build the root layout component with sidebar, header, and main content area, integrating all providers.

**Technical Requirements:**

- Set up HTML structure with custom fonts (Geist Sans, Geist Mono)
- Wrap app with AuthGuard and UserProvider
- Create flex layout: Sidebar on left, Header and main content on right
- Configure ToastContainer for notifications
- Import global CSS
- Set up proper height handling (100dvh for mobile)
- Make layout responsive

**Acceptance Criteria:**

- [ ] Layout renders correctly on all screen sizes
- [ ] Sidebar is visible on desktop
- [ ] Header is at top
- [ ] Main content area scrolls independently
- [ ] Toast notifications appear
- [ ] Fonts load correctly

**Files to Create:**

- `app/layout.tsx`

---

### Task 7.2: Create Sidebar Component

**Priority:** High
**Story Points:** 4
**Dependencies:** Task 3.1, Task 3.3

**Description:**
Build sidebar navigation with user info, navigation items, and logout functionality.

**Technical Requirements:**

- Display user information (username, email)
- Show navigation items with icons (Chats, etc.)
- Highlight active route
- Implement logout button with confirmation
- Make responsive (collapsible on mobile)
- Integrate with admin store for mobile toggle
- Use Radix UI icons
- Style with Tailwind CSS

**Acceptance Criteria:**

- [ ] Sidebar shows user info
- [ ] Navigation items are clickable
- [ ] Active route is highlighted
- [ ] Logout button works and clears session
- [ ] Sidebar collapses on mobile
- [ ] Close button works on mobile

**Files to Create:**

- `components/layout/Sidebar.tsx`

---

### Task 7.3: Create Header Component

**Priority:** Medium
**Story Points:** 2
**Dependencies:** Task 3.2, Task 3.3

**Description:**
Build header component with app title, connection status indicator, and mobile menu toggle.

**Technical Requirements:**

- Display app title "Simple PWA"
- Show hamburger menu icon on mobile (to open sidebar)
- Show back arrow on mobile when chat is active (to return to chat list)
- Integrate ConnectionStatus component
- Use admin store for sidebar toggle
- Use chat store for active chat detection
- Responsive design

**Acceptance Criteria:**

- [ ] Header displays app title
- [ ] Connection status is visible
- [ ] Hamburger menu opens sidebar on mobile
- [ ] Back arrow returns to chat list on mobile
- [ ] Proper spacing and styling

**Files to Create:**

- `components/layout/Header.tsx`

---

## EPIC 8: UI Components - Chat List

### Task 8.1: Create ChatAvatar Component

**Priority:** Medium
**Story Points:** 2
**Dependencies:** Task 2.1

**Description:**
Build reusable avatar component that displays user/chat images or initials with color-coded backgrounds.

**Technical Requirements:**

- Accept props: name, photoUrl, chatId, size (sm/md/lg)
- Display image if photoUrl is provided
- Display first letter of name with colored background if no image
- Use consistent color palette (12 colors)
- Determine color based on chatId (modulo operation)
- Support three sizes: sm (32px), md (48px), lg (64px)
- Use Next.js Image component for optimization
- Round avatar shape

**Acceptance Criteria:**

- [ ] Avatar displays image when URL provided
- [ ] Avatar shows initial with color when no image
- [ ] Colors are consistent for same chatId
- [ ] All three sizes work correctly
- [ ] Images are optimized

**Files to Create:**

- `components/ui/ChatAvatar.tsx`

---

### Task 8.2: Create ChatContextMenu Component

**Priority:** Low
**Story Points:** 2
**Dependencies:** None

**Description:**
Build context menu for chat items with delete action.

**Technical Requirements:**

- Position menu at cursor location
- Show delete option
- Handle click outside to close
- Accept position prop {x, y}
- Accept handleDelete callback
- Use ref for menu element
- Style with Tailwind CSS

**Acceptance Criteria:**

- [ ] Menu appears at cursor position
- [ ] Delete option triggers callback
- [ ] Menu closes when clicking outside
- [ ] Proper styling and hover effects

**Files to Create:**

- `components/ui/ChatContextMenue.tsx`

---

### Task 8.3: Create ChatList Component

**Priority:** Highest
**Story Points:** 5
**Dependencies:** Task 8.1, Task 8.2, Task 4.4

**Description:**
Build chat list component displaying all user's chats with context menu support and mobile responsiveness.

**Technical Requirements:**

- Display list of chats with avatar, name, and timestamp
- Show group icon for group chats
- Highlight active chat
- Implement right-click context menu (desktop)
- Implement long-press context menu (mobile with haptic feedback)
- Handle chat selection
- Show "Add new chat" floating button
- Make responsive (hide on mobile when chat is active)
- Format timestamps with helper function
- Determine chat name based on chat type and current user
- Integrate with deleteGroupChatAPI

**Acceptance Criteria:**

- [ ] All chats are displayed
- [ ] Active chat is highlighted
- [ ] Right-click shows context menu on desktop
- [ ] Long-press shows context menu on mobile
- [ ] Haptic feedback works on mobile
- [ ] Add button opens new chat modal
- [ ] Chat names display correctly
- [ ] Timestamps are formatted
- [ ] Responsive behavior works

**Files to Create:**

- `components/ui/ChatList.tsx`
- `helpers/formatDate.ts`

---

## EPIC 9: UI Components - Chat Window

### Task 9.1: Create MessageBubble Component

**Priority:** High
**Story Points:** 3
**Dependencies:** Task 2.1

**Description:**
Build message bubble component with context menu for edit/delete actions.

**Technical Requirements:**

- Display message content, sender name (if not current user), and timestamp
- Style differently for current user vs others (blue vs gray)
- Align to right for current user, left for others
- Show "edited" indicator if message was edited
- Implement right-click context menu
- Show edit and delete options in menu
- Handle click outside to close menu
- Format timestamp with helper function

**Acceptance Criteria:**

- [ ] Messages display correctly
- [ ] Current user's messages are blue and right-aligned
- [ ] Other users' messages are gray and left-aligned
- [ ] Sender name shows for other users
- [ ] Edited indicator appears when applicable
- [ ] Context menu works
- [ ] Edit and delete callbacks trigger

**Files to Create:**

- `components/ui/MessageBubble/MessageBubble.tsx`
- `components/ui/MessageBubble/MessageBubbleMenue.tsx`

---

### Task 9.2: Create MessageInput Component

**Priority:** High
**Story Points:** 2
**Dependencies:** None

**Description:**
Build message input component with send button and typing indicator integration.

**Technical Requirements:**

- Text input field with placeholder
- Send button
- Handle Enter key to send
- Call onTyping callback on input change
- Clear input after sending
- Accept message state and setMessage callback
- Accept setNewMessage callback for sending
- Use ref for input focus control
- Disable autocomplete, autocorrect, spellcheck

**Acceptance Criteria:**

- [ ] Input accepts text
- [ ] Send button sends message
- [ ] Enter key sends message
- [ ] Input clears after sending
- [ ] Typing callback is triggered
- [ ] Focus can be controlled via ref

**Files to Create:**

- `components/ui/MessageInput.tsx`

---

### Task 9.3: Create TypingIndicator Component

**Priority:** Medium
**Story Points:** 2
**Dependencies:** Task 1.3

**Description:**
Build animated typing indicator component using Framer Motion.

**Technical Requirements:**

- Show three animated dots
- Display text based on user count
- Accept isTyping boolean and userCount number
- Animate dots with staggered bounce effect
- Use Framer Motion for enter/exit animations
- Show only when isTyping is true

**Acceptance Criteria:**

- [ ] Indicator appears when isTyping is true
- [ ] Dots animate smoothly
- [ ] Text changes based on user count
- [ ] Enter/exit animations work
- [ ] Indicator disappears when isTyping is false

**Files to Create:**

- `components/ui/TypingIndicator.tsx`

---

### Task 9.4: Create ChatWindow Component

**Priority:** Highest
**Story Points:** 4
**Dependencies:** Task 9.1, Task 9.2, Task 9.3, Task 5.5

**Description:**
Build main chat window component integrating messages, input, typing indicators, and WebSocket hooks.

**Technical Requirements:**

- Display list of messages using MessageBubble
- Show MessageInput at bottom
- Show TypingIndicator above input
- Auto-scroll to bottom when new messages arrive
- Handle message editing (populate input with message content)
- Handle message deletion
- Integrate useChatRoom hook to join/leave chat
- Integrate useTypingIndicator hook
- Show "Select a chat" message when no chat is active
- Make responsive (hide on mobile when no chat is active)
- Sticky input at bottom

**Acceptance Criteria:**

- [ ] Messages display in scrollable area
- [ ] Auto-scroll works on new messages
- [ ] Input is sticky at bottom
- [ ] Typing indicator shows when users are typing
- [ ] Edit functionality populates input
- [ ] Delete functionality works
- [ ] WebSocket integration works
- [ ] Responsive behavior correct

**Files to Create:**

- `components/ui/ChatWindow.tsx`

---

## EPIC 10: UI Components - Modals & Misc

### Task 10.1: Create NewChatModal Component

**Priority:** High
**Story Points:** 4
**Dependencies:** Task 4.6, Task 2.1

**Description:**
Build modal for creating new private or group chats with user selection.

**Technical Requirements:**

- Modal overlay with backdrop blur
- Toggle between Private and Group chat types
- Search input to filter users
- Display list of available users (excluding already selected)
- Show selected users as chips with remove button
- Group name input (only for group chats)
- Create button (disabled until valid selection)
- Close button
- Fetch users from getUsersAPI on mount
- Call onCreateChat callback with selected users, chat type, and group name
- Reset form on close/create

**Acceptance Criteria:**

- [ ] Modal opens and closes correctly
- [ ] Chat type toggle works
- [ ] User search filters list
- [ ] Users can be selected/deselected
- [ ] Selected users show as chips
- [ ] Group name input appears for group chats
- [ ] Create button validation works
- [ ] Form resets after creation
- [ ] Proper styling and responsiveness

**Files to Create:**

- `components/ui/NewChatModal.tsx`

---

### Task 10.2: Create ConnectionStatus Component

**Priority:** Medium
**Story Points:** 2
**Dependencies:** Task 3.4, Task 1.3

**Description:**
Build connection status indicator showing WebSocket connection state with animations.

**Technical Requirements:**

- Display colored dot based on connection status (green/yellow/red/orange)
- Show pulsing animation for connecting/reconnecting states
- Optional label showing status text
- Create ConnectionBanner component for offline notification
- Use Framer Motion for animations
- Integrate with WebSocket store

**Acceptance Criteria:**

- [ ] Dot color changes based on status
- [ ] Pulse animation works for connecting states
- [ ] Label displays correct text
- [ ] Banner appears when disconnected/reconnecting
- [ ] Banner has loading spinner for reconnecting
- [ ] Animations are smooth

**Files to Create:**

- `components/ui/ConnectionStatus.tsx`

---

## EPIC 11: Main Page Integration

### Task 11.1: Create Main Chat Page

**Priority:** Highest
**Story Points:** 5
**Dependencies:** Task 8.3, Task 9.4, Task 10.1, Task 5.5, Task 5.6

**Description:**
Build the main page integrating ChatList, ChatWindow, NewChatModal, and WebSocket functionality.

**Technical Requirements:**

- Fetch chats on mount using getChatsAPI
- Fetch messages when active chat changes using getMessagesAPI
- Manage active chat state
- Manage messages state
- Implement handleCreateChat for private and group chats
- Implement setNewMessage for sending messages
- Implement handleDeleteMessage for deleting messages
- Integrate WebSocket hooks (useMessageEvents, useChatEvents)
- Handle optimistic updates for messages
- Wrap with WebSocketProvider
- Use useAuthToken hook for WebSocket authentication
- Handle chat switching
- Update chat list when new chats are created
- Update messages when new messages arrive or are deleted

**Acceptance Criteria:**

- [ ] Chats load on page mount
- [ ] Messages load when chat is selected
- [ ] New chat modal opens and creates chats
- [ ] Messages can be sent and appear in real-time
- [ ] Messages can be deleted
- [ ] WebSocket updates work for all users
- [ ] Optimistic updates provide instant feedback
- [ ] Chat switching works smoothly
- [ ] All CRUD operations work

**Files to Create:**

- `app/page.tsx`

---

## EPIC 12: PWA & Utilities

### Task 12.1: Configure PWA Manifest

**Priority:** Low
**Story Points:** 1
**Dependencies:** Task 1.1

**Description:**
Set up Progressive Web App manifest for installability.

**Technical Requirements:**

- Create manifest.ts with app metadata
- Set name: "ST-v0.1", short_name: "SimpleT"
- Configure display mode as "standalone"
- Set start_url to "/"
- Define background and theme colors
- Add app icons (192x192 and 512x512)

**Acceptance Criteria:**

- [ ] Manifest is generated correctly
- [ ] App is installable on mobile devices
- [ ] Icons display correctly
- [ ] Standalone mode works

**Files to Create:**

- `app/manifest.ts`

---

### Task 12.2: Create Utility Functions

**Priority:** Medium
**Story Points:** 2
**Dependencies:** Task 1.3

**Description:**
Create utility functions for date formatting and other helpers.

**Technical Requirements:**

- Create formatDate function to display relative or absolute dates
- Handle edge cases (invalid dates, null values)
- Return human-readable format (e.g., "2 hours ago", "Yesterday", "12/10/2024")

**Acceptance Criteria:**

- [ ] formatDate returns human-readable dates
- [ ] Utilities are reusable
- [ ] Edge cases are handled

**Files to Create:**

- `helpers/formatDate.ts`

---

### Task 12.3: Create Next.js Middleware

**Priority:** Low
**Story Points:** 1
**Dependencies:** Task 1.1

**Description:**
Set up Next.js middleware for request/response header manipulation.

**Technical Requirements:**

- Create middleware function
- Add custom headers to requests/responses
- Configure matcher to exclude static files
- Handle all routes except \_next, images, and public files

**Acceptance Criteria:**

- [ ] Middleware runs on appropriate routes
- [ ] Headers are added correctly
- [ ] Static files are excluded

**Files to Create:**

- `middleware.ts`

---

## EPIC 13: Testing & Documentation

### Task 13.1: Manual Testing - Authentication Flow

**Priority:** High
**Story Points:** 2
**Dependencies:** Task 6.1, Task 6.2

**Description:**
Thoroughly test the authentication flow including registration, login, logout, and route protection.

**Test Cases:**

- Register new user with valid data
- Register with invalid data (validation errors)
- Login with correct credentials
- Login with incorrect credentials
- Logout and verify session cleared
- Access protected routes without authentication
- Access login page when authenticated
- Refresh page and verify session persistence

**Acceptance Criteria:**

- [ ] All test cases pass
- [ ] No console errors
- [ ] Proper error messages display
- [ ] Redirects work correctly

---

### Task 13.2: Manual Testing - Chat Functionality

**Priority:** High
**Story Points:** 3
**Dependencies:** Task 11.1

**Description:**
Test all chat-related functionality including creating chats, sending messages, and real-time updates.

**Test Cases:**

- Create private chat
- Create group chat
- Send message in chat
- Receive message in real-time (test with multiple browser windows)
- Delete message
- Delete chat
- Switch between chats
- Typing indicators work
- Message timestamps display correctly
- Chat list updates in real-time

**Acceptance Criteria:**

- [ ] All test cases pass
- [ ] Real-time updates work across multiple clients
- [ ] No race conditions or duplicate messages
- [ ] UI updates smoothly

---

### Task 13.3: Manual Testing - WebSocket Connection

**Priority:** High
**Story Points:** 2
**Dependencies:** Task 5.6

**Description:**
Test WebSocket connection stability, reconnection, and error handling.

**Test Cases:**

- Initial connection establishes successfully
- Connection status indicator updates correctly
- Disconnect network and verify reconnection
- Send messages during disconnection
- Reconnect and verify messages sync
- Test with slow network
- Test with intermittent connection

**Acceptance Criteria:**

- [ ] Connection is stable
- [ ] Reconnection works automatically
- [ ] Status indicator is accurate
- [ ] No data loss during reconnection
- [ ] Errors are handled gracefully

---

### Task 13.4: Manual Testing - Responsive Design

**Priority:** Medium
**Story Points:** 2
**Dependencies:** Task 7.1, Task 8.3, Task 9.4

**Description:**
Test responsive behavior across different screen sizes and devices.

**Test Cases:**

- Test on mobile viewport (320px, 375px, 414px)
- Test on tablet viewport (768px, 1024px)
- Test on desktop viewport (1280px, 1920px)
- Verify sidebar collapses on mobile
- Verify chat list/window toggle on mobile
- Test touch interactions (long-press, swipe)
- Test landscape and portrait orientations

**Acceptance Criteria:**

- [ ] Layout adapts to all screen sizes
- [ ] Mobile navigation works correctly
- [ ] Touch interactions work
- [ ] No horizontal scroll
- [ ] Text is readable on all devices

---

### Task 13.5: Code Review and Cleanup

**Priority:** Medium
**Story Points:** 2
**Dependencies:** All development tasks

**Description:**
Review all code for quality, remove commented code, fix linting errors, and ensure consistency.

**Tasks:**

- Run ESLint and fix all errors
- Run Prettier and format all files
- Remove commented-out code
- Remove console.logs (except intentional logging)
- Check for unused imports
- Verify all TypeScript types are correct
- Ensure consistent naming conventions
- Add comments where necessary

**Acceptance Criteria:**

- [ ] No ESLint errors
- [ ] All files are formatted
- [ ] No commented code remains
- [ ] TypeScript compiles without errors
- [ ] Code is clean and readable

---

### Task 13.6: Create README Documentation

**Priority:** Medium
**Story Points:** 2
**Dependencies:** All tasks

**Description:**
Create comprehensive README with setup instructions, features, and architecture overview.

**Content to Include:**

- Project description
- Features list
- Tech stack
- Prerequisites
- Installation instructions
- Environment variables setup
- Running the development server
- Building for production
- Project structure overview
- API integration notes
- WebSocket configuration

**Acceptance Criteria:**

- [ ] README is complete and accurate
- [ ] Setup instructions work for new developers
- [ ] All features are documented
- [ ] Environment variables are explained

**Files to Create/Modify:**

- `README.md`

---

## Summary

**Total Epics:** 13
**Total Tasks:** 55+
**Estimated Total Story Points:** 130-160

### Development Phases

**Phase 1: Foundation (Weeks 1-2)**

- EPIC 1: Project Setup & Configuration
- EPIC 2: Type Definitions & Data Models
- EPIC 3: State Management with Zustand

**Phase 2: Backend Integration (Weeks 3-4)**

- EPIC 4: API Client & HTTP Communication
- EPIC 6: Authentication & Route Protection

**Phase 3: Real-time Features (Weeks 5-6)**

- EPIC 5: WebSocket Service & Real-time Communication

**Phase 4: UI Development (Weeks 7-9)**

- EPIC 7: Layout Components
- EPIC 8: UI Components - Chat List
- EPIC 9: UI Components - Chat Window
- EPIC 10: UI Components - Modals & Misc

**Phase 5: Integration & Polish (Weeks 10-11)**

- EPIC 11: Main Page Integration
- EPIC 12: PWA & Utilities

**Phase 6: Quality Assurance (Week 12)**

- EPIC 13: Testing & Documentation

---

## Notes for Instructors

### Prerequisites

Students will need:

- Node.js 18+
- pnpm (or npm/yarn)
- Code editor (VS Code recommended)
- Git for version control
- Basic understanding of React, TypeScript, and Next.js

### Backend Requirement

This frontend requires a compatible backend API. Ensure backend is available or provide mock API endpoints for:

- Authentication (register, login, logout)
- Users (list users, get current user)
- Chats (CRUD operations)
- Messages (CRUD operations)
- WebSocket server for real-time communication

### Learning Objectives

- Next.js App Router and Server Components
- TypeScript advanced types and interfaces
- WebSocket real-time communication with Socket.io
- State management with Zustand
- Form validation with Zod
- Responsive design with Tailwind CSS
- Animation with Framer Motion
- PWA development

### Common Pitfalls to Watch For

1. **WebSocket connection management** - Ensure proper cleanup in useEffect hooks
2. **Race conditions** - Handle concurrent real-time updates properly
3. **SSR/CSR differences** - Be careful with window/localStorage access
4. **TypeScript strict mode** - Pay attention to null/undefined handling
5. **Mobile touch events** - Test long-press and touch interactions thoroughly
6. **Optimistic updates** - Handle failures and rollbacks correctly

### Extension Ideas for Advanced Students

- Add message editing functionality (currently only delete is implemented)
- Implement file/image sharing in messages
- Add user profiles with avatars
- Implement message search functionality
- Add emoji picker to message input
- Implement voice messages
- Add read receipts for messages
- Implement push notifications
- Add message reactions (like, love, etc.)
- Implement chat archiving
- Add user online/offline status
- Implement message forwarding

---

## Jira Task Template

For each task above, create a Jira ticket with the following structure:

**Summary:** [Task Number] - [Task Title]

**Description:**

```
[Task Description]

Technical Requirements:
[Bullet list of technical requirements]

Acceptance Criteria:
[Checklist of acceptance criteria]

Files to Create/Modify:
[List of files]
```

**Issue Type:** Task
**Priority:** [As specified in task]
**Story Points:** [As specified in task]
**Epic Link:** [Epic name]
**Labels:** frontend, nextjs, typescript, react, websocket, [other relevant labels]
**Assignee:** [Student name]
**Sprint:** [Sprint number based on phase]
**Dependencies:** [List of task numbers this depends on]

### Example Jira Ticket

**Summary:** Task 1.1 - Initialize Next.js Project with TypeScript

**Description:**

```
Set up a new Next.js 16 project with TypeScript, configure the development environment, and establish the basic project structure.

Technical Requirements:
- Initialize Next.js 16 project using `create-next-app`
- Configure TypeScript with strict mode enabled
- Set up path aliases (`@/*` pointing to root)
- Configure target as ES2017
- Enable incremental compilation

Acceptance Criteria:
- [ ] Project runs successfully with `npm run dev`
- [ ] TypeScript compilation works without errors
- [ ] Path aliases are functional
- [ ] `tsconfig.json` is properly configured with strict mode

Files to Create:
- tsconfig.json
- next.config.ts
- next-env.d.ts
```

**Issue Type:** Task
**Priority:** Highest
**Story Points:** 2
**Epic Link:** EPIC 1: Project Setup & Configuration
**Labels:** frontend, nextjs, typescript, setup, configuration
**Assignee:** [Student Name]
**Sprint:** Sprint 1
**Dependencies:** None

---

_End of Documentation_

**Document Version:** 1.0
**Last Updated:** December 2024
**Created For:** Student Learning - Simple Telegram Frontend Project
