import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface TactileListItemProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
}

export const TactileListItem: React.FC<TactileListItemProps> = ({ title, subtitle, onPress }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.96, { stiffness: 400, damping: 30, mass: 1 });
    opacity.value = withSpring(0.6, { stiffness: 400, damping: 30 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { stiffness: 400, damping: 30, mass: 1 });
    opacity.value = withSpring(1, { stiffness: 400, damping: 30 });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.touchArea} // Ensure 44x44 minimum hit area
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        {/* Geometric Identity (o) */}
        <View style={styles.coverPrimitive}>
          <Text style={styles.coverText}>{title.substring(0, 1)}</Text>
        </View>

        {/* Vertical Identity (|) and Typography */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  touchArea: {
    minHeight: 64, // Greater than Apple's 44px min touch target
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginVertical: 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coverPrimitive: {
    width: 44, // 44px hit area footprint for the visual element
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6', // Gray-2
    borderWidth: 1,
    borderColor: '#E5E7EB', // Gray-3
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  content: {
    flex: 1,
    marginLeft: 16,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#000000', // The absolute '|' identity
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '900', // Black
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
});
