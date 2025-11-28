import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { CyberButton, CyberInput, CyberCard, Container } from '../components/ui';
import { useAuthStore } from '../stores/authStore';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    await signup(name, email, password);
    navigate('/app/workspace/workspace-1');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Container maxWidth="md">
        <div className="text-center mb-8">
          <div className="mb-6 flex justify-center">
            <UserPlus className="w-16 h-16 text-neon-green" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-neon-green font-cyber">
            Create Identity
          </h1>
          <p className="text-gray-400">
            Join the Chimera Protocol network
          </p>
        </div>

        <CyberCard>
          <div className="space-y-6 p-8">
            <div>
              <label className="block text-neon-green text-sm font-medium mb-2">
                Full Name
              </label>
              <CyberInput
                type="text"
                placeholder="Dr. Neural Scientist"
                value={name}
                onChange={setName}
              />
            </div>

            <div>
              <label className="block text-neon-green text-sm font-medium mb-2">
                Email Address
              </label>
              <CyberInput
                type="email"
                placeholder="user@chimera.io"
                value={email}
                onChange={setEmail}
              />
            </div>
            
            <div>
              <label className="block text-neon-green text-sm font-medium mb-2">
                Password
              </label>
              <CyberInput
                type="password"
                placeholder="Enter secure password"
                value={password}
                onChange={setPassword}
              />
            </div>

            <CyberButton
              variant="primary"
              size="lg"
              onClick={handleSignup}
              className="w-full"
            >
              Sign Up
            </CyberButton>

            <div className="text-center">
              <button
                onClick={() => navigate('/auth/login')}
                className="text-neon-green hover:text-neon-green/80 transition-colors"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        </CyberCard>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Back to Landing
          </button>
        </div>
      </Container>
    </div>
  );
}
