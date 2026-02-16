import React, { useState, useMemo } from 'react';
import { View as RNView, Text as RNText, TouchableOpacity, ScrollView, Alert, StyleSheet, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBookings } from '@/context/BookingContext';
import { styled } from 'nativewind';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { format, parseISO } from 'date-fns';
import { Booking } from '@/types/booking';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInUp, FadeOut, Layout } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VALARPIRAI_MUHURTHAM, THEIPIRAI_MUHURTHAM } from '@/constants/muhurtham';

const StyledView = styled(RNView);
const StyledText = styled(RNText);

const AccordionItem = ({ booking, index }: { booking: Booking, index: number }) => {
    const [expanded, setExpanded] = useState(false);
    const router = useRouter();

    const handleToggle = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setExpanded(!expanded);
    };

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 150).duration(800)}
            layout={Layout.springify()}
            className="mb-4 bg-white rounded-[35px] border border-[#C5D89D]/20 overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.02)]"
        >
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleToggle}
                className="p-6 flex-row justify-between items-center"
            >
                <StyledView className="flex-row items-center">
                    <StyledView className="w-12 h-12 bg-[#89986D] rounded-[18px] items-center justify-center mr-5">
                        <FontAwesome name={booking.eventType === 'Wedding' ? 'heart' : 'star'} size={18} color="#F6F0D7" />
                    </StyledView>
                    <StyledView>
                        <StyledText className="text-lg font-light text-[#2D3321]">{booking.name}</StyledText>
                        <StyledText className="text-[9px] font-black text-[#9CAB84] uppercase tracking-[3px] mt-1">{booking.eventType}</StyledText>
                    </StyledView>
                </StyledView>
                <FontAwesome name={expanded ? 'minus' : 'plus'} size={10} color="#C5D89D" />
            </TouchableOpacity>

            {expanded && (
                <Animated.View
                    entering={FadeInUp.duration(400)}
                    exiting={FadeOut.duration(200)}
                    className="px-6 pb-6 pt-2 border-t border-[#F6F0D7]"
                >
                    <StyledView className="mb-4">
                        <StyledText className="text-[9px] font-black text-[#9CAB84] uppercase tracking-[4px] mb-1">Contact Number</StyledText>
                        <StyledText className="text-md text-[#2D3321] font-medium">{booking.contactNumber}</StyledText>
                    </StyledView>
                    {booking.notes && (
                        <StyledView className="mb-6">
                            <StyledText className="text-[9px] font-black text-[#9CAB84] uppercase tracking-[4px] mb-1">Notes</StyledText>
                            <StyledText className="text-sm text-[#2D3321] font-light leading-5">{booking.notes}</StyledText>
                        </StyledView>
                    )}
                    <TouchableOpacity
                        onPress={() => {
                            Haptics.selectionAsync();
                            router.push({ pathname: '/booking/[id]', params: { id: booking.localId } });
                        }}
                        className="bg-[#F6F0D7] py-3 rounded-[15px] items-center border border-[#C5D89D]/30"
                    >
                        <StyledText className="text-[#89986D] font-black text-[9px] uppercase tracking-[4px]">View Details</StyledText>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </Animated.View>
    );
};

