import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';
import { convertFileToBase64 } from '../utils/fileHelpers';
import { validateProfileForm } from '../utils/hooks/useProfileForm';
import ProfilePictureSection from './profile/ProfilePictureSection';
import ProfileInfoForm from './profile/ProfileInfoForm';
import PasswordChangeForm from './profile/PasswordChangeForm';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profilephoto: null
  });
  
  const [activeTab, setActiveTab] = useState('profile');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilephoto: file
      }));
      setError('');
      setSuccess('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfileForm(formData, activeTab, setError)) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (activeTab === 'profile') {
        const updateData = {
          fullname: formData.fullname.trim(),
          email: formData.email.trim()
        };
        
        if (formData.profilephoto) {
          const base64 = await convertFileToBase64(formData.profilephoto);
          updateData.profilephoto = base64;
        }

        await updateProfile(updateData);
        setSuccess('Profile updated successfully!');
        
        setFormData(prev => ({
          ...prev,
          fullname: user?.fullname || '',
          email: user?.email || '',
          profilephoto: null
        }));
      } else if (activeTab === 'password') {
        await updateProfile({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });
        setSuccess('Password updated successfully!');
        
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
      <div className="card-sky w-full max-w-md max-h-[90vh] overflow-y-auto animate-sky-slide">
        <div className="flex items-center justify-between p-6 border-b border-themed">
          <h2 className="text-2xl font-bold text-themed-heading">Edit Profile</h2>
          <button
            onClick={onClose}
            className="transition-colors rounded-xl p-1"
            style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
          >
            <X size={24} />
          </button>
        </div>

        <ProfilePictureSection user={user} handleFileChange={handleFileChange} />

        <div className="flex border-b border-themed">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'border-b-2'
                : ''
            }`}
            style={{
              color: activeTab === 'profile' ? 'var(--accent-primary)' : 'var(--text-tertiary)',
              borderColor: activeTab === 'profile' ? 'var(--accent-primary)' : 'transparent'
            }}
          >
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'password'
                ? 'border-b-2'
                : ''
            }`}
            style={{
              color: activeTab === 'password' ? 'var(--accent-primary)' : 'var(--text-tertiary)',
              borderColor: activeTab === 'password' ? 'var(--accent-primary)' : 'transparent'
            }}
          >
            Change Password
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="status-error px-4 py-3 text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="status-success px-4 py-3 text-sm">
              {success}
            </div>
          )}

          {activeTab === 'profile' ? (
            <ProfileInfoForm formData={formData} handleInputChange={handleInputChange} />
          ) : (
            <PasswordChangeForm formData={formData} handleInputChange={handleInputChange} />
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-sky-primary w-full py-3"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Updating...</span>
              </div>
            ) : (
              `Update ${activeTab === 'profile' ? 'Profile' : 'Password'}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}