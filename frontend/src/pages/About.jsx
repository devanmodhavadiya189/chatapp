import { Link } from 'wouter';
import { ArrowLeft, Mail, Github, Linkedin } from 'lucide-react';
import image1 from '../assets/image1.jpg';
import ownerImage from '../assets/owner.jpg';

export default function About() {
  return (
    <div className="min-h-screen bg-sky-subtle overflow-y-auto animate-fade-in">
      <div className="sticky top-0 z-10 border-b border-themed animate-fade-in" style={{ background: 'var(--bg-nav)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
        <div className="container mx-auto px-4 py-4">
          <Link href="/chat" className="inline-flex items-center space-x-2 text-themed-link transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Chat</span>
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in relative z-10">
        <div className="text-center mb-16">
          <img 
            src={image1} 
            alt="SamVad Logo" 
            className="w-32 h-32 mx-auto mb-6 rounded-2xl object-cover shadow-sm" 
          />
          <h1 className="text-4xl font-bold text-themed-heading mb-4">About SamVad</h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            A modern chat application designed for seamless communication
          </p>
        </div>

        <div className="mb-16 space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-themed-heading mb-2">Key Features</h2>
            <ul className="space-y-3 list-disc pl-5" style={{ color: 'var(--text-secondary)' }}>
              <li>Instant messaging with WebSocket technology</li>
              <li>Secure file sharing capabilities</li>
              <li>JWT authentication for security</li>
              <li>Responsive design for all devices</li>
              <li>User profile management</li>
              <li>Clean and intuitive interface</li>
            </ul>
          </div>

          <div className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-semibold text-themed-heading mb-2">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2" style={{ color: 'var(--accent-primary)' }}>Frontend</h3>
                <ul className="space-y-2 list-disc pl-5" style={{ color: 'var(--text-secondary)' }}>
                  <li>React.js with Vite</li>
                  <li>Tailwind CSS</li>
                  <li>Socket.IO Client</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2" style={{ color: 'var(--accent-primary)' }}>Backend</h3>
                <ul className="space-y-2 list-disc pl-5" style={{ color: 'var(--text-secondary)' }}>
                  <li>Node.js & Express</li>
                  <li>MongoDB Database</li>
                  <li>Socket.IO Server</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <img 
              src={ownerImage} 
              alt="Devan Modhavadiya" 
              className="w-32 h-32 rounded-2xl object-cover shadow-sm" 
            />
            
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-themed-heading mb-1">Devan Modhavadiya</h2>
              <p className="mb-4" style={{ color: 'var(--accent-primary)' }}>Fullstack Developer</p>
              
              <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                Computer Science student specializing in MERN stack development. Passionate about building efficient web applications and solving complex problems.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a 
                  href="mailto:modhavadiyadevan189@gmail.com" 
                  className="flex items-center gap-2 text-themed-link transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Mail size={18} />
                  <span>Email</span>
                </a>
                <a 
                  href="https://github.com/devanmodhavadiya189" 
                  className="flex items-center gap-2 text-themed-link transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={18} />
                  <span>GitHub</span>
                </a>
                <a 
                  href="https://www.linkedin.com/in/devan-modhavadiya-08a764284/" 
                  className="flex items-center gap-2 text-themed-link transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin size={18} />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center py-8 animate-fade-in" style={{ color: 'var(--text-tertiary)' }}>
          Thanks for visit. - D R Modhavadiya
        </div>
      </div>
    </div>
  );
}