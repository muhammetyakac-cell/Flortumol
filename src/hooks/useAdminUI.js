import { useState } from 'react';

export default function useAdminUI() {
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(true);
  const [adminTab, setAdminTab] = useState('chat');
  const [adminDarkMode, setAdminDarkMode] = useState(true);
  const [notificationSoundEnabled, setNotificationSoundEnabled] = useState(true);

  return {
    adminDrawerOpen, setAdminDrawerOpen,
    adminTab, setAdminTab,
    adminDarkMode, setAdminDarkMode,
    notificationSoundEnabled, setNotificationSoundEnabled,
  };
}
