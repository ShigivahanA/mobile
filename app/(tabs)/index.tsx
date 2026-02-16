import React, { useState, useMemo } from 'react';
import { View as RNView, Text as RNText, StyleSheet, Platform, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { useBookings } from '@/context/BookingContext';
import { styled } from 'nativewind';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VALARPIRAI_MUHURTHAM, THEIPIRAI_MUHURTHAM, ALL_MUHURTHAM_DATES } from '@/constants/muhurtham';

const StyledView = styled(RNView);
const StyledText = styled(RNText);

const PremiumHeader = () => {
  const insets = useSafeAreaInsets();
  return (
    <Animated.View
      entering={FadeInDown.duration(1000).springify()}
      style={{ paddingTop: insets.top + 15 }}
      className="px-10 pb-8 bg-white rounded-b-[60px] shadow-[0_20px_50px_rgba(137,152,109,0.08)] z-50"
    >
      <StyledView className="items-center">
        <Animated.View entering={FadeInUp.delay(200)} className="mb-2">
          <StyledText className="text-[10px] font-black tracking-[10px] uppercase text-[#9CAB84]">
            Book Now
          </StyledText>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400)}>
          <StyledText className="text-center text-4xl font-extralight text-[#2D3321] tracking-tighter">
            Sri Iyyappan
          </StyledText>
          <StyledText className="text-center text-[10px] font-bold text-[#89986D] uppercase tracking-[6px] mt-1">
            Thirumana Mandapam
          </StyledText>
        </Animated.View>
      </StyledView>
    </Animated.View>
  );
};

export default function CalendarScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { bookings } = useBookings();
  const today = new Date().toISOString().split('T')[0];
  const [selected, setSelected] = useState(today);

  const markedDates = useMemo(() => {
    const marks: any = {};

    // Mark Valarpirai Muhurtham dates (Growth/Golden)
    VALARPIRAI_MUHURTHAM.forEach(dateStr => {
      marks[dateStr] = {
        selected: true,
        selectedColor: '#F5C75D', // Valarpirai Golden color
        selectedTextColor: '#2D3321',
      };
    });

    // Mark Theipirai Muhurtham dates (Waning/Soft Blue)
    THEIPIRAI_MUHURTHAM.forEach(dateStr => {
      marks[dateStr] = {
        selected: true,
        selectedColor: '#9DB2D8', // Theipirai Soft Blue color
        selectedTextColor: '#2D3321',
      };
    });

    // Mark booked dates with a solid soft green background
    bookings.forEach(booking => {
      const dateStr = booking.eventDate.split('T')[0];
      const isValarpirai = VALARPIRAI_MUHURTHAM.includes(dateStr);
      const isTheipirai = THEIPIRAI_MUHURTHAM.includes(dateStr);

      marks[dateStr] = {
        selected: true,
        selectedColor: '#C5D89D', // Different color for booked dates
        selectedTextColor: '#2D3321',
        marked: isValarpirai || isTheipirai, // Show dot if it's a Muhurtham date that is booked
        dotColor: isValarpirai ? '#E6B325' : '#4A6FA5',
      };
    });

    // Mark today or selected date with the primary brand color
    // This should override others as it's the user's focus
    marks[selected] = {
      ...marks[selected], // Preserve booked status or muhurtham dot if selected
      selected: true,
      selectedColor: '#89986D',
      selectedTextColor: '#F6F0D7',
      disableTouchEvent: false,
    };

    return marks;
  }, [bookings, selected]);

  const handleDayPress = (day: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelected(day.dateString);
    router.push({ pathname: '/date/[date]', params: { date: day.dateString } });
  };

  return (
    <RNView style={[styles.container, { backgroundColor: '#F6F0D7' }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />

      <PremiumHeader />

      <StyledView style={{ paddingBottom: insets.bottom + 60 }} className="flex-1 justify-center">
        <Animated.View
          entering={FadeInUp.delay(800).duration(1000)}
          className="px-8"
        >
          {/* Calendar Glow Overlay */}
          <StyledView className="relative">
            {useMemo(() => {
              const isVal = VALARPIRAI_MUHURTHAM.includes(selected);
              const isThei = THEIPIRAI_MUHURTHAM.includes(selected);
              if (!isVal && !isThei) return null;
              return (
                <Animated.View
                  entering={FadeInDown}
                  className={`absolute -inset-10 blur-3xl opacity-20 rounded-full ${isVal ? 'bg-[#F5C75D]' : 'bg-[#9DB2D8]'}`}
                />
              );
            }, [selected])}

            <StyledView className="bg-white rounded-[50px] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.03)] border border-[#C5D89D]/20">
              <Calendar
                current={selected}
                minDate={today} // Block past dates
                onDayPress={handleDayPress}
                markedDates={markedDates}
                showSixWeeks={true}
                hideExtraDays={true}
                firstDay={1} // Start week on Monday
                theme={{
                  calendarBackground: 'transparent',
                  textSectionTitleColor: '#9CAB84',
                  selectedDayBackgroundColor: '#89986D',
                  selectedDayTextColor: '#F6F0D7',
                  todayTextColor: '#89986D',
                  dayTextColor: '#2D3321',
                  textDisabledColor: '#E1E8D1',
                  dotColor: '#89986D',
                  monthTextColor: '#2D3321',
                  textDayFontSize: 15,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 10,
                  textMonthFontWeight: '300',
                  textDayFontWeight: '400',
                  'stylesheet.calendar.header': {
                    monthText: {
                      fontSize: 22,
                      fontWeight: '200',
                      color: '#2D3321',
                      margin: 5,
                      letterSpacing: -1
                    },
                    dayHeader: {
                      marginTop: 5,
                      marginBottom: 5,
                      width: 30,
                      textAlign: 'center',
                      fontSize: 9,
                      fontWeight: '700',
                      color: '#9CAB84',
                      textTransform: 'uppercase',
                      letterSpacing: 2
                    }
                  }
                } as any}
              />

              <StyledView className="mt-8 pt-6 border-t border-[#F6F0D7]/30 gap-y-4">
                <StyledView className="flex-row justify-center gap-x-10">
                  <StyledView className="flex-row items-center w-[100px]">
                    <StyledView className="w-2 h-2 rounded-full bg-[#C5D89D] mr-3" />
                    <StyledText className="text-[8px] font-black text-[#9CAB84] uppercase tracking-[2px]">Occupied</StyledText>
                  </StyledView>
                  <StyledView className="flex-row items-center w-[100px]">
                    <StyledView className="w-2 h-2 rounded-full bg-white border border-[#C5D89D] mr-3" />
                    <StyledText className="text-[8px] font-black text-[#9CAB84] uppercase tracking-[2px]">Vacant</StyledText>
                  </StyledView>
                </StyledView>

                <StyledView className="flex-row justify-center gap-x-10">
                  <StyledView className="flex-row items-center w-[100px]">
                    <StyledView className="w-2 h-2 rounded-full bg-[#F5C75D] mr-3" />
                    <StyledText className="text-[8px] font-black text-[#9CAB84] uppercase tracking-[2px]">Valarpirai</StyledText>
                  </StyledView>
                  <StyledView className="flex-row items-center w-[100px]">
                    <StyledView className="w-2 h-2 rounded-full bg-[#9DB2D8] mr-3" />
                    <StyledText className="text-[8px] font-black text-[#9CAB84] uppercase tracking-[2px]">Theipirai</StyledText>
                  </StyledView>
                </StyledView>
              </StyledView>
            </StyledView>
          </StyledView>
        </Animated.View>
      </StyledView>
    </RNView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
