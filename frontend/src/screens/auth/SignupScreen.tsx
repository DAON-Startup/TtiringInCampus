import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { colors, spacing, fonts } from '../../styles/tokens';

const SignupScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const handleSignup = () => {
    if (!email || !nickname || !password || !confirmPassword) {
      Alert.alert('입력 오류', '모든 항목을 입력해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('비밀번호 오류', '비밀번호가 일치하지 않습니다.');
      return;
    }
    Alert.alert('회원가입 완료', '회원가입이 완료되었습니다. 로그인해주세요.', [
      { text: '확인', onPress: () => navigation.navigate('Login') },
    ]);
  };

  const fields = [
    { label: '이메일', placeholder: 'example@inu.ac.kr', value: email, setter: setEmail, keyboardType: 'email-address' as const, secure: false },
    { label: '닉네임', placeholder: '닉네임 입력', value: nickname, setter: setNickname, keyboardType: 'default' as const, secure: false },
    { label: '비밀번호', placeholder: '6자 이상', value: password, setter: setPassword, keyboardType: 'default' as const, secure: true },
    { label: '비밀번호 확인', placeholder: '비밀번호 재입력', value: confirmPassword, setter: setConfirmPassword, keyboardType: 'default' as const, secure: true },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>회원가입</Text>
        <Text style={styles.subtitle}>인천대학교 학생 계정으로 가입하세요</Text>

        {fields.map((field) => (
          <View key={field.label} style={styles.inputWrap}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={styles.input}
              placeholder={field.placeholder}
              placeholderTextColor={colors.gray[400]}
              value={field.value}
              onChangeText={field.setter}
              autoCapitalize="none"
              keyboardType={field.keyboardType}
              secureTextEntry={field.secure}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleSignup} activeOpacity={0.8}>
          <Text style={styles.buttonText}>가입하기</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>
            이미 계정이 있으신가요? <Text style={styles.backLink}>로그인</Text>
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.extraBold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.gray[500],
    marginBottom: spacing.xl,
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
    marginBottom: spacing.md,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.bold,
  },
  backText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.gray[600],
  },
  backLink: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },
});

export default SignupScreen;
