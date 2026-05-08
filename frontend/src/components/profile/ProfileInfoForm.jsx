import { User, Mail } from 'lucide-react';

export default function ProfileInfoForm({ formData, handleInputChange }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-2 text-themed-label" style={{ color: 'var(--text-label)' }}>
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: 'var(--text-muted)' }} />
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

      <div>
        <label className="block text-sm font-medium mb-2 text-themed-label" style={{ color: 'var(--text-label)' }}>
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: 'var(--text-muted)' }} />
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
  );
}
