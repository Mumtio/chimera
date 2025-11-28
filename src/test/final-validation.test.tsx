import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

/**
 * Final Validation Tests for Chimera Protocol Frontend
 * Feature: chimera-protocol-frontend, Task 24
 * 
 * This test suite validates all major features are working correctly:
 * - Navigation flows
 * - Button and link functionality
 * - Dummy data display
 * - Component rendering
 */

describe('Task 24: Final Testing - Landing and Public Pages', () => {
  it('should render landing page with all required elements', async () => {
    const Landing = (await import('../pages/Landing')).default;
    
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );

    // Verify title and subtitle
    expect(screen.getByText(/Chimera Protocol/i)).toBeInTheDocument();
    expect(screen.getByText(/One Memory. Multiple Minds./i)).toBeInTheDocument();
    
    // Verify buttons
    expect(screen.getByRole('button', { name: /Enter Lab/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Protocol Info/i })).toBeInTheDocument();
    
    // Verify footer links
    expect(screen.getByText(/Docs/i)).toBeInTheDocument();
    expect(screen.getByText(/GitHub/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy/i)).toBeInTheDocument();
  });

  it('should render about page with content and back navigation', async () => {
    const About = (await import('../pages/About')).default;
    
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome to the Lab/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Return to Landing Page/i })).toBeInTheDocument();
  });

  it('should render login page with authentication form', async () => {
    const Login = (await import('../pages/Login')).default;
    
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Verify form inputs
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    
    // Verify buttons
    expect(screen.getByRole('button', { name: /Establish Connection/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Demo Access/i })).toBeInTheDocument();
    
    // Verify links
    expect(screen.getByText(/Create ID/i)).toBeInTheDocument();
  });

  it('should render signup page with registration form', async () => {
    const Signup = (await import('../pages/Signup')).default;
    
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    // Verify form inputs
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    
    // Verify buttons and links
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    expect(screen.getByText(/Back to Login/i)).toBeInTheDocument();
  });
});

describe('Task 24: Final Testing - Workspace Dashboard', () => {
  it('should render dashboard with stats and dummy data', async () => {
    const WorkspaceDashboard = (await import('../pages/WorkspaceDashboard')).default;
    
    render(
      <MemoryRouter>
        <WorkspaceDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Verify stat cards
      expect(screen.getByText(/Total Memories/i)).toBeInTheDocument();
      expect(screen.getByText(/Embeddings/i)).toBeInTheDocument();
      expect(screen.getByText(/System Load/i)).toBeInTheDocument();
      
      // Verify action buttons
      expect(screen.getByRole('button', { name: /New Chat/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Memory Bank/i })).toBeInTheDocument();
    });
  });
});

describe('Task 24: Final Testing - Model Selection', () => {
  it('should render model selection page with brain interface', async () => {
    const ModelSelect = (await import('../pages/ModelSelect')).default;
    
    render(
      <MemoryRouter>
        <ModelSelect />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Select Cognitive Model/i)).toBeInTheDocument();
      expect(screen.getByText(/Memory Injection Protocol: Ready/i)).toBeInTheDocument();
      expect(screen.getByText(/Return to Dashboard/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});

describe('Task 24: Final Testing - Chat Functionality', () => {
  it('should render chat interface with message input', async () => {
    const Chat = (await import('../pages/Chat')).default;
    
    render(
      <MemoryRouter initialEntries={['/app/chat/conv-1']}>
        <Chat />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Verify chat elements
      expect(screen.getByPlaceholderText(/Type your message/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Send/i })).toBeInTheDocument();
      
      // Verify navigation links
      expect(screen.getByText(/Return to Dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/Memory Library/i)).toBeInTheDocument();
    });
  });

  it('should handle message sending', async () => {
    const Chat = (await import('../pages/Chat')).default;
    const user = userEvent.setup();
    
    render(
      <MemoryRouter initialEntries={['/app/chat/conv-1']}>
        <Chat />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Type your message/i)).toBeInTheDocument();
    });

    const messageInput = screen.getByPlaceholderText(/Type your message/i);
    await user.type(messageInput, 'Test message');
    
    expect(messageInput).toHaveValue('Test message');
    
    const sendButton = screen.getByRole('button', { name: /Send/i });
    await user.click(sendButton);
    
    // After sending, input should be cleared
    await waitFor(() => {
      expect(messageInput).toHaveValue('');
    });
  });
});

