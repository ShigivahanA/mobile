import React, { useMemo, useState } from 'react';
import { View as RNView, Text as RNText, FlatList, TouchableOpacity, TextInput, useWindowDimensions, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useBookings } from '@/context/BookingContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { styled } from 'nativewind';
import { format, parseISO } from 'date-fns';
import { Booking } from '@/types/booking';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const StyledView = styled(RNView);
const StyledText = styled(RNText);

const PremiumCard = ({ item, index, isWide, onPress }: { item: Booking, index: number, isWide: boolean, onPress: () => void }) => {
    return (
        <Animated.View
            entering={FadeInDown.delay(index * 100).duration(800)}
            layout={Layout.springify()}
            style={{ flex: isWide ? 0.5 : 1, marginBottom: 16 }}
        >
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onPress}
                className="bg-white p-6 rounded-[35px] border border-[#C5D89D]/20 shadow-[0_10px_30px_rgba(137,152,109,0.03)] flex-row items-center"
            >
                <StyledView className="w-12 h-12 rounded-[18px] bg-[#F6F0D7] items-center justify-center mr-5">
                    <FontAwesome
                        name={item.eventType === 'Wedding' ? 'heart' : 'star'}
                        size={18}
                        color="#89986D"
                    />
                </StyledView>

                <StyledView className="flex-1">
                    <StyledText className="text-[8px] font-black text-[#9CAB84] uppercase tracking-[2px] mb-1">
                        {format(parseISO(item.eventDate), 'MMMM yyyy')}
                    </StyledText>
                    <StyledText className="text-xl font-light text-[#2D3321]" numberOfLines={1}>
                        {item.name}
                    </StyledText>
                </StyledView>

                <StyledView className="items-end">
                    {!item.isSynced ? (
                        <StyledView className="bg-amber-100/40 px-2 py-0.5 rounded-full border border-amber-200/40">
                            <StyledText className="text-[7px] font-black text-amber-600 uppercase tracking-widest">Local</StyledText>
                        </StyledView>
                    ) : (
                        <StyledView className="w-6 h-6 rounded-full bg-[#89986D]/10 items-center justify-center">
                            <FontAwesome name="check" size={10} color="#89986D" />
                        </StyledView>
                    )}
                </StyledView>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default function BookingsListScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const { bookings } = useBookings();
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const isWide = width > 768;
    const filters = ['All', 'Wedding', 'Reception', 'Other'];

    const filteredBookings = useMemo(() => {
        return [...bookings]
            .filter(b => {
                const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
                    b.eventType.toLowerCase().includes(search.toLowerCase());
                const matchesFilter = activeFilter === 'All' || b.eventType === activeFilter;
                return matchesSearch && matchesFilter;
            })
            .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
    }, [bookings, search, activeFilter]);

    const handlePress = (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ pathname: '/booking/[id]', params: { id } });
    };

    return (
        <RNView style={[styles.container, { backgroundColor: '#F6F0D7' }]}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
            <StyledView className="flex-1">
                {/* Permanent Premium Header */}
                <Animated.View
                    entering={FadeInUp.duration(800).springify()}
                    style={{ paddingTop: insets.top + 10 }}
                    className="bg-white rounded-b-[50px] shadow-[0_20px_40px_rgba(0,0,0,0.03)] z-50"
                >
                    <StyledView className="px-8 pb-8">
                        {/* Title Bar - Simplified */}
                        <StyledView className="items-center mb-6">
                            <StyledText className="text-center text-[10px] font-black tracking-[6px] uppercase text-[#9CAB84] mb-1">
                                History
                            </StyledText>
                            <StyledText className="text-center text-3xl font-extralight text-[#2D3321] tracking-tight">
                                All Records
                            </StyledText>
                        </StyledView>

                        {/* Permanent Search Bar */}
                        <StyledView className="flex-row items-center bg-[#F6F0D7]/50 px-5 h-14 rounded-[18px] border border-[#C5D89D]/30 mb-5">
                            <FontAwesome name="search" size={12} color="#9CAB84" />
                            <TextInput
                                placeholder="Search records..."
                                placeholderTextColor="#9CAB84"
                                className="flex-1 ml-3 text-[#2D3321] font-medium text-[13px]"
                                value={search}
                                onChangeText={setSearch}
                            />
                        </StyledView>

                        {/* Filter Strip */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            {filters.map((filter) => (
                                <TouchableOpacity
                                    key={filter}
                                    onPress={() => {
                                        Haptics.selectionAsync();
                                        setActiveFilter(filter);
                                    }}
                                    className={`mr-3 px-6 py-2.5 rounded-[15px] border ${activeFilter === filter
                                            ? 'bg-[#89986D] border-[#89986D]'
                                            : 'bg-white border-[#C5D89D]/30'
                                        }`}
                                >
                                    <StyledText className={`text-[9px] font-black uppercase tracking-[1px] ${activeFilter === filter ? 'text-[#F6F0D7]' : 'text-[#9CAB84]'
                                        }`}>
                                        {filter}
                                    </StyledText>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </StyledView>
                </Animated.View>

                {/* Content List */}
                <FlatList
                    data={filteredBookings}
                    numColumns={isWide ? 2 : 1}
                    keyExtractor={item => item.localId}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 30, paddingBottom: 150 }}
                    columnWrapperStyle={isWide ? { gap: 16 } : null}
                    renderItem={({ item, index }) => (
                        <PremiumCard
                            item={item}
                            index={index}
                            isWide={isWide}
                            onPress={() => handlePress(item.localId)}
                        />
                    )}
                    ListEmptyComponent={
                        <Animated.View entering={FadeInUp.delay(500)} className="mt-20 items-center justify-center px-10">
                            <StyledView className="w-16 h-16 bg-white rounded-full items-center justify-center mb-6 shadow-sm border border-[#F6F0D7]">
                                <FontAwesome name="folder-open-o" size={24} color="#C5D89D" />
                            </StyledView>
                            <StyledText className="text-[#9CAB84] font-black tracking-[4px] uppercase opacity-40 text-[9px] text-center">
                                {search || activeFilter !== 'All' ? 'Criteria Mismatch' : 'Archive Vacant'}
                            </StyledText>
                        </Animated.View>
                    }
                />
            </StyledView>
        </RNView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
