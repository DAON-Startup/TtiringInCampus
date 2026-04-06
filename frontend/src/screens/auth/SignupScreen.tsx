import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors, spacing, typography } from '../../styles/tokens';

const SignupScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const handleSignup = () => {
    if (password !== confirmPassword) {
      Alert.alert('비밀번호 오류', '비밀번호가 일치하지 않습니다.');
      return;
    }
    // Implement actual signup logic here
    Alert.alert('회원가입 완료', '회원가입이 완료되었습니다. 로그인해주세요.', [
      { text: '확인', onPress: () => navigation.navigate('Login') }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="닉네임"
        value={nickname}
        onChangeText={setNickname}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>가입하기</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>뒤로 가기</Text>
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
  backText: {
    textAlign: 'center',
    marginTop: spacing.lg,
    color: colors.gray[600],
  },
});

export default SignupScreen;
