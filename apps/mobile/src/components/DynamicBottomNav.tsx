import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  SharedValue 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

// Simulated icons for the example
const SearchIcon = () => <View style={styles.iconPlaceholder} />;
const HomeIcon = () => <View style={styles.iconPlaceholder} />;
const ProfileIcon = () => <View style={styles.iconPlaceholder} />;

interface DynamicBottomNavProps {
  scrollY: SharedValue<number>;
  scrollVelocityY: SharedValue<number>;
}

export const DynamicBottomNav: React.FC<DynamicBottomNavProps> = ({ scrollY, scrollVelocityY }) => {
  // Hide nav when scrolling down fast, show when scrolling up
  const navStyle = useAnimatedStyle(() => {
    const isScrollingDown = scrollVelocityY.value > 10;
    const isAtTop = scrollY.value < 50;
    
    // Determine translation Y (hide by moving down 100px)
    const translateY = (isScrollingDown && !isAtTop) ? 100 : 0;

    return {
      transform: [
        { 
          translateY: withSpring(translateY, {
            stiffness: 400,
            damping: 30,
            mass: 1,
          }) 
        }
      ],
    };
  });

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <Animated.View style={[styles.container, navStyle]}>
      <View style={styles.navBar}>
        <Pressable 
          onPress={handlePress} 
          style={({ pressed }) => [
            styles.navItem, 
            pressed && styles.navItemPressed
          ]}
        >
          <HomeIcon />
        </Pressable>
        
        <Pressable 
          onPress={handlePress} 
          style={({ pressed }) => [
            styles.navItem,
            styles.navItemPrimary,
            pressed && styles.navItemPressed
          ]}
        >
          <SearchIcon />
        </Pressable>

        <Pressable 
          onPress={handlePress} 
          style={({ pressed }) => [
            styles.navItem, 
            pressed && styles.navItemPressed
          ]}
        >
          <ProfileIcon />
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 34, // iOS Safe Area inset
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.95)', // Flat opaque background (No blur per Bible)
    borderRadius: 9999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navItem: {
    minWidth: 44, // Minimum iOS touch target
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemPrimary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    width: 48,
    height: 48,
  },
  navItemPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    backgroundColor: '#52525B', // Gray-5
    borderRadius: 12,
  }
});
