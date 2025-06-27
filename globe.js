import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default function GlobeAnimation() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('./assets/globe.json')}
        autoPlay
        loop
        style={{ width: '130%', height: '130%' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});
