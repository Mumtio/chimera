# Quick Start - API Integration

## 🚀 Get Started in 3 Steps

### Step 1: Start the Backend

```bash
cd Chimera_Protocol_Mad_Scientist
python manage.py runserver
```

Backend will run at: `http://127.0.0.1:8000`

### Step 2: Start the Frontend

```bash
cd chimera
npm run dev
```

Frontend will run at: `http://localhost:5173`

### Step 3: Test the Integration

1. Open `http://localhost:5173`
2. Click "Create ID" to register
3. Fill in your details and sign up
4. You'll be logged in automatically

## ✅ What Works Now

### Authentication
- ✅ User registration with JWT tokens
- ✅ Login with email/password
- ✅ Logout with token cleanup
- ✅ Tokens stored in localStorage

### Workspaces
- ✅ Load all workspaces from database
- ✅ Create new workspaces
- ✅ Update workspace details
- ✅ Delete workspaces
- ✅ Dashboard with stats

### Chat
- ✅ Create conversations with AI models
- ✅ Send messages and get AI responses
- ✅ Pin/unpin messages
- ✅ Delete messages
- ✅ Inject memories into conversations

### Memories
- ✅ Create memories with auto-embedding
- ✅ Update memory content
- ✅ Delete memories
- ✅ Search and filter memories
- ✅ Re-embed memories

### Integrations
- ✅ Add API keys for OpenAI/Anthropic/Google
- ✅ Test connections
- ✅ Get available AI models
- ✅ Disable integrations

## 📝 Test Checklist

- [ ] Register a new account
- [ ] Login with credentials
- [ ] Create a workspace
- [ ] Add API keys in Integrations
- [ ] Create a memory
- [ ] Start a conversation
- [ ] Send a message
- [ ] Inject a memory into chat
- [ ] View workspace dashboard

## 🔧 Configuration

The frontend is configured to connect to:
```
http://127.0.0.1:8000/api
```

To change this, edit `chimera/.env`:
```env
VITE_API_BASE_URL=http://your-backend-url/api
```

## 🐛 Troubleshooting

### Backend Not Running
**Error**: Network error or connection refused

**Solution**: Make sure the Django backend is running:
```bash
cd Chimera_Protocol_Mad_Scientist
python manage.py runserver
```

### CORS Errors
**Error**: CORS policy blocked

**Solution**: Check backend `settings.py` has:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

### 401 Unauthorized
**Error**: Unauthorized or token expired

**Solution**: 
1. Logout and login again
2. Check if tokens are in localStorage (F12 → Application → Local Storage)
3. Tokens expire after 24 hours

### No Data Showing
**Error**: Empty lists or no workspaces

**Solution**:
1. Check browser console for errors (F12)
2. Verify backend is running
3. Check network tab for failed requests
4. Try creating new data (workspace, memory, etc.)

## 📚 Documentation

- **API Integration Guide**: `API_INTEGRATION.md`
- **Completion Report**: `BACKEND_INTEGRATION_COMPLETE.md`
- **Integration Summary**: `INTEGRATION_SUMMARY.md`
- **Backend API Docs**: http://127.0.0.1:8000/swagger/

## 🎯 Next Steps

After testing the integration:

1. **Add Toast Notifications**: User-friendly error messages
2. **Fix TypeScript Errors**: Clean up test files
3. **Implement Token Refresh**: Auto-refresh expired tokens
4. **Add Loading States**: Better UX during API calls
5. **WebSocket Integration**: Real-time chat updates

## 💡 Tips

- Use browser DevTools (F12) to monitor API calls
- Check Network tab for request/response details
- Console shows any JavaScript errors
- Backend logs show API request details

## 🎉 Success!

If you can:
- Register and login
- See your workspaces
- Create memories
- Start conversations
- Get AI responses

Then the integration is working perfectly!

---

**Need Help?**
- Check `API_INTEGRATION.md` for detailed docs
- Review backend API at http://127.0.0.1:8000/swagger/
- Check browser console for errors
