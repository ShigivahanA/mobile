import axios from 'axios';
import { Platform } from 'react-native';
import { Booking, NewBookingPayload } from '@/types/booking';
import Constants from 'expo-constants';

// For physical devices, we need the LAN IP.
// "192.168.1.46" is the automatically detected IP of your machine.
const LOCAL_IP = "192.168.1.46";
// On Android Emulator, localhost is 10.0.2.2.
// But using the LAN IP works for both physical device and emulator IF firewall allows.

// Dynamic check:
const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
const host = debuggerHost?.split(':')[0]; // This is usually the LAN IP (e.g. 192.168.1.46)

// Priority: 
// 1. Host detected by Expo (most reliable for dev)
// 2. Hardcoded detected IP (fallback)
// 3. Localhost (last resort)
const BASE_URL = host && host !== 'localhost' && host !== '127.0.0.1'
    ? `http://${host}:5000`
    : `http://${LOCAL_IP}:5000`;

console.log('API Base URL:', BASE_URL);

const api = axios.create({
    baseURL: `${BASE_URL}/bookings`,
    timeout: 15000, // Increased timeout 
});

export const fetchRemoteBookings = async (): Promise<Booking[]> => {
    try {
        const response = await api.get('/');
        return response.data;
    } catch (error) {
        console.error("Fetch Error:", error);
        throw error;
    }
};

export const createRemoteBooking = async (booking: NewBookingPayload): Promise<Booking> => {
    const response = await api.post('/', booking);
    return response.data;
};

export const updateRemoteBooking = async (id: string, updates: Partial<Booking>): Promise<Booking> => {
    const response = await api.put(`/${id}`, updates);
    return response.data;
};

export const deleteRemoteBooking = async (id: string): Promise<void> => {
    await api.delete(`/${id}`);
};
