import image1 from '../assets/image1.jpg';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 gradient-bg flex items-center justify-center z-50">
      <div className="text-center">
        <img 
          src={image1} 
          alt="SamVad Logo" 
          className="w-24 h-24 mx-auto mb-6 animate-bounce-slow rounded-2xl shadow-lg" 
        />
        <h1 className="text-3xl font-bold text-white mb-2">SamVad</h1>
        <p className="text-blue-100 text-lg mb-8">Connecting Conversations</p>
        <div className="loading-spinner mx-auto"></div>
      </div>
    </div>
  );
}