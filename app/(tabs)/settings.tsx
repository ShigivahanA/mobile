import React from 'react';
import { View as RNView, Text as RNText, TouchableOpacity, ScrollView, StyleSheet, Alert, StatusBar } from 'react-native';
import { useBookings } from '@/context/BookingContext';
import { styled } from 'nativewind';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const StyledView = styled(RNView);
const StyledText = styled(RNText);

export default function SettingsScreen() {
    const { syncData, bookings } = useBookings();
    const insets = useSafeAreaInsets();

    const handleSync = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        try {
            await syncData();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert("Success", "Data has been synced to the cloud.");
        } catch (e) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert("Error", "Cloud sync failed.");
        }
    };

    return (
        <RNView style={[styles.container, { backgroundColor: '#F6F0D7' }]}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
                <Animated.View
                    entering={FadeInDown.duration(800)}
                    style={{ paddingTop: insets.top + 10 }}
                    className="px-10 pb-10 bg-white rounded-b-[50px] shadow-[0_15px_40px_rgba(0,0,0,0.03)]"
                >
                    <StyledText className="text-center text-[10px] font-black tracking-[8px] uppercase text-[#9CAB84] mb-2">
                        Control Panel
                    </StyledText>
                    <StyledText className="text-center text-4xl font-extralight text-[#2D3321] tracking-tight">
                        Settings
                    </StyledText>
                </Animated.View>

                <Animated.View
                    entering={FadeInUp.delay(300).duration(1000)}
                    className="px-6 mt-8"
                >
                    <StyledView className="bg-white p-8 rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.02)] border border-[#C5D89D]/20">
                        <StyledView className="flex-row justify-between items-center mb-8">
                            <StyledView>
                                <StyledText className="text-[#9CAB84] text-[9px] font-black uppercase tracking-[4px] mb-1">Total Bookings</StyledText>
                                <StyledText className="text-[#2D3321] text-4xl font-extralight">{bookings.length}</StyledText>
                            </StyledView>
                            <TouchableOpacity
                                onPress={handleSync}
                                activeOpacity={0.9}
                                className="bg-[#2D3321] w-14 h-14 rounded-[20px] items-center justify-center shadow-lg"
                            >
                                <FontAwesome name="refresh" size={16} color="#F6F0D7" />
                            </TouchableOpacity>
                        </StyledView>

                        <StyledView className="h-[1px] bg-[#F6F0D7] mb-6" />

                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={handleSync}
                            className="flex-row justify-between items-center py-4"
                        >
                            <StyledView className="flex-row items-center">
                                <StyledView className="w-10 h-10 bg-[#F6F0D7] rounded-[15px] items-center justify-center mr-5">
                                    <FontAwesome name="cloud-upload" size={14} color="#89986D" />
                                </StyledView>
                                <StyledView>
                                    <StyledText className="text-md font-light text-[#2D3321]">Cloud Backup</StyledText>
                                    <StyledText className="text-[8px] text-[#9CAB84] uppercase font-bold tracking-widest mt-0.5">Sync local records</StyledText>
                                </StyledView>
                            </StyledView>
                            <FontAwesome name="chevron-right" size={10} color="#C5D89D" />
                        </TouchableOpacity>
                    </StyledView>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(800)} className="mt-16">
                    <StyledText className="text-center text-[#9CAB84] font-black text-[9px] uppercase tracking-[4px] opacity-40">
                        Sri Iyyappan Portal ∙ v1.0.0
                    </StyledText>
                    <StyledText className="text-center text-[#9CAB84] font-bold text-[7px] uppercase tracking-[2px] opacity-20 mt-2">
                        Built for Excellence
                    </StyledText>
                </Animated.View>
            </ScrollView>
        </RNView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
