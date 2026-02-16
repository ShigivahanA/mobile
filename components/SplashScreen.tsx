import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import { styled } from 'nativewind';
import * as Haptics from 'expo-haptics';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        // Haptic start
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                damping: 20,
                stiffness: 80,
                useNativeDriver: true,
            }),
        ]).start();

        const timer = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }).start(() => onFinish());
        }, 3500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <StyledView className="flex-1 bg-[#F6F0D7] items-center justify-center">
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], alignItems: 'center' }}>
                <StyledText className="text-4xl font-extralight text-[#2D3321] text-center tracking-tighter">
                    Sri Iyyappan
                </StyledText>
                <StyledText className="text-[12px] font-bold text-[#89986D] uppercase tracking-[6px] mt-2 text-center">
                    Thirumana Mandapam
                </StyledText>
                <StyledView className="w-16 h-[1px] bg-[#9CAB84]/30 mt-12" />
            </Animated.View>
        </StyledView>
    );
}
