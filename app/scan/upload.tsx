import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '@/components/common/GlassCard';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Colors } from '@/constants/colors';
import { spacing } from '@/constants/theme';
import { useScanStore } from '@/store/useScanStore';

const MAX_IMAGES = 6;

export default function UploadScreen() {
  const { uploadedImages, contextNote, addImage, removeImage, setContextNote } = useScanStore();
  const insets = useSafeAreaInsets();

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
      mediaTypes: 'images',
      allowsMultipleSelection: false,
      quality: 0.4,
    });
    if (!result.canceled) {
      result.assets.forEach((asset) => addImage(asset.uri));
    }
  }

  return (
    <LinearGradient colors={[Colors.bg.secondary, Colors.bg.primary]} style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Nav */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: insets.top + spacing.md, paddingBottom: spacing.md }}>
          <TouchableOpacity
            style={{ width: 40, height: 40, borderRadius: 20, borderCurve: 'continuous', backgroundColor: Colors.card.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.card.border }}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <SymbolView name="xmark" size={16} tintColor={Colors.text.secondary} weight="semibold" />
          </TouchableOpacity>
          <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.text.secondary, letterSpacing: -0.2 }}>Safety Scan</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.sm, gap: spacing.md }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInDown.delay(0).duration(400)}>
            <Text style={{ fontSize: 34, fontWeight: '800', color: Colors.text.primary, letterSpacing: -1, lineHeight: 40, marginBottom: spacing.xs }}>
              Add your{'\n'}screenshots
            </Text>
            <Text style={{ fontSize: 15, color: Colors.text.muted, lineHeight: 22, letterSpacing: -0.2 }}>
              Upload whatever you have — profile photos, bio, or chat screenshots.
            </Text>
          </Animated.View>

          {/* Privacy note */}
          <Animated.View entering={FadeInDown.delay(80).duration(400)}>
            <GlassCard padding={14}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <View style={{ width: 32, height: 32, borderRadius: 8, borderCurve: 'continuous', backgroundColor: Colors.teal.muted, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <SymbolView name="lock.fill" size={15} tintColor={Colors.teal.primary} />
                </View>
                <Text style={{ flex: 1, fontSize: 13, color: Colors.text.muted, lineHeight: 18, letterSpacing: -0.1 }}>
                  Screenshots are analyzed privately. They are never stored or uploaded externally.
                </Text>
              </View>
            </GlassCard>
          </Animated.View>

          {/* Upload zone */}
          <Animated.View entering={FadeInDown.delay(160).duration(400)}>
            <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8}>
              <GlassCard padding={32} borderColor={`${Colors.teal.primary}35`}>
                <View style={{ alignItems: 'center', gap: spacing.sm }}>
                  <View style={{ width: 72, height: 72, borderRadius: 22, borderCurve: 'continuous', backgroundColor: Colors.teal.muted, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm }}>
                    <SymbolView name="photo.badge.plus" size={32} tintColor={Colors.teal.primary} />
                  </View>
                  <Text style={{ fontSize: 20, fontWeight: '600', color: Colors.text.primary, letterSpacing: -0.5 }}>Add screenshots</Text>
                  <Text style={{ fontSize: 13, color: Colors.text.muted, letterSpacing: -0.1 }}>Tap to choose from your photo library</Text>
                  <View style={{ backgroundColor: Colors.card.elevated, paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: 999, marginTop: spacing.xs }}>
                    <Text style={{ fontSize: 11, color: Colors.text.muted, fontWeight: '500' }}>
                      {uploadedImages.length}/{MAX_IMAGES} added
                    </Text>
                  </View>
                </View>
              </GlassCard>
            </TouchableOpacity>
          </Animated.View>

          {/* Image Grid */}
          {uploadedImages.length > 0 && (
            <Animated.View entering={FadeIn.duration(300)} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {uploadedImages.map((uri, index) => (
                <View key={`${uri}-${index}`} style={{ width: '30%', aspectRatio: 9 / 16, borderRadius: 16, borderCurve: 'continuous', overflow: 'hidden', position: 'relative' }}>
                  <Image source={{ uri }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                  <TouchableOpacity
                    style={{ position: 'absolute', top: 6, right: 6 }}
                    onPress={() => removeImage(index)}
                    activeOpacity={0.8}
                  >
                    <SymbolView name="xmark.circle.fill" size={22} tintColor={Colors.danger} />
                  </TouchableOpacity>
                </View>
              ))}
              {uploadedImages.length < MAX_IMAGES && (
                <TouchableOpacity
                  style={{ width: '30%', aspectRatio: 9 / 16, borderRadius: 16, borderCurve: 'continuous', borderWidth: 1.5, borderColor: Colors.card.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.card.bg }}
                  onPress={handlePickImage}
                  activeOpacity={0.8}
                >
                  <SymbolView name="plus" size={28} tintColor={Colors.text.muted} weight="semibold" />
                </TouchableOpacity>
              )}
            </Animated.View>
          )}

          {/* Optional context note */}
          <Animated.View entering={FadeInDown.delay(240).duration(400)}>
            <GlassCard padding={14}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.text.secondary, letterSpacing: -0.2, marginBottom: spacing.sm }}>
                Anything else you've noticed? <Text style={{ color: Colors.text.disabled, fontWeight: '400' }}>Optional</Text>
              </Text>
              <TextInput
                value={contextNote}
                onChangeText={setContextNote}
                placeholder="e.g. refused video calls, asked to move off the app…"
                placeholderTextColor={Colors.text.disabled}
                multiline
                style={{
                  fontSize: 14,
                  color: Colors.text.primary,
                  lineHeight: 20,
                  letterSpacing: -0.1,
                  minHeight: 60,
                  textAlignVertical: 'top',
                }}
              />
            </GlassCard>
          </Animated.View>

          <View style={{ height: 20 }} />
        </ScrollView>

        <View style={{ padding: spacing.lg, paddingBottom: insets.bottom + spacing.md }}>
          <PrimaryButton
            label="Run Safety Analysis"
            onPress={() => router.push('/scan/analyzing')}
            disabled={uploadedImages.length === 0}
          />
        </View>
      </View>
    </LinearGradient>
  );
}
