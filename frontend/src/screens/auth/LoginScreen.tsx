import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api';
import { colors, spacing, typography } from '../../styles/tokens';

const TEST_EMAIL = 'test@inu.ac.kr';
const TEST_PASSWORD = 'Test1234!';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setTokens = useAuthStore((state) => state.setTokens);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('입력 오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }
    // 테스트 계정 우회 (백엔드 없이 로그인)
    if (email === TEST_EMAIL && password === TEST_PASSWORD) {
      await setTokens('mock-access-token', 'mock-refresh-token');
      return;
    }
    try {
      const response = await authApi.login({ email, password });
      const { accessToken, refreshToken } = response.data.data;
      await setTokens(accessToken, refreshToken);
    } catch (error) {
      Alert.alert('로그인 실패', '이메일 또는 비밀번호를 확인해주세요.');
    }
  };

  const fillTestAccount = () => {
    setEmail(TEST_EMAIL);
    setPassword(TEST_PASSWORD);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>띠링인캠퍼스</Text>
      <Text style={styles.subtitle}>인천대학교 통합 공지사항</Text>
      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.testButton} onPress={fillTestAccount}>
        <Text style={styles.testButtonText}>테스트 계정으로 로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>계정이 없으신가요? 회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.white,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body2,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonText: {
    color: colors.white,
    ...typography.h3,
  },
  testButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  testButtonText: {
    color: colors.primary,
    ...typography.body1,
  },
  signupText: {
    textAlign: 'center',
    marginTop: spacing.lg,
    color: colors.gray[600],
  },
});

export default LoginScreen;
