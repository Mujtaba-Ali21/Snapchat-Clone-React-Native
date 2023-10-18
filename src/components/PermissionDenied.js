import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PermissionDenied = ({ onRetryPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        Camera Permission Penied. Please enable camera access in settings.
      </Text>
      <TouchableOpacity onPress={onRetryPress} style={styles.button}>
        <Text style={styles.buttonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default PermissionDenied;