export default function DayDetailsScreen() {
    const { date } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { bookings } = useBookings();

    const selectedBookings = useMemo(() =>
        bookings.filter((b: Booking) => b.eventDate && b.eventDate.startsWith(date as string)),
        [bookings, date]
    );

    const isValarpirai = useMemo(() =>
        date && VALARPIRAI_MUHURTHAM.includes(date as string),
        [date]
    );

    const isTheipirai = useMemo(() =>
        date && THEIPIRAI_MUHURTHAM.includes(date as string),
        [date]
    );

    const handleAddPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (selectedBookings.length > 0) {
            Alert.alert(
                "Double Booking",
                `There is already a booking for this date. Add another one anyway?`,
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Yes", onPress: () => router.push({ pathname: '/booking/new', params: { date } }) }
                ]
            );
        } else {
            router.push({ pathname: '/booking/new', params: { date } });
        }
    };

    return (
        <RNView style={[styles.container, { backgroundColor: '#F6F0D7' }]}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
            <StyledView className="flex-1">
                {/* Minimal Header */}
                <Animated.View
                    entering={FadeInDown.duration(800)}
                    style={{ paddingTop: insets.top + 10 }}
                    className="px-10 pb-10 bg-white rounded-b-[50px] shadow-[0_15px_40px_rgba(0,0,0,0.03)] relative overflow-hidden"
                >
                    {/* Background Overlay */}
                    {(isValarpirai || isTheipirai) && (
                        <StyledView
                            className={`absolute inset-0 opacity-10 ${isValarpirai ? 'bg-[#F5C75D]' : 'bg-[#9DB2D8]'}`}
                        />
                    )}

                    <TouchableOpacity
                        onPress={() => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            router.back();
                        }}
                        style={{ top: insets.top + 10 }}
                        className="absolute left-8 z-50 h-10 w-10 items-center justify-center bg-[#F6F0D7] rounded-full"
                    >
                        <FontAwesome name="chevron-left" size={14} color="#89986D" />
                    </TouchableOpacity>

                    <StyledText className="text-center text-[10px] font-black tracking-[8px] uppercase text-[#9CAB84] mb-2">
                        Details for
                    </StyledText>
                    <StyledText className="text-center text-2xl font-extralight text-[#2D3321] tracking-tight">
                        {date ? format(parseISO(date as string), 'MMMM do, yyyy') : '...'}
                    </StyledText>

                    {(isValarpirai || isTheipirai) && (
                        <Animated.View
                            entering={FadeInUp.delay(300)}
                            className="flex-row justify-center mt-4"
                        >
                            <StyledView className={`${isValarpirai ? 'bg-[#F5C75D]/20 border-[#F5C75D]/40' : 'bg-[#9DB2D8]/20 border-[#9DB2D8]/40'} px-4 py-1.5 rounded-full border`}>
                                <StyledText className={`text-[9px] font-black ${isValarpirai ? 'text-[#8B6E2C]' : 'text-[#4A6FA5]'} uppercase tracking-[3px]`}>
                                    ✨ {isValarpirai ? 'Valarpirai' : 'Theipirai'} Muhurtham
                                </StyledText>
                            </StyledView>
                        </Animated.View>
                    )}
                </Animated.View>

                <ScrollView
                    className="flex-1 px-6 mt-8"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                >
                    {selectedBookings.length > 0 ? (
                        <>
                            <Animated.View entering={FadeInUp.delay(300)}>
                                <StyledText className="text-[9px] font-black text-[#9CAB84] uppercase tracking-[4px] mb-4 ml-2">
                                    Bookings for today
                                </StyledText>
                            </Animated.View>
                            {selectedBookings.map((b, idx) => (
                                <AccordionItem key={b.localId} booking={b} index={idx} />
                            ))}
                        </>
                    ) : (
                        <Animated.View
                            entering={FadeInUp.delay(400)}
                            className="items-center justify-center py-16 bg-white/40 rounded-[50px] border border-dashed border-[#C5D89D]/40"
                        >
                            <StyledView className="mb-4 opacity-30">
                                <FontAwesome name="calendar-check-o" size={40} color="#89986D" />
                            </StyledView>
                            <StyledText className="text-[#9CAB84] font-black tracking-[4px] uppercase text-center text-[10px]">
                                No Bookings Found
                            </StyledText>
                        </Animated.View>
                    )}

                    <Animated.View entering={FadeInUp.delay(800)}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={handleAddPress}
                            className="mt-8 bg-[#89986D] h-16 rounded-[30px] items-center justify-center shadow-[0_15px_30px_rgba(137,152,109,0.2)]"
                        >
                            <StyledView className="flex-row items-center">
                                <FontAwesome name="plus" size={14} color="#F6F0D7" />
                                <StyledText className="text-[#F6F0D7] font-black text-[10px] uppercase tracking-[6px] ml-3">
                                    New Booking
                                </StyledText>
                            </StyledView>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </StyledView>
        </RNView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
