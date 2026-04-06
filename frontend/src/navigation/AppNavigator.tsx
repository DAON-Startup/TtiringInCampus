import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../store/authStore';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import HomeScreen from '../screens/home/HomeScreen';
import SearchScreen from '../screens/search/SearchScreen';
import BookmarkScreen from '../screens/bookmark/BookmarkScreen';
import ReportScreen from '../screens/report/ReportScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import NoticeDetailScreen from '../screens/notice/NoticeDetailScreen';

import { colors } from '../styles/tokens';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.gray[500],
    }}
  >
    <Tab.Screen name="홈" component={HomeScreen} />
    <Tab.Screen name="검색" component={SearchScreen} />
    <Tab.Screen name="북마크" component={BookmarkScreen} />
    <Tab.Screen name="AI리포트" component={ReportScreen} />
    <Tab.Screen name="설정" component={SettingsScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="NoticeDetail"
            component={NoticeDetailScreen}
            options={{ headerShown: true, title: '상세보기' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
