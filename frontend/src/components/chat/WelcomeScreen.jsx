import Welcome3DFace from '../Welcome3DFace';
import Sidebar from '../Sidebar';

export default function WelcomeScreen({ onShowProfile, onShowAbout }) {
  return (
    <div className="flex-1 flex flex-col md:items-center md:justify-center">
      <div className="block md:hidden border-b border-sky-100">
        <Sidebar 
          onShowProfile={onShowProfile}
          onShowAbout={onShowAbout}
        />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Welcome3DFace />
          <h3 className="text-xl font-semibold text-sky-deep mb-2">Welcome to SamVad</h3>
          <p className="text-neutral-500">Select a conversation to start messaging</p>
        </div>
      </div>
    </div>
  );
}
