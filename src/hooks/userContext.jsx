import React, { createContext, useContext, useState } from 'react';
import UserService from '@/api/services/userService.js';

// 1. Context 생성
const ProfileContext = createContext();

// 2. Provider 컴포넌트
export const ProfileProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const getImageUrl = (url) => {
    if (!url) return null;

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    return `${import.meta.env.VITE_API_BASE_URL}${url}`;
  };
  const setProfileData = async () => {
    const data = await UserService.getUserProfileData();

    setUser({
      nickName: data.nickName,
      profileUrl: getImageUrl(data.imageUrl),
    });
  };

  return (
    <ProfileContext.Provider value={{ user, setUser, setProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
