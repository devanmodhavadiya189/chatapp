export function useProfileForm(user, activeTab) {
  const [formData, setFormData] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profilephoto: null
  });

  const handleInputChange = (e, setError, setSuccess) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleFileChange = (e, setError, setSuccess) => {
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

  const resetForm = (user) => {
    if (activeTab === 'profile') {
      setFormData(prev => ({
        ...prev,
        fullname: user?.fullname || '',
        email: user?.email || '',
        profilephoto: null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    }
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleFileChange,
    resetForm
  };
}

export function validateProfileForm(formData, activeTab, setError) {
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
}
