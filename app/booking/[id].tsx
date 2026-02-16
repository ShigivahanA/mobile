import React, { useEffect, useState } from 'react';
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

export default function BookingDetailScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams();
    const { bookings, editBooking, removeBooking } = useBookings();

    const booking = bookings.find(b => b.localId === id);

    const [name, setName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [eventType, setEventType] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (booking) {
            setName(booking.name);
            setContactNumber(booking.contactNumber);
            setEventType(booking.eventType);
            setNotes(booking.notes || '');
        }
    }, [booking]);

    const isValarpirai = booking ? VALARPIRAI_MUHURTHAM.includes(booking.eventDate.split('T')[0]) : false;
    const isTheipirai = booking ? THEIPIRAI_MUHURTHAM.includes(booking.eventDate.split('T')[0]) : false;

    if (!booking) return null;

    const handleUpdate = async () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const muhurthamType = isValarpirai ? 'Valarpirai' : (isTheipirai ? 'Theipirai' : null);
        await editBooking(id as string, { name, contactNumber, eventType, notes, muhurthamType });
        router.back();
    };

    const handleDelete = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert('Delete Booking', 'Are you sure you want to delete this booking permanently?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: async () => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                    await removeBooking(id as string);
                    router.back();
                }
            }
        ]);
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

                        <StyledView
                            style={{ top: insets.top + 10 }}
                            className="absolute right-8 z-50 px-4 py-1.5 rounded-full border border-[#C5D89D] bg-[#F6F0D7]/50"
                        >
                            <StyledText className="text-[8px] font-black text-[#89986D] uppercase tracking-[2px]">
                                {booking.isSynced ? 'Synced' : 'Local'}
                            </StyledText>
                        </StyledView>

                        <StyledText className="text-center text-[10px] font-black tracking-[8px] uppercase text-[#9CAB84] mb-2">
                            Booking Info
                        </StyledText>
                        <StyledText className="text-center text-3xl font-extralight text-[#2D3321] tracking-tight">
                            Edit Details
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
                                    {format(parseISO(booking.eventDate), 'MMMM do, yyyy')}
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

                            <StyledView className="mb-8">
                                <StyledText className="text-[9px] font-black text-[#9CAB84] uppercase tracking-[4px] mb-3">Notes</StyledText>
                                <TextInput
                                    className="text-lg font-light text-[#2D3321] py-3 border-b border-[#F6F0D7]"
                                    value={notes}
                                    onChangeText={setNotes}
                                    multiline
                                    placeholder="Add extra notes..."
                                    placeholderTextColor="#C5D89D"
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

                        <StyledView className="flex-row gap-4 mt-8">
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={handleDelete}
                                className="flex-1 bg-white h-16 rounded-[30px] border border-rose-100 items-center justify-center shadow-sm"
                            >
                                <StyledText className="text-rose-400 font-black tracking-[4px] uppercase text-[9px]">Delete</StyledText>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={handleUpdate}
                                className="bg-[#2D3321] h-16 rounded-[30px] items-center justify-center shadow-[0_15px_30px_rgba(0,0,0,0.15)]"
                                style={{ flex: 1.5 }}
                            >
                                <StyledText className="text-white font-black tracking-[6px] uppercase text-[9px]">Save Changes</StyledText>
                            </TouchableOpacity>
                        </StyledView>
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
