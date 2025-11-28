import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { CyberButton, Container } from '../components/ui';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white scanlines flex items-center justify-center">
      <Container maxWidth="lg">
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <AlertTriangle className="w-32 h-32 text-error-red pulse-glow" />
          </div>
          
          <h1 className="text-8xl font-bold mb-4 text-error-red font-cyber glitch-text">
            ERROR 404
          </h1>
          
          <p className="text-3xl text-gray-300 mb-8">
            The Chimera Ate This Page.
          </p>
          
          <p className="text-gray-500 mb-12 max-w-md mx-auto">
            The neural pathway you're looking for has been consumed by the system. 
            Return to the lab entrance to continue your research.
          </p>

          <CyberButton
            variant="primary"
            size="lg"
            glow
            pulse
            onClick={() => navigate('/')}
          >
            Return to Lab Entrance
          </CyberButton>
        </div>
      </Container>
    </div>
  );
}
