import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

interface EntityBottomSheetProps {
  entityName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EntityBottomSheet: React.FC<EntityBottomSheetProps> = ({ 
  entityName, 
  isOpen, 
  onClose 
}) => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1} // Start at 50%
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetView style={styles.contentContainer}>
        {/* Bento Grid layout mapped for mobile (edge-to-edge cards) */}
        <View style={styles.bentoCardPrimary}>
          <Text style={styles.tag}>ENTITY METADATA</Text>
          <Text style={styles.title} numberOfLines={2}>{entityName}</Text>
        </View>

        <View style={styles.bentoCardSecondary}>
          <Text style={styles.detailText}>
            This sheet replaces traditional desktop modals. It allows thumb-driven interactions,
            seamless vertical panning, and strictly adheres to Liiist's flat monochromatic UI.
          </Text>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24, // Subtle rounding for iOS standards
    // NO SHADOWS per Liiist Bible
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  handle: {
    backgroundColor: '#D1D5DB', // Gray-4
    width: 40,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  bentoCardPrimary: {
    backgroundColor: '#000000',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    minHeight: 160,
    justifyContent: 'flex-end',
  },
  tag: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  bentoCardSecondary: {
    backgroundColor: '#F9FAFB', // Gray-1
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB', // Gray-3
  },
  detailText: {
    color: '#4B5563', // Gray-7
    fontSize: 15,
    lineHeight: 22,
  },
});
