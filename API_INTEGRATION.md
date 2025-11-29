# API Integration Guide

## Overview

The Chimera Protocol frontend is now fully integrated with the Django backend API running at `http://127.0.0.1:8000/api`.

## Configuration

### Environment Variables

Update `chimera/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_ENABLE_MOCK_DATA=false
```

## Architecture

### API Service Layer (`src/lib/api.ts`)

All API calls are centralized in the API service layer with the following modules:

- **authApi**: Authentication (login, signup, logout, refresh token)
- **workspaceApi**: Workspace management (CRUD operations, dashboard data)
- **conversationApi**: Chat conversations and messages
- **memoryApi**: Memory bank operations (CRUD, search, re-embedding)
- **integrationApi**: AI provider integrations (OpenAI, Anthropic, Google)
- **teamApi**: Team member management
- **settingsApi**: User settings and data export

### Store Updates

All Zustand stores have been updated to use real API calls:

#### 1. **authStore.ts**
- `login()`: Authenticates user and stores JWT tokens
- `signup()`: Registers new user
- `logout()`: Clears tokens and session
- Stores tokens in localStorage: `auth_token` and `refresh_token`

#### 2. **workspaceStore.ts**
- `loadWorkspaces()`: Fetches all workspaces on app init
- `createWorkspace()`: Creates new workspace via API
- `updateWorkspace()`: Updates workspace details
- `deleteWorkspace()`: Removes workspace
- Handles workspace transitions with animation

#### 3. **chatStore.ts**
- `loadConversations()`: Loads conversations for a workspace
- `createConversation()`: Creates new chat with selected model
- `sendMessage()`: Sends message and gets AI response
- `pinMessage()` / `unpinMessage()`: Pin/unpin messages
- `injectMemory()` / `removeInjectedMemory()`: Memory injection
- `loadConversationMessages()`: Lazy loads messages when conversation is opened

#### 4. **memoryStore.ts**
- `loadMemories()`: Fetches memories for workspace
- `addMemory()`: Creates new memory with auto-embedding
- `updateMemory()`: Updates memory content
- `deleteMemory()`: Removes memory
- `reEmbedMemory()`: Triggers re-embedding
- Client-side filtering and sorting

#### 5. **integrationStore.ts**
- `loadIntegrations()`: Fetches configured AI providers
- `saveApiKey()`: Saves/updates API keys (encrypted on backend)
- `testConnection()`: Tests provider connectivity
- `disableIntegration()`: Removes integration
- `getConnectedModels()`: Gets available AI models

## Data Flow

### App Initialization

1. User logs in → JWT tokens stored in localStorage
2. AppShell mounts → Loads workspaces and integrations
3. Active workspace selected → Loads conversations and memories
4. User navigates → Data loaded on-demand

### Authentication Flow

```
Login Page → authApi.login() → Store tokens → Redirect to /app
↓
AppShell → Check auth → Load initial data
↓
Protected routes accessible
```

### Workspace Switching

```
User selects workspace → setActiveWorkspace()
↓
Transition animation starts
↓
Load workspace data (conversations, memories)
↓
Transition completes → New workspace active
```

## API Response Format

All API responses follow this envelope format:

```typescript
{
  ok: boolean;
  data: T | null;
  error: string | null;
}
```

## Error Handling

- API errors are caught and logged to console
- User-facing errors should be displayed in UI (implement toast notifications)
- Authentication errors clear tokens and redirect to login
- Network errors are handled gracefully with fallbacks

## Authentication

### JWT Tokens

- Access token stored in `localStorage.auth_token`
- Refresh token stored in `localStorage.refresh_token`
- Tokens automatically included in API requests via `Authorization: Bearer <token>` header

### Token Refresh

Implement automatic token refresh when access token expires:

```typescript
// TODO: Add token refresh interceptor
if (response.status === 401) {
  const refreshToken = localStorage.getItem('refresh_token');
  const newToken = await authApi.refresh(refreshToken);
  localStorage.setItem('auth_token', newToken.token);
  // Retry original request
}
```

## Testing the Integration

### 1. Start Backend

```bash
cd Chimera_Protocol_Mad_Scientist
python manage.py runserver
```

Backend should be running at `http://127.0.0.1:8000`

### 2. Start Frontend

```bash
cd chimera
npm run dev
```

Frontend should be running at `http://localhost:5173`

### 3. Test Flow

1. **Register**: Create a new account at `/auth/signup`
2. **Login**: Sign in at `/auth/login`
3. **Workspaces**: View and create workspaces
4. **Integrations**: Add API keys for OpenAI/Anthropic/Google at `/app/integrations`
5. **Memories**: Create and manage memories at `/app/memories`
6. **Chat**: Start conversations with AI models at `/app/chat`

## Removed Dummy Data

The following dummy data files are no longer used:
- `src/data/dummyData.ts` - All data now comes from API

Stores no longer import or use dummy data.

## Next Steps

### Recommended Improvements

1. **Error Toast Notifications**: Add a toast/notification system for user-friendly error messages
2. **Loading States**: Add skeleton loaders for better UX during data fetching
3. **Optimistic Updates**: Update UI immediately, then sync with backend
4. **Caching**: Implement request caching to reduce API calls
5. **WebSocket**: Add real-time updates for chat messages
6. **Retry Logic**: Add automatic retry for failed requests
7. **Request Cancellation**: Cancel pending requests when component unmounts
8. **Rate Limiting**: Handle rate limit errors gracefully

### Security Considerations

1. **Token Storage**: Consider using httpOnly cookies instead of localStorage
2. **CORS**: Ensure backend CORS settings are properly configured
3. **API Key Encryption**: API keys are encrypted on backend
4. **Input Validation**: Validate all user inputs before sending to API

## Troubleshooting

### CORS Errors

If you see CORS errors, ensure backend `settings.py` has:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

### 401 Unauthorized

- Check if tokens are stored in localStorage
- Verify backend is running
- Check token expiration

### Network Errors

- Verify backend URL in `.env`
- Check if backend server is running
- Verify network connectivity

## API Documentation

Full API documentation available at:
- Swagger UI: `http://127.0.0.1:8000/swagger/`
- ReDoc: `http://127.0.0.1:8000/redoc/`
- Markdown: `Chimera_Protocol_Mad_Scientist/API_DOCUMENTATION.md`
