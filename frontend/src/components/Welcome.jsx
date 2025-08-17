import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useAuth } from '../context/AuthContext';
import image1 from '../assets/image1.jpg';

export default function Welcome() {
  const { isAuthenticated } = useAuth();
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = [
    {
      title: "Enterprise Messaging",
      description: "Professional-grade real-time communication for modern businesses and teams.",
      icon: "💼"
    },
    {
      title: "Secure & Reliable",
      description: "Bank-level security with 99.9% uptime guarantee for mission-critical communications.",
      icon: "🔐"
    },
    {
      title: "Seamless Experience",
      description: "Intuitive design that enhances productivity and streamlines collaboration.",
      icon: "⚡"
    }
  ];

  useEffect(() => {
    const featureInterval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => {
      clearInterval(featureInterval);
    };
  }, []);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen bg-sky-subtle flex flex-col">
      <div className="container-sky py-8 flex-1 flex flex-col justify-center">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-sky-fade">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="logo-sky">
              <img 
                src={image1} 
                alt="SamVad" 
                className="w-24 h-24 rounded-2xl object-cover shadow-lg" 
              />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="heading-sky text-5xl md:text-6xl font-bold mb-6">
            SamVad
          </h1>
          
          <p className="text-2xl md:text-3xl text-neutral-600 mb-4 font-light">
            Professional Communication Platform
          </p>
          
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            Connect your team with enterprise-grade messaging that combines 
            powerful functionality with an elegant, professional interface.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <button className="btn-sky-primary text-lg px-8 py-4 rounded-lg">
                Start Free Trial
              </button>
            </Link>
            
            <Link href="/login">
              <button className="btn-sky-secondary text-lg px-8 py-4 rounded-lg">
                Sign In
              </button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 animate-sky-slide">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`card-sky p-8 text-center ${
                index === currentFeature ? 'transform scale-105' : ''
              }`}
            >
              <div className="text-4xl mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-sky-deep mb-3">{feature.title}</h3>
              <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Professional Stats Section */}
        <div className="card-sky p-8 mb-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold text-sky-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                99.9%
              </div>
              <p className="text-neutral-600 font-medium">Uptime Guarantee</p>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-sky-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <p className="text-neutral-600 font-medium">Professional Support</p>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-sky-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                10K+
              </div>
              <p className="text-neutral-600 font-medium">Enterprise Clients</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center animate-sky-fade">
          <h2 className="text-3xl font-bold text-sky-deep mb-4">
            Ready to Enhance Your Team Communication?
          </h2>
          <p className="text-neutral-600 mb-8 text-lg max-w-2xl mx-auto">
            Join leading organizations worldwide who trust SamVad for their 
            professional communication needs.
          </p>
          <Link href="/signup">
            <button className="btn-sky-primary text-xl px-12 py-4 rounded-lg">
              Get Started Today
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
