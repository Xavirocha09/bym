import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '@/components/common/GlassCard';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Colors } from '@/constants/colors';
import { fontSize, fontWeight, spacing, radius } from '@/constants/theme';
import { useScanStore } from '@/store/useScanStore';

const MAX_IMAGES = 6;

export default function UploadScreen() {
  const { scanType, uploadedImages, addImage, removeImage } = useScanStore();

  async function handlePickImage() {
    if (uploadedImages.length >= MAX_IMAGES) {
      Alert.alert('Maximum reached', `You can upload up to ${MAX_IMAGES} screenshots.`);
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library to upload screenshots.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: MAX_IMAGES - uploadedImages.length,
      quality: 0.85,
    });

    if (!result.canceled) {
      result.assets.forEach((asset) => addImage(asset.uri));
    }
  }

  function handleRemove(index: number) {
    removeImage(index);
  }

  const canContinue = uploadedImages.length > 0;

  const uploadLabel =
    scanType === 'profile'
      ? 'Profile screenshots'
      : scanType === 'chat'
      ? 'Chat screenshots'
      : 'Profile & chat screenshots';

  return (
    <LinearGradient colors={[Colors.bg.secondary, Colors.bg.primary]} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Nav */}
        <View style={styles.nav}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Upload Screenshots</Text>
          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>1 of 3</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.delay(0).duration(400)}>
            <Text style={styles.headline}>Add your{'\n'}{uploadLabel}</Text>
            <Text style={styles.sub}>
              Crop out personal information like phone numbers whenever possible.
            </Text>
          </Animated.View>

          {/* Privacy note */}
          <Animated.View entering={FadeInDown.delay(80).duration(400)}>
            <GlassCard padding={14}>
              <View style={styles.privacyRow}>
                <View style={styles.privacyIcon}>
                  <Ionicons name="lock-closed" size={16} color={Colors.teal.primary} />
                </View>
                <Text style={styles.privacyText}>
                  Screenshots are analyzed privately on your device. They are never stored or uploaded externally.
                </Text>
              </View>
            </GlassCard>
          </Animated.View>

          {/* Upload zone */}
          <Animated.View entering={FadeInDown.delay(160).duration(400)}>
            <TouchableOpacity
              style={styles.uploadZone}
              onPress={handlePickImage}
              activeOpacity={0.8}
            >
              <GlassCard padding={32} borderColor={`${Colors.teal.primary}35`}>
                <View style={styles.uploadContent}>
                  <View style={styles.uploadIconWrap}>
                    <Ionicons name="cloud-upload-outline" size={32} color={Colors.teal.primary} />
                  </View>
                  <Text style={styles.uploadTitle}>Add screenshots</Text>
                  <Text style={styles.uploadSub}>
                    Tap to choose from your photo library
                  </Text>
                  <View style={styles.uploadCount}>
                    <Text style={styles.uploadCountText}>
                      {uploadedImages.length}/{MAX_IMAGES} added
                    </Text>
                  </View>
                </View>
              </GlassCard>
            </TouchableOpacity>
          </Animated.View>

          {/* Image Grid */}
          {uploadedImages.length > 0 && (
            <Animated.View entering={FadeIn.duration(300)} style={styles.grid}>
              {uploadedImages.map((uri, index) => (
                <View key={`${uri}-${index}`} style={styles.imageWrap}>
                  <Image source={{ uri }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => handleRemove(index)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="close-circle" size={22} color={Colors.danger} />
                  </TouchableOpacity>
                </View>
              ))}
              {uploadedImages.length < MAX_IMAGES && (
                <TouchableOpacity style={styles.addMore} onPress={handlePickImage} activeOpacity={0.8}>
                  <Ionicons name="add" size={28} color={Colors.text.muted} />
                </TouchableOpacity>
              )}
            </Animated.View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton
            label="Continue to Questions"
            onPress={() => router.push('/scan/context')}
            disabled={!canContinue}
            style={styles.cta}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  navTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: Colors.text.secondary,
    letterSpacing: -0.2,
  },
  stepBadge: {
    backgroundColor: Colors.teal.muted,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: `${Colors.teal.primary}30`,
  },
  stepText: {
    fontSize: fontSize.xs,
    color: Colors.teal.primary,
    fontWeight: fontWeight.semibold,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  headline: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.heavy,
    color: Colors.text.primary,
    letterSpacing: -1,
    lineHeight: 40,
    marginBottom: spacing.xs,
  },
  sub: {
    fontSize: fontSize.base,
    color: Colors.text.muted,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  privacyIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: Colors.teal.muted,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  privacyText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: Colors.text.muted,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  uploadZone: {},
  uploadContent: { alignItems: 'center', gap: spacing.sm },
  uploadIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Colors.teal.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  uploadTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: Colors.text.primary,
    letterSpacing: -0.5,
  },
  uploadSub: {
    fontSize: fontSize.sm,
    color: Colors.text.muted,
    letterSpacing: -0.1,
  },
  uploadCount: {
    backgroundColor: Colors.card.elevated,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginTop: spacing.xs,
  },
  uploadCountText: {
    fontSize: fontSize.xs,
    color: Colors.text.muted,
    fontWeight: fontWeight.medium,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  imageWrap: {
    width: '30%',
    aspectRatio: 9 / 16,
    borderRadius: radius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  addMore: {
    width: '30%',
    aspectRatio: 9 / 16,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.card.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card.bg,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.lg,
  },
  cta: { width: '100%' },
});
