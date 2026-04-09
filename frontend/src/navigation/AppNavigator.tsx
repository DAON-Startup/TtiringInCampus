import React from 'react';
import { Text, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../store/authStore';
import { colors, fonts } from '../styles/tokens';

import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import HomeScreen from '../screens/home/HomeScreen';
import SearchScreen from '../screens/search/SearchScreen';
import BookmarkScreen from '../screens/bookmark/BookmarkScreen';
import ReportScreen from '../screens/report/ReportScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import NoticeDetailScreen from '../screens/notice/NoticeDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  홈: '🏠',
  검색: '🔍',
  북마크: '🔖',
  'AI리포트': '✨',
  설정: '⚙️',
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.primary,
        height: Platform.OS === 'ios' ? 80 : 60,
        paddingBottom: Platform.OS === 'ios' ? 20 : 8,
        paddingTop: 8,
        borderTopWidth: 0,
      },
      tabBarActiveTintColor: colors.black,
      tabBarInactiveTintColor: colors.white,
      tabBarLabelStyle: {
        fontFamily: fonts.semiBold,
        fontSize: 11,
      },
      tabBarIcon: ({ color }) => (
        <Text style={{ fontSize: 20, color }}>{TAB_ICONS[route.name]}</Text>
      ),
    })}
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
            options={{
              headerShown: true,
              title: '공지 상세',
              headerStyle: { backgroundColor: colors.white },
              headerTintColor: colors.text,
              headerTitleStyle: { fontFamily: fonts.bold, fontSize: 17 },
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
