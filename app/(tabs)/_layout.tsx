import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { styled } from 'nativewind';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

const StyledView = styled(View);

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  focused: boolean;
}) {
  return (
    <StyledView className="items-center justify-center pt-2">
      <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />
      {props.focused && (
        <Animated.View
          className="w-1.5 h-1.5 rounded-full bg-[#89986D] mt-2"
          style={{ shadowColor: '#89986D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 }}
        />
      )}
    </StyledView>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#89986D',
        tabBarInactiveTintColor: '#C5D89D',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 95 : 75,
          paddingBottom: Platform.OS === 'ios' ? 35 : 15,
          paddingTop: 10,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          shadowColor: '#2D3321',
          shadowOffset: { width: 0, height: -20 },
          shadowOpacity: 0.04,
          shadowRadius: 40,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontFamily: 'System',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: 2,
          marginTop: 6,
        },
      }}
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Book Now',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="calendar-o" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Archive',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="archive" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Control',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="sliders" color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
