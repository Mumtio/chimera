import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { CyberButton, CyberCard, Container } from '../components/ui';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white scanlines">
      <Container maxWidth="2xl" className="py-12">
        <div className="text-center mb-12">
          <div className="mb-6 flex justify-center">
            <Brain className="w-24 h-24 text-neon-green pulse-glow" />
          </div>
          <h1 className="text-5xl font-bold mb-4 glow-text text-neon-green font-cyber">
            About Chimera Protocol
          </h1>
        </div>

        <CyberCard glowBorder cornerAccents className="mb-8">
          <div className="space-y-6 text-gray-300 text-lg">
            <p className="text-2xl text-neon-green font-cyber">
              Welcome to the Lab of the Chimera Protocol. Here, multiple models share one twisted mind.
            </p>
            
            <p>
              The Chimera Protocol is a revolutionary system that enables multiple AI models 
              (GPT, Claude, Gemini) to share a unified memory bank. Like the mythical Chimera, 
              our system fuses different cognitive entities into a single, powerful intelligence.
            </p>

            <p>
              Through advanced memory injection protocols, conversations with any AI model can 
              access the same shared knowledge base, creating a truly unified cognitive experience 
              across different AI architectures.
            </p>

            <div className="border-l-4 border-neon-green pl-6 py-4 bg-deep-teal/30">
              <p className="text-neon-green font-cyber text-xl mb-2">
                Key Features:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Unified memory bank across multiple AI models</li>
                <li>Real-time memory injection into conversations</li>
                <li>Semantic search and memory management</li>
                <li>Team collaboration and workspace management</li>
                <li>Developer console for programmatic access</li>
              </ul>
            </div>

            <p>
              Built with cutting-edge web technologies and a cyberpunk aesthetic, 
              the Chimera Protocol represents the future of AI interaction.
            </p>
          </div>
        </CyberCard>

        <div className="text-center">
          <CyberButton
            variant="primary"
            size="lg"
            glow
            onClick={() => navigate('/')}
          >
            Return to Landing Page
          </CyberButton>
        </div>
      </Container>
    </div>
  );
}
