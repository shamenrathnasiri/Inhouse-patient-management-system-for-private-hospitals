import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaUsers, FaStethoscope, FaComments, FaSignOutAlt, FaNotesMedical, FaUserMd } from 'react-icons/fa';

const Sidebar = () => {
  const { setContent, currentUser, content, unreadCount, markMessagesAsRead } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('role');
    localStorage.removeItem('role');
    navigate('/');
  };

  const handleNavClick = (contentKey) => {
    setContent(contentKey);
  };

  const handleChatClick = () => {
    markMessagesAsRead();
    setContent('chatbox');
  };

  const NavItem = ({ icon, label, contentKey, onClick, badge }) => {
    const isActive = content === contentKey;
    return (
      <button
        onClick={onClick || (() => handleNavClick(contentKey))}
        className={`w-full nav-item ${isActive ? 'nav-item-active' : ''} relative`}
      >
        <span className={`text-lg ${isActive ? 'text-primary-400' : ''}`}>{icon}</span>
        <span className="text-sm">{label}</span>
        {badge > 0 && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white bg-red-500 rounded-full animate-pulse">
            {badge}
          </span>
        )}
      </button>
    );
  };

  const roleConfig = {
    attendant: {
      title: 'Attendant',
      icon: <FaUsers className="w-4 h-4 text-primary-400" />,
      color: 'primary',
      items: [
        { icon: <FaUserPlus />, label: 'Add Patient', contentKey: 'addpatient' },
        { icon: <FaUsers />, label: 'View Patients', contentKey: 'allpatients' },
      ],
    },
    nurse: {
      title: 'Head Nurse',
      icon: <FaNotesMedical className="w-4 h-4 text-accent-400" />,
      color: 'accent',
      items: [
        { icon: <FaStethoscope />, label: 'View Patients', contentKey: 'viewpatients' },
        { icon: <FaComments />, label: 'Chat', contentKey: 'chatbox', onClick: handleChatClick, badge: unreadCount },
      ],
    },
    doctor: {
      title: 'Doctor',
      icon: <FaUserMd className="w-4 h-4 text-purple-400" />,
      color: 'purple',
      items: [
        { icon: <FaStethoscope />, label: 'View Patients', contentKey: 'patientcheck' },
        { icon: <FaComments />, label: 'Chat', contentKey: 'chatbox', onClick: handleChatClick, badge: unreadCount },
      ],
    },
  };

  const config = roleConfig[currentUser];

  return (
    <nav className="flex flex-col h-full justify-between">
      <div className="space-y-1">
        {/* Role Badge */}
        {config && (
          <>
            <div className="flex items-center gap-2 px-4 py-2 mb-3">
              {config.icon}
              <span className="text-xs font-semibold uppercase tracking-wider text-dark-500">{config.title} Panel</span>
            </div>

            {/* Nav Items */}
            {config.items.map((item) => (
              <NavItem
                key={item.contentKey}
                icon={item.icon}
                label={item.label}
                contentKey={item.contentKey}
                onClick={item.onClick}
                badge={item.badge}
              />
            ))}
          </>
        )}
      </div>

      {/* Logout */}
      <div className="pt-4 mt-4 border-t border-dark-800/50">
        <button
          id="logout-btn"
          onClick={handleLogout}
          className="w-full nav-item text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
