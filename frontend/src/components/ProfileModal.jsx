import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, User, Mail, Lock, Eye, EyeOff, Camera } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profilephoto: null
  });
  
  // UI states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'password'

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

  const validateForm = () => {
    if (activeTab === 'profile') {
      if (!formData.fullname.trim()) {
        setError('Full name is required');
        return false;
      }
      if (!formData.email.trim()) {
        setError('Email is required');
        return false;
      }
      if (!formData.email.includes('@')) {
        setError('Please enter a valid email');
        return false;
      }
    } else if (activeTab === 'password') {
      if (!formData.currentPassword) {
        setError('Current password is required');
        return false;
      }
      if (!formData.newPassword) {
        setError('New password is required');
        return false;
      }
      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters');
        return false;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (activeTab === 'profile') {
        // Update profile info
        const updateData = {
          fullname: formData.fullname.trim(),
          email: formData.email.trim()
        };
        
        if (formData.profilephoto) {
          // Convert file to base64
          const base64 = await convertFileToBase64(formData.profilephoto);
          updateData.profilephoto = base64;
        }

        await updateProfile(updateData);
        setSuccess('Profile updated successfully!');
        
        // Reset form
        setFormData(prev => ({
          ...prev,
          fullname: user?.fullname || '',
          email: user?.email || '',
          profilephoto: null
        }));
      } else if (activeTab === 'password') {
        // Update password
        await updateProfile({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });
        setSuccess('Password updated successfully!');
        
        // Reset password fields
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

  // Helper function to convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const getInitials = (fullname) => {
    return fullname
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card-sky w-full max-w-md max-h-[90vh] overflow-y-auto animate-sky-slide">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sky-200">
          <h2 className="text-2xl font-bold text-sky-deep">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-sky-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Profile Picture Section */}
        <div className="p-6 border-b border-sky-200">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold shadow-lg border-4 border-sky-300">
                {user?.profilephoto ? (
                  <img 
                    src={user.profilephoto} 
                    alt={user.fullname}
                    className="w-28 h-28 rounded-full object-cover" 
                  />
                ) : (
                  <span className="text-3xl">{getInitials(user?.fullname || 'User')}</span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-sky-primary text-white p-3 rounded-full cursor-pointer hover:bg-sky-primary-dark transition-colors shadow-lg border-2 border-white">
                <Camera size={18} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <h3 className="font-semibold text-sky-deep">{user?.fullname}</h3>
              <p className="text-sm text-neutral-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-sky-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-sky-primary border-b-2 border-sky-primary'
                : 'text-neutral-500 hover:text-sky-primary'
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'password'
                ? 'text-sky-primary border-b-2 border-sky-primary'
                : 'text-neutral-500 hover:text-sky-primary'
            }`}
          >
            Change Password
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {activeTab === 'profile' ? (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    className="input-sky pl-10"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-sky pl-10"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="input-sky pl-10 pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
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