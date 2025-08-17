import { Link } from 'wouter';
import { ArrowLeft, Mail, Github, Linkedin } from 'lucide-react';
import image1 from '../assets/image1.jpg';
import ownerImage from '../assets/owner.jpg';

export default function About() {
  return (
    <div className="min-h-screen bg-sky-50 overflow-y-auto animate-fade-in">
      <div className="sticky top-0 z-10 bg-sky-50/90 backdrop-blur-sm border-b border-sky-100 animate-fade-in">
        <div className="container mx-auto px-4 py-4">
          <Link href="/chat">
            <a className="inline-flex items-center space-x-2 text-sky-700 hover:text-sky-600 transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Chat</span>
            </a>
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
        <div className="text-center mb-16">
          <img 
            src={image1} 
            alt="SamVad Logo" 
            className="w-32 h-32 mx-auto mb-6 rounded-lg object-cover shadow-sm" 
          />
          <h1 className="text-4xl font-bold text-sky-900 mb-4">About SamVad</h1>
          <p className="text-lg text-sky-700 max-w-2xl mx-auto">
            A modern chat application designed for seamless communication
          </p>
        </div>

        <div className="mb-16 space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-sky-800 mb-2">Key Features</h2>
            <ul className="space-y-3 text-sky-700 list-disc pl-5">
              <li>Instant messaging with WebSocket technology</li>
              <li>Secure file sharing capabilities</li>
              <li>JWT authentication for security</li>
              <li>Responsive design for all devices</li>
              <li>User profile management</li>
              <li>Clean and intuitive interface</li>
            </ul>
          </div>

          <div className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-semibold text-sky-800 mb-2">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-sky-700 mb-2">Frontend</h3>
                <ul className="space-y-2 text-sky-700 list-disc pl-5">
                  <li>React.js with Vite</li>
                  <li>Tailwind CSS</li>
                  <li>Socket.IO Client</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-sky-700 mb-2">Backend</h3>
                <ul className="space-y-2 text-sky-700 list-disc pl-5">
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
              className="w-32 h-32 rounded-lg object-cover shadow-sm" 
            />
            
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-sky-800 mb-1">Devan Modhavadiya</h2>
              <p className="text-sky-600 mb-4">Fullstack Developer</p>
              
              <p className="text-sky-700 mb-4">
                Computer Science student specializing in MERN stack development. Passionate about building efficient web applications and solving complex problems.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a 
                  href="mailto:modhavadiyadevan189@gmail.com" 
                  className="flex items-center gap-2 text-sky-600 hover:text-sky-800 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Mail size={18} />
                  <span>Email</span>
                </a>
                <a 
                  href="https://github.com/devanmodhavadiya189" 
                  className="flex items-center gap-2 text-sky-600 hover:text-sky-800 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={18} />
                  <span>GitHub</span>
                </a>
                <a 
                  href="https://www.linkedin.com/in/devan-modhavadiya-08a764284/" 
                  className="flex items-center gap-2 text-sky-600 hover:text-sky-800 transition-colors"
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

        <div className="text-center text-sky-600 py-8 animate-fade-in">
          Thanks for visit. - D R Modhavadiya
        </div>
      </div>
    </div>
  );
}