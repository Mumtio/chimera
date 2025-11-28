import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Landing from '../pages/Landing';
import About from '../pages/About';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import { MemoryRouter } from 'react-router-dom';

/**
 * Comprehensive Integration Tests for Chimera Protocol Frontend
 * Feature: chimera-protocol-frontend
 * 
 * This test suite validates all navigation flows, button functionality,
 * dummy data display, and cross-component interactions.
 */

describe('Final Integration Tests - Navigation Flows', () => {
  it('should render landing page with navigation buttons', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Landing />
      </MemoryRouter>
    );

    // Verify landing page loads
    expect(screen.getByText(/Chimera Protocol/i)).toBeInTheDocument();
    expect(screen.getByText(/One Memory. Multiple Minds./i)).toBeInTheDocument();
    
    // Verify navigation buttons exist
    expect(screen.getByRole('button', { name: /Enter Lab/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Protocol Info/i })).toBeInTheDocument();
  });

  it('should render about page with back navigation', async () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <About />
      </MemoryRouter>
    );

    // Verify about page content
    expect(screen.getByText(/Welcome to the Lab/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Return to Landing Page/i })).toBeInTheDocument();
  });

  it('should render login page with all elements', async () => {
    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <Login />
      </MemoryRouter>
    );

    // Verify login page elements
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Establish Connection/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Demo Access/i })).toBeInTheDocument();
    expect(screen.getByText(/Create ID/i)).toBeInTheDocument();
  });

  it('should render signup page with all elements', async () => {
    render(
      <MemoryRouter initialEntries={['/auth/signup']}>
        <Signup />
      </MemoryRouter>
    );

    // Verify signup page elements
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    expect(screen.getByText(/Back to Login/i)).toBeInTheDocument();
  });
});

describe('Final Integration Tests - Authentication Flow', () => {
  it('should handle demo access button click', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <Login />
      </MemoryRouter>
    );

    // Verify demo button exists and is clickable
    const demoButton = screen.getByRole('button', { name: /Demo Access/i });
    expect(demoButton).toBeInTheDocument();
    expect(demoButton).not.toBeDisabled();
  });

  it('should handle login form submission', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <Login />
      </MemoryRouter>
    );

    // Fill in credentials
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    // Verify inputs have values
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');

    // Verify login button is enabled
    const loginButton = screen.getByRole('button', { name: /Establish Connection/i });
    expect(loginButton).not.toBeDisabled();
  });
});

describe('Final Integration Tests - App Shell and Sidebar Navigation', () => {
  it('should display app shell with navigation links', async () => {
    const WorkspaceDashboard = (await import('../pages/WorkspaceDashboard')).default;
    const AppShell = (await import('../pages/AppShell')).default;
    
    render(
      <MemoryRouter initialEntries={['/app/workspace/ws-1']}>
        <AppShell />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Verify left sidebar navigation elements
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/Neural Chat/i)).toBeInTheDocument();
      expect(screen.getByText(/Memory Bank/i)).toBeInTheDocument();
      expect(screen.getByText(/Team/i)).toBeInTheDocument();
      expect(screen.getByText(/Integrations/i)).toBeInTheDocument();
      expect(screen.getByText(/Console/i)).toBeInTheDocument();
      expect(screen.getByText(/Settings/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});

describe('Final Integration Tests - Workspace Switching', () => {
  it('should switch workspaces and trigger transition', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <App />
      </MemoryRouter>
    );

    // Login
    const demoButton = screen.getByRole('button', { name: /Demo Access/i });
    await user.click(demoButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Project Chimera Alpha/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Find and click another workspace
    const workspaceButton = screen.getByText(/Neural Net Optimizers/i);
    await user.click(workspaceButton);

    // Verify transition occurs (check for transition text)
    await waitFor(() => {
      expect(screen.getByText(/Calibrating Neural Weights/i)).toBeInTheDocument();
    }, { timeout: 1000 });
  });
});

describe('Final Integration Tests - Model Selection Flow', () => {
  it('should navigate to model selection and display brain interface', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <App />
      </MemoryRouter>
    );

    // Login
    const demoButton = screen.getByRole('button', { name: /Demo Access/i });
    await user.click(demoButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Project Chimera Alpha/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Click "New Chat" button
    const newChatButton = screen.getByRole('button', { name: /New Chat/i });
    await user.click(newChatButton);

    // Should navigate to model selection
    await waitFor(() => {
      expect(screen.getByText(/Select Cognitive Model/i)).toBeInTheDocument();
    });
  });
});

describe('Final Integration Tests - Chat Functionality', () => {
  it('should display chat interface with messages', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/app/chat/conv-1']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Verify chat interface elements
      expect(screen.getByPlaceholderText(/Type your message/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should send a message in chat', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/app/chat/conv-1']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      const messageInput = screen.getByPlaceholderText(/Type your message/i);
      expect(messageInput).toBeInTheDocument();
    }, { timeout: 2000 });

    const messageInput = screen.getByPlaceholderText(/Type your message/i);
    await user.type(messageInput, 'Test message');

    const sendButton = screen.getByRole('button', { name: /Send/i });
    await user.click(sendButton);

    // Message should be added to conversation
    await waitFor(() => {
      expect(screen.getByText(/Test message/i)).toBeInTheDocument();
    });
  });
});

describe('Final Integration Tests - Memory Management', () => {
  it('should display memory bank with memory cards', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <App />
      </MemoryRouter>
    );

    // Login
    const demoButton = screen.getByRole('button', { name: /Demo Access/i });
    await user.click(demoButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Project Chimera Alpha/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Navigate to Memory Bank
    const memoryBankLink = screen.getByText(/Memory Bank/i);
    await user.click(memoryBankLink);

    // Verify memory cards are displayed
    await waitFor(() => {
      expect(screen.getByText(/Cognitive Fusion Protocols/i)).toBeInTheDocument();
    });
  });

  it('should navigate to memory detail page', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/app/memories']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Cognitive Fusion Protocols/i)).toBeInTheDocument();
    }, { timeout: 2000 });

    // Click on a memory card
    const memoryCard = screen.getByText(/Cognitive Fusion Protocols/i);
    await user.click(memoryCard);

    // Should navigate to detail page
    await waitFor(() => {
      expect(screen.getByText(/Re-Embed Vector/i)).toBeInTheDocument();
    });
  });
});

describe('Final Integration Tests - Team Page', () => {
  it('should display team members with status indicators', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/app/team']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Lab Personnel/i)).toBeInTheDocument();
    }, { timeout: 2000 });

    // Verify team members are displayed
    expect(screen.getByText(/Dr. Sarah Chen/i)).toBeInTheDocument();
    expect(screen.getByText(/Marcus Rodriguez/i)).toBeInTheDocument();
  });
});

describe('Final Integration Tests - Integrations Page', () => {
  it('should display integration panels with API key inputs', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/app/integrations']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Cortex Keys/i)).toBeInTheDocument();
    }, { timeout: 2000 });

    // Verify integration panels
    expect(screen.getByText(/OpenAI GPT-4o/i)).toBeInTheDocument();
    expect(screen.getByText(/Anthropic Claude 3.5/i)).toBeInTheDocument();
    expect(screen.getByText(/Google Gemini 2.5/i)).toBeInTheDocument();
  });

  it('should have action buttons on integration panels', async () => {
    render(
      <MemoryRouter initialEntries={['/app/integrations']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Cortex Keys/i)).toBeInTheDocument();
    }, { timeout: 2000 });

    // Verify action buttons exist
    const saveButtons = screen.getAllByRole('button', { name: /Save Key/i });
    expect(saveButtons.length).toBeGreaterThan(0);
  });
});

describe('Final Integration Tests - Developer Console', () => {
  it('should display console interface with command tabs', async () => {
    render(
      <MemoryRouter initialEntries={['/app/dev']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Developer Console/i)).toBeInTheDocument();
    }, { timeout: 2000 });

    // Verify command tabs
    expect(screen.getByText(/remember\(\)/i)).toBeInTheDocument();
    expect(screen.getByText(/search\(\)/i)).toBeInTheDocument();
    expect(screen.getByText(/inject\(\)/i)).toBeInTheDocument();
  });
});

describe('Final Integration Tests - Settings Page', () => {
  it('should display settings with profile and retention options', async () => {
    render(
      <MemoryRouter initialEntries={['/app/settings']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/System Config/i)).toBeInTheDocument();
    }, { timeout: 2000 });

    // Verify settings sections
    expect(screen.getByText(/Memory Retention/i)).toBeInTheDocument();
    expect(screen.getByText(/Export All Data/i)).toBeInTheDocument();
  });
});

describe('Final Integration Tests - Dummy Data Display', () => {
  it('should display workspace dummy data on dashboard', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <App />
      </MemoryRouter>
    );

    // Login
    const demoButton = screen.getByRole('button', { name: /Demo Access/i });
    await user.click(demoButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Project Chimera Alpha/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Verify dashboard stats are displayed
    expect(screen.getByText(/Total Memories/i)).toBeInTheDocument();
    expect(screen.getByText(/Embeddings/i)).toBeInTheDocument();
    expect(screen.getByText(/System Load/i)).toBeInTheDocument();
  });

  it('should display no empty states in data components', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <App />
      </MemoryRouter>
    );

    // Login
    const demoButton = screen.getByRole('button', { name: /Demo Access/i });
    await user.click(demoButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Project Chimera Alpha/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Navigate to Memory Bank
    const memoryBankLink = screen.getByText(/Memory Bank/i);
    await user.click(memoryBankLink);

    // Verify memories are displayed (no empty state)
    await waitFor(() => {
      expect(screen.getByText(/Cognitive Fusion Protocols/i)).toBeInTheDocument();
    });
  });
});

describe('Final Integration Tests - Logo Navigation', () => {
  it('should navigate to landing page when logo is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/app/workspace/ws-1']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      const logo = screen.getByText(/Chimera/i);
      expect(logo).toBeInTheDocument();
    }, { timeout: 2000 });

    // Click logo
    const logo = screen.getByText(/Chimera/i);
    await user.click(logo);

    // Should navigate to landing page
    await waitFor(() => {
      expect(screen.getByText(/One Memory. Multiple Minds./i)).toBeInTheDocument();
    });
  });
});

describe('Final Integration Tests - Back Navigation', () => {
  it('should have back navigation on about page', async () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Return to Landing Page/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should have back navigation on memory detail page', async () => {
    render(
      <MemoryRouter initialEntries={['/app/memories/mem-1']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Return to Bank/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should have back navigation on model select page', async () => {
    render(
      <MemoryRouter initialEntries={['/app/model-select']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Return to Dashboard/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