describe('Task 24: Final Testing - Memory Management', () => {
  it('should render memory bank with memory cards', async () => {
    const MemoryBank = (await import('../pages/MemoryBank')).default;
    
    render(
      <MemoryRouter>
        <MemoryBank />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Verify header and actions
      expect(screen.getByText(/Memory Bank/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Inject Memory/i })).toBeInTheDocument();
      
      // Verify dummy memory data is displayed
      expect(screen.getByText(/Cognitive Fusion Protocols/i)).toBeInTheDocument();
      expect(screen.getByText(/Emergent Synapse Firing/i)).toBeInTheDocument();
    });
  });

  it('should render memory detail page with actions', async () => {
    const MemoryDetail = (await import('../pages/MemoryDetail')).default;
    
    render(
      <MemoryRouter initialEntries={['/app/memories/mem-1']}>
        <MemoryDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Verify action buttons
      expect(screen.getByRole('button', { name: /Edit Memory/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Delete Memory/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Re-Embed Vector/i })).toBeInTheDocument();
      
      // Verify back navigation
      expect(screen.getByText(/Return to Bank/i)).toBeInTheDocument();
    });
  });
});

describe('Task 24: Final Testing - Team Page', () => {
  it('should render team page with team members', async () => {
    const Team = (await import('../pages/Team')).default;
    
    render(
      <MemoryRouter>
        <Team />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Verify header
      expect(screen.getByText(/Lab Personnel/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Invite Researcher/i })).toBeInTheDocument();
      
      // Verify dummy team members
      expect(screen.getByText(/Dr. Sarah Chen/i)).toBeInTheDocument();
      expect(screen.getByText(/Marcus Rodriguez/i)).toBeInTheDocument();
      expect(screen.getByText(/Elena Volkov/i)).toBeInTheDocument();
    });
  });
});

describe('Task 24: Final Testing - Integrations Page', () => {
  it('should render integrations page with API key panels', async () => {
    const Integrations = (await import('../pages/Integrations')).default;
    
    render(
      <MemoryRouter>
        <Integrations />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Verify header
      expect(screen.getByText(/Cortex Keys/i)).toBeInTheDocument();
      
      // Verify integration panels
      expect(screen.getByText(/OpenAI GPT-4o/i)).toBeInTheDocument();
      expect(screen.getByText(/Anthropic Claude 3.5/i)).toBeInTheDocument();
      expect(screen.getByText(/Google Gemini 2.5/i)).toBeInTheDocument();
      
      // Verify action buttons exist
      const saveButtons = screen.getAllByRole('button', { name: /Save Key/i });
      expect(saveButtons.length).toBeGreaterThan(0);
    });
  });
});

describe('Task 24: Final Testing - Developer Console', () => {
  it('should render console with command interface', async () => {
    const Console = (await import('../pages/Console')).default;
    
    render(
      <MemoryRouter>
        <Console />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Verify header
      expect(screen.getByText(/Developer Console/i)).toBeInTheDocument();
      
      // Verify command tabs
      expect(screen.getByText(/remember\(\)/i)).toBeInTheDocument();
      expect(screen.getByText(/search\(\)/i)).toBeInTheDocument();
      expect(screen.getByText(/inject\(\)/i)).toBeInTheDocument();
    });
  });
});

describe('Task 24: Final Testing - Settings Page', () => {
  it('should render settings page with configuration options', async () => {
    const Settings = (await import('../pages/Settings')).default;
    
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Verify header
      expect(screen.getByText(/System Config/i)).toBeInTheDocument();
      
      // Verify settings sections
      expect(screen.getByText(/Memory Retention/i)).toBeInTheDocument();
      expect(screen.getByText(/Export All Data/i)).toBeInTheDocument();
      expect(screen.getByText(/Delete Chimera Account/i)).toBeInTheDocument();
    });
  });
});

describe('Task 24: Final Testing - 404 Error Page', () => {
  it('should render 404 page with error message', async () => {
    const NotFound = (await import('../pages/NotFound')).default;
    
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText(/ERROR 404/i)).toBeInTheDocument();
    expect(screen.getByText(/The Chimera Ate This Page/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Return to Lab Entrance/i })).toBeInTheDocument();
  });
});

describe('Task 24: Final Testing - No Empty States', () => {
  it('should display dummy data in all data-driven components', async () => {
    const MemoryBank = (await import('../pages/MemoryBank')).default;
    const Team = (await import('../pages/Team')).default;
    const WorkspaceDashboard = (await import('../pages/WorkspaceDashboard')).default;
    
    // Test Memory Bank has data
    const { unmount: unmountMemory } = render(
      <MemoryRouter>
        <MemoryBank />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Cognitive Fusion Protocols/i)).toBeInTheDocument();
    });
    unmountMemory();
    
    // Test Team page has data
    const { unmount: unmountTeam } = render(
      <MemoryRouter>
        <Team />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Dr. Sarah Chen/i)).toBeInTheDocument();
    });
    unmountTeam();
    
    // Test Dashboard has data
    render(
      <MemoryRouter>
        <WorkspaceDashboard />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Total Memories/i)).toBeInTheDocument();
    });
  });
});
