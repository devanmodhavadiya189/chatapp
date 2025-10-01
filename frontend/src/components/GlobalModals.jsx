import { useProfile } from '../context/ProfileContext';
import ProfileModal from './ProfileModal';

export default function GlobalModals() {
  const { showProfile, closeProfile } = useProfile();

  return (
    <>
      <ProfileModal
        isOpen={showProfile}
        onClose={closeProfile}
      />
    </>
  );
}