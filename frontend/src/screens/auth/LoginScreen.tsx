import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, Image, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api';
import { colors, spacing, fonts } from '../../styles/tokens';

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
    if (email === TEST_EMAIL && password === TEST_PASSWORD) {
      await setTokens('mock-access-token', 'mock-refresh-token');
      return;
    }
    try {
      const response = await authApi.login({ email, password });
      const { accessToken, refreshToken } = response.data.data;
      await setTokens(accessToken, refreshToken);
    } catch {
      Alert.alert('로그인 실패', '이메일 또는 비밀번호를 확인해주세요.');
    }
  };

  const fillTestAccount = () => {
    setEmail(TEST_EMAIL);
    setPassword(TEST_PASSWORD);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* 로고 */}
        <Image source={require('../../../assets/icon.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.appName}>띠링인캠퍼스</Text>
        <Text style={styles.subtitle}>인천대학교 통합 공지사항</Text>

        {/* 폼 */}
        <View style={styles.form}>
          <View style={styles.inputWrap}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={styles.input}
              placeholder="example@inu.ac.kr"
              placeholderTextColor={colors.gray[400]}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputWrap}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호 입력"
              placeholderTextColor={colors.gray[400]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.buttonText}>로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.testButton} onPress={fillTestAccount} activeOpacity={0.8}>
            <Text style={styles.testButtonText}>테스트 계정으로 로그인</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupText}>
            계정이 없으신가요? <Text style={styles.signupLink}>회원가입</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.white },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  appName: {
    fontSize: 28,
    fontFamily: fonts.extraBold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.gray[500],
    marginBottom: spacing.xxl,
  },
  form: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  inputWrap: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.gray[300],
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.text,
    backgroundColor: colors.gray[100],
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.bold,
  },
  testButton: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  testButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fonts.semiBold,
  },
  signupText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.gray[600],
  },
  signupLink: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },
});

export default LoginScreen;
