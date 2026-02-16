import React, { useState } from 'react';
import { View as RNView, Text as RNText, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, StyleSheet, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBookings } from '@/context/BookingContext';
import { styled } from 'nativewind';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { format, parseISO } from 'date-fns';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VALARPIRAI_MUHURTHAM, THEIPIRAI_MUHURTHAM } from '@/constants/muhurtham';

const StyledView = styled(RNView);
const StyledText = styled(RNText);

export default function NewBookingScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { date } = useLocalSearchParams();
    const { addBooking } = useBookings();

    const [name, setName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [eventType, setEventType] = useState('Wedding');
    const [notes, setNotes] = useState('');
    const [eventDate] = useState((typeof date === 'string' ? date : '') || new Date().toISOString().split('T')[0]);

    const isValarpirai = VALARPIRAI_MUHURTHAM.includes(eventDate);
    const isTheipirai = THEIPIRAI_MUHURTHAM.includes(eventDate);

    const handleSave = async () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (!name || !contactNumber) {
            Alert.alert('Error', 'Name and Contact are required.');
            return;
        }

        try {
            const muhurthamType = isValarpirai ? 'Valarpirai' : (isTheipirai ? 'Theipirai' : null);
            await addBooking({ name, contactNumber, eventDate, eventType, notes, muhurthamType });
            router.replace('/(tabs)');
        } catch (e) {
            Alert.alert('Error', 'Could not save booking.');
        }
    };

    const handlePress = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    return (
        <RNView style={[styles.container, { backgroundColor: '#F6F0D7' }]}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 60 }}
                >
                    <Animated.View
                        entering={FadeInDown.duration(800)}
                        style={{ paddingTop: insets.top + 10 }}
                        className="px-10 pb-10 bg-white rounded-b-[50px] shadow-[0_15px_40px_rgba(0,0,0,0.03)] relative"
                    >
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.selectionAsync();
                                router.back();
                            }}
                            style={{ top: insets.top + 10 }}
                            className="absolute left-8 z-50 h-10 w-10 items-center justify-center bg-[#F6F0D7] rounded-full"
                        >
                            <FontAwesome name="chevron-left" size={14} color="#89986D" />
                        </TouchableOpacity>

                        <StyledText className="text-center text-[10px] font-black tracking-[8px] uppercase text-[#9CAB84] mb-2">
                            New Booking
                        </StyledText>
                        <StyledText className="text-center text-3xl font-extralight text-[#2D3321] tracking-tight">
                            Add Record
                        </StyledText>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInUp.delay(300).duration(1000)}
                        className="px-6 mt-8"
                    >
                        <StyledView className="bg-white p-8 rounded-[40px] border border-[#C5D89D]/20 shadow-[0_20px_40px_rgba(0,0,0,0.02)]">
                            <StyledView className="mb-8 pb-6 border-b border-[#F6F0D7]">
                                <StyledView className="flex-row justify-between items-end mb-2">
                                    <StyledText className="text-[9px] font-black text-[#9CAB84] uppercase tracking-[4px]">Event Date</StyledText>
                                    {(isValarpirai || isTheipirai) && (
                                        <StyledView className={`${isValarpirai ? 'bg-[#F5C75D]/20 border-[#F5C75D]/40' : 'bg-[#9DB2D8]/20 border-[#9DB2D8]/40'} px-3 py-1 rounded-full border`}>
                                            <StyledText className={`text-[7px] font-black ${isValarpirai ? 'text-[#8B6E2C]' : 'text-[#4A6FA5]'} uppercase tracking-[1px]`}>
                                                {isValarpirai ? 'Valarpirai' : 'Theipirai'}
                                            </StyledText>
                                        </StyledView>
                                    )}
                                </StyledView>
                                <StyledText className="text-2xl font-light text-[#2D3321]">
                                    {format(parseISO(eventDate), 'MMMM do')}
                                    <StyledText className="text-lg text-[#9CAB84]">, {format(parseISO(eventDate), 'yyyy')}</StyledText>
                                </StyledText>
                            </StyledView>

                            <StyledView className="mb-8">
                                <StyledText className="text-[9px] font-black text-[#9CAB84] uppercase tracking-[4px] mb-3">Customer Name</StyledText>
                                <TextInput
                                    className="text-xl font-light text-[#2D3321] py-3 border-b border-[#F6F0D7]"
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Full Name"
                                    placeholderTextColor="#C5D89D"
                                />
                            </StyledView>

                            <StyledView className="mb-8">
                                <StyledText className="text-[9px] font-black text-[#9CAB84] uppercase tracking-[4px] mb-3">Phone Number</StyledText>
                                <TextInput
                                    className="text-xl font-light text-[#2D3321] py-3 border-b border-[#F6F0D7]"
                                    value={contactNumber}
                                    onChangeText={setContactNumber}
                                    placeholder="+91 00000 00000"
                                    placeholderTextColor="#C5D89D"
                                    keyboardType="phone-pad"
                                />
                            </StyledView>

                            <StyledView>
                                <StyledText className="text-[9px] font-black text-[#9CAB84] uppercase tracking-[4px] mb-5">Event Type</StyledText>
                                <StyledView className="flex-row flex-wrap gap-2">
                                    {['Wedding', 'Reception', 'Other'].map(type => (
                                        <TouchableOpacity
                                            key={type}
                                            onPress={() => {
                                                handlePress();
                                                setEventType(type);
                                            }}
                                            className={`px-6 py-3 rounded-[18px] border ${eventType === type
                                                ? 'bg-[#89986D] border-[#89986D]'
                                                : 'bg-[#F6F0D7]/30 border-[#C5D89D]/30'
                                                }`}
                                        >
                                            <StyledText className={`font-bold text-[9px] uppercase tracking-[1px] ${eventType === type ? 'text-[#F6F0D7]' : 'text-[#9CAB84]'
                                                }`}>
                                                {type}
                                            </StyledText>
                                        </TouchableOpacity>
                                    ))}
                                </StyledView>
                            </StyledView>
                        </StyledView>

                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={handleSave}
                            className="mt-8 bg-[#2D3321] h-16 rounded-[30px] items-center justify-center shadow-[0_15px_30px_rgba(0,0,0,0.15)]"
                        >
                            <StyledText className="text-[#F6F0D7] font-black text-[10px] uppercase tracking-[6px]">
                                Save Booking
                            </StyledText>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </RNView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
