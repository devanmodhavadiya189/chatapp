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
    <div className="min-h-screen bg-sky-subtle flex flex-col">
      <div className="container-sky py-6 sm:py-8 flex-1 flex flex-col justify-center">
        {/* Hero Section */}
  <div className="text-center mb-10 sm:mb-16 animate-sky-fade px-2">
          {/* Logo */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="logo-sky">
              <img 
                src={image1} 
                alt="SamVad" 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-lg" 
              />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="heading-sky text-3xl xs:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            SamVad
          </h1>
          
          <p className="text-lg xs:text-xl md:text-2xl text-neutral-600 mb-2 sm:mb-4 font-light">
            Professional Communication Platform
          </p>
          
          <p className="text-base xs:text-lg text-neutral-500 max-w-xl mx-auto mb-8 sm:mb-12 leading-relaxed px-1">
            Connect your team with enterprise-grade messaging that combines 
            powerful functionality with an elegant, professional interface.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link href="/signup">
              <button className="btn-sky-primary text-base xs:text-lg px-6 xs:px-8 py-3 xs:py-4 rounded-lg w-full xs:w-auto">
                Start Free Trial
              </button>
            </Link>
            
            <Link href="/login">
              <button className="btn-sky-secondary text-base xs:text-lg px-6 xs:px-8 py-3 xs:py-4 rounded-lg w-full xs:w-auto">
                Sign In
              </button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 mb-10 sm:mb-16 animate-sky-slide px-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`card-sky p-4 xs:p-6 sm:p-8 text-center ${
                index === currentFeature ? 'transform scale-105' : ''
              }`}
            >
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-sky-deep mb-2 sm:mb-3">{feature.title}</h3>
              <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Professional Stats Section */}
        <div className="card-sky p-4 xs:p-6 sm:p-8 mb-10 sm:mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 text-center">
            <div className="group">
              <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-sky-primary mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                99.9%
              </div>
              <p className="text-neutral-600 font-medium text-xs sm:text-base">Uptime Guarantee</p>
            </div>
            <div className="group">
              <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-sky-primary mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <p className="text-neutral-600 font-medium text-xs sm:text-base">Professional Support</p>
            </div>
            <div className="group">
              <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-sky-primary mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                10K+
              </div>
              <p className="text-neutral-600 font-medium text-xs sm:text-base">Enterprise Clients</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center animate-sky-fade px-2">
          <h2 className="text-2xl xs:text-3xl font-bold text-sky-deep mb-2 sm:mb-4">
            Ready to Enhance Your Team Communication?
          </h2>
          <p className="text-neutral-600 mb-6 sm:mb-8 text-base xs:text-lg max-w-xl mx-auto">
            Join leading organizations worldwide who trust SamVad for their 
            professional communication needs.
          </p>
          <Link href="/signup">
            <button className="btn-sky-primary text-base xs:text-xl px-8 xs:px-12 py-3 xs:py-4 rounded-lg w-full xs:w-auto">
              Get Started Today
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
