import { useNavigate } from 'react-router-dom';
import { CyberButton, Container } from '../components/ui';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      <Container maxWidth="2xl" className="flex-1 flex flex-col items-center justify-center py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          {/* Brain in a Vat Illustration */}
          <div className="mb-12 flex justify-center relative">
            <div className="relative">
              
              {/* Brain SVG */}
              <svg
                className="w-48 h-48 relative z-10"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Vat/Container */}
                <path
                  d="M50 80 L50 160 Q50 180 70 180 L130 180 Q150 180 150 160 L150 80"
                  stroke="#00FFAA"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.6"
                />
                <ellipse cx="100" cy="80" rx="50" ry="15" stroke="#00FFAA" strokeWidth="2" fill="none" opacity="0.6" />
                
                {/* Liquid level lines */}
                <line x1="50" y1="100" x2="150" y2="100" stroke="#00FFAA" strokeWidth="1" opacity="0.3" strokeDasharray="4 4">
                  <animate attributeName="y1" values="100;105;100" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="y2" values="100;105;100" dur="3s" repeatCount="indefinite" />
                </line>
                <line x1="50" y1="130" x2="150" y2="130" stroke="#00FFAA" strokeWidth="1" opacity="0.3" strokeDasharray="4 4">
                  <animate attributeName="y1" values="130;135;130" dur="3.5s" repeatCount="indefinite" />
                  <animate attributeName="y2" values="130;135;130" dur="3.5s" repeatCount="indefinite" />
                </line>
                
                {/* Brain outline */}
                <g className="pulse-glow">
                  {/* Left hemisphere */}
                  <path
                    d="M100 60 Q85 55 75 65 Q70 70 70 80 Q70 90 75 100 Q80 110 90 115 Q95 118 100 115"
                    stroke="#00FFAA"
                    strokeWidth="2.5"
                    fill="none"
                  />
                  {/* Right hemisphere */}
                  <path
                    d="M100 60 Q115 55 125 65 Q130 70 130 80 Q130 90 125 100 Q120 110 110 115 Q105 118 100 115"
                    stroke="#00FFAA"
                    strokeWidth="2.5"
                    fill="none"
                  />
                  {/* Brain folds/details */}
                  <path
                    d="M85 70 Q90 75 85 80"
                    stroke="#00FFAA"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M115 70 Q110 75 115 80"
                    stroke="#00FFAA"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M80 90 Q85 95 80 100"
                    stroke="#00FFAA"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M120 90 Q115 95 120 100"
                    stroke="#00FFAA"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  {/* Corpus callosum */}
                  <path
                    d="M95 85 Q100 83 105 85"
                    stroke="#00FFAA"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </g>
                
                {/* Connection wires/tubes */}
                <path
                  d="M100 115 L100 140"
                  stroke="#00FFAA"
                  strokeWidth="2"
                  opacity="0.7"
                  strokeDasharray="4 4"
                >
                  <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" />
                </path>
                
                {/* Bubbles */}
                <circle cx="70" cy="140" r="3" fill="#00FFAA" opacity="0.4">
                  <animate attributeName="cy" values="140;80;140" dur="4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="4s" repeatCount="indefinite" />
                </circle>
                <circle cx="130" cy="150" r="2" fill="#00FFAA" opacity="0.4">
                  <animate attributeName="cy" values="150;80;150" dur="5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="5s" repeatCount="indefinite" />
                </circle>
                <circle cx="90" cy="160" r="2.5" fill="#00FFAA" opacity="0.4">
                  <animate attributeName="cy" values="160;80;160" dur="4.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="4.5s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-6xl font-bold mb-4 text-neon-green font-cyber uppercase tracking-wider">
            Chimera<br/>Protocol
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            One Memory. <span className="text-neon-green">Multiple Minds.</span>
          </p>
          
          {/* Action Buttons */}
          <div className="flex gap-6 justify-center flex-wrap">
            <CyberButton
              variant="primary"
              size="lg"
              onClick={() => navigate('/auth/login')}
            >
              Enter Lab →
            </CyberButton>
            <CyberButton
              variant="secondary"
              size="lg"
              onClick={() => navigate('/about')}
            >
              Protocol Info
            </CyberButton>
          </div>
        </div>
      </Container>

      {/* Footer */}
      <footer className="border-t border-deep-teal py-6 relative z-10 bg-black bg-opacity-80">
        <Container maxWidth="2xl">
          <div className="flex justify-center gap-8 text-gray-400">
            <a 
              href="#docs" 
              className="hover:text-neon-green transition-colors duration-300 uppercase tracking-wider text-sm font-medium"
            >
              Docs
            </a>
            <a 
              href="#github" 
              className="hover:text-neon-green transition-colors duration-300 uppercase tracking-wider text-sm font-medium"
            >
              GitHub
            </a>
            <a 
              href="#privacy" 
              className="hover:text-neon-green transition-colors duration-300 uppercase tracking-wider text-sm font-medium"
            >
              Privacy
            </a>
          </div>
        </Container>
      </footer>
    </div>
  );
}
