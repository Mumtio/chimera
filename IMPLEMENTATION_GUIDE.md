# Quick Implementation Guide

## 🔥 Critical Fixes (Do These First)

### 1. Fix Pin Chat Button (CRITICAL)
**File**: `src/pages/Chat.tsx`
**Problem**: Pin/unpin functions missing conversationId parameter

**Find this code** (around line 80-82):
```typescript
unpinMessage(messageId);
// and
pinMessage(messageId);
```

**Replace with**:
```typescript
unpinMessage(conversation.id, messageId);
// and
pinMessage(conversation.id, messageId);
```

### 2. Add Logout Button (CRITICAL)
**File**: `src/components/layout/TopBar.tsx`

**Add after imports**:
```typescript
import { useAuthStore } from '../../stores/authStore';
import { LogOut } from 'lucide-react';
```

**Add in the component** (in the right section):
```typescript
const { logout } = useAuthStore();

// In JSX, add this button:
<button
  onClick={() => {
    logout();
    navigate('/auth/login');
  }}
  className="flex items-center gap-2 text-gray-400 hover:text-neon-green transition-colors"
  aria-label="Logout"
>
  <LogOut size={20} />
  <span className="text-sm">Logout</span>
</button>
```

### 3. Show Current User in Settings (EASY WIN)
**File**: `src/pages/Settings.tsx`

**Add at top of component**:
```typescript
const { user } = useAuthStore();

// Update form fields to use user data:
const [name, setName] = useState(user?.name || '');
const [email, setEmail] = useState(user?.email || '');
```

### 4. Show Current User in Team (EASY WIN)
**File**: `src/pages/Team.tsx`

**Add at top**:
```typescript
const { user } = useAuthStore();

// In the team members map, add check:
{members.map(member => (
  <div key={member.id}>
    {member.name}
    {member.userId === user?.id && (
      <span className="text-neon-green ml-2">(You)</span>
    )}
  </div>
))}
```

## 🎨 UI Improvements (Do These Next)

### 5. Editable Workspace Name
**File**: `src/pages/WorkspaceDashboard.tsx`

**Add state**:
```typescript
const [isEditingName, setIsEditingName] = useState(false);
const [editedName, setEditedName] = useState(workspace.name);
const { updateWorkspace } = useWorkspaceStore();
```

**Replace the h1**:
```typescript
{isEditingName ? (
  <input
    value={editedName}
    onChange={(e) => setEditedName(e.target.value)}
    onBlur={() => {
      updateWorkspace(workspace.id, { name: editedName });
      setIsEditingName(false);
    }}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        updateWorkspace(workspace.id, { name: editedName });
        setIsEditingName(false);
      }
    }}
    className="text-4xl font-cyber text-neon-green bg-transparent border-b-2 border-neon-green"
    autoFocus
  />
) : (
  <div className="flex items-center gap-3">
    <h1 className="text-4xl font-cyber text-neon-green glow-text">
      {workspace.name}
    </h1>
    <button
      onClick={() => setIsEditingName(true)}
      className="text-gray-400 hover:text-neon-green"
    >
      <Edit2 size={20} />
    </button>
  </div>
)}
```

### 6. Editable Conversation Title
**File**: `src/pages/Chat.tsx`

**Same pattern as workspace name** - add edit icon and inline editing

### 7. Dynamic Integration Panels
**File**: `src/pages/Integrations.tsx`

**Replace the hardcoded panels with**:
```typescript
// Show only integrations that exist
{integrations.length === 0 ? (
  <div className="text-center py-12">
    <h3 className="text-xl text-gray-400 mb-4">No Integrations Yet</h3>
    <p className="text-gray-500 mb-6">Add your first AI provider integration</p>
    <button onClick={() => setShowAddModal(true)}>
      Add Integration
    </button>
  </div>
) : (
  integrations.map(integration => (
    <IntegrationPanel key={integration.id} integration={integration} />
  ))
)}
```

## 🔧 Backend Already Supports

All these features are already supported by the backend API:
- ✅ Update workspace name/description
- ✅ Update conversation title
- ✅ Pin/unpin messages
- ✅ User profile data
- ✅ Team members

You just need to connect the frontend!

## 📝 Testing Checklist

After implementing:
- [ ] Can pin/unpin messages
- [ ] Can logout and login again
- [ ] Settings show my name and email
- [ ] Team page shows me with "(You)" label
- [ ] Can edit workspace name
- [ ] Can edit conversation title
- [ ] Gemini responses show actual AI text (not echo)

## 🚀 Quick Start

1. Start with the **Critical Fixes** (30 minutes)
2. Test each one before moving to next
3. Then do **UI Improvements** (1-2 hours)
4. Test everything together

## Need Help?

Each fix is independent - you can do them one at a time and test immediately!
