import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, View } from 'react-native';

// Mascot emotions/states
export type MascotMood = 
  | 'sad'        // Buồn - khi không có task
  | 'angry'      // Giận - error
  | 'surprised'  // Ngạc nhiên - achievement
  | 'thinking'   // Suy nghĩ - empty courses
  | 'bored'      // Chán - loading/waiting
  | 'pointing'   // Chỉ tay - hướng dẫn
  | 'wink'       // Nháy mắt - tips
  | 'hehe'       // Cười khúc khích - greeting
  | 'willing'    // Sẵn sàng - confident
  | 'happy';     // Vui - completed task

// Mascot images mapping
const mascotImages: Record<MascotMood, any> = {
  sad: require('@/assets/images/mascot/sad.png'),
  angry: require('@/assets/images/mascot/angry.png'),
  surprised: require('@/assets/images/mascot/surprised.png'),
  thinking: require('@/assets/images/mascot/thinking.png'),
  bored: require('@/assets/images/mascot/bored.png'),
  pointing: require('@/assets/images/mascot/pointing.png'),
  wink: require('@/assets/images/mascot/wink.png'),
  hehe: require('@/assets/images/mascot/hehe.png'),
  willing: require('@/assets/images/mascot/willing.png'),
  happy: require('@/assets/images/mascot/happy.png'),
};

interface MascotProps {
  mood: MascotMood;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  style?: StyleProp<ImageStyle>;
}

export function Mascot({ mood, size = 'medium', style }: MascotProps) {
  const sizeStyle = sizes[size];
  
  return (
    <View style={styles.container}>
      <Image 
        source={mascotImages[mood]} 
        style={[sizeStyle, style]}
        resizeMode="contain"
      />
    </View>
  );
}

const sizes = StyleSheet.create({
  small: {
    width: 80,
    height: 80,
  },
  medium: {
    width: 140,
    height: 140,
  },
  large: {
    width: 200,
    height: 200,
  },
  xlarge: {
    width: 280,
    height: 280,
  },
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Mascot;
