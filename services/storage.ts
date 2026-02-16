import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking } from '@/types/booking';

const STORAGE_KEY = '@bookings';
const THEME_KEY = '@theme';

export const getLocalBookings = async (): Promise<Booking[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Failed to load bookings', e);
        return [];
    }
};

export const saveLocalBookings = async (bookings: Booking[]) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
        console.error('Failed to save bookings', e);
    }
};

export const clearLocalBookings = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error(e);
    }
}
