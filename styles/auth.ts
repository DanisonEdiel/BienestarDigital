import { StyleSheet } from 'react-native';

export const signInStyles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { paddingVertical: 28, paddingHorizontal: 8, alignItems: 'flex-start', marginBottom: 16 },
  brand: { textAlign: 'left', fontSize: 24, fontWeight: '700' },
  subtitle: { textAlign: 'left', marginTop: 6, opacity: 0.9 },
  card: { borderRadius: 20, padding: 16 },
  input: { marginBottom: 12 },
  button: { marginTop: 12, borderRadius: 12 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  remember: { marginLeft: 4 },
  forgot: { marginRight: 4 },
  signInWith: { textAlign: 'center', marginTop: 24, marginBottom: 8 },
  socialBtn: { alignSelf: 'center', borderRadius: 12, width: 260 },
});