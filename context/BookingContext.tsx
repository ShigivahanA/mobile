import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Booking, NewBookingPayload } from '../types/booking';
import { getLocalBookings, saveLocalBookings } from '../services/storage';
import { createRemoteBooking, fetchRemoteBookings, updateRemoteBooking, deleteRemoteBooking } from '../services/api';
import NetInfo from '@react-native-community/netinfo';
import { Alert, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

interface BookingContextType {
    bookings: Booking[];
    loading: boolean;
    addBooking: (booking: NewBookingPayload) => Promise<void>;
    editBooking: (id: string, updates: Partial<Booking>) => Promise<void>;
    removeBooking: (id: string) => Promise<void>;
    syncData: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    // Load data initially
    useEffect(() => {
        const loadInitData = async () => {
            const local = await getLocalBookings();
            setBookings(local);
            setLoading(false);

            // Try initial sync if online
            const state = await NetInfo.fetch();
            if (state.isConnected) {
                syncData();
            }
        };
        loadInitData();
    }, []);

    const syncData = useCallback(async () => {
        const state = await NetInfo.fetch();
        if (!state.isConnected) return;

        try {
            // 1. Fetch remote data
            const remote = await fetchRemoteBookings();

            // 2. Simple merge strategy
            // Remote is source of truth for items with _id
            // Local is source of truth for items without _id (unsynced)
            setBookings(prev => {
                const unsynced = prev.filter(b => !b.isSynced && !b.deleted);
                const deletedOffline = prev.filter(b => b.deleted && b._id);

                // Process offline deletions
                deletedOffline.forEach(async (b) => {
                    try { await deleteRemoteBooking(b._id!); } catch (e) { }
                });

                // Process offline creations
                unsynced.forEach(async (b) => {
                    try {
                        const synced = await createRemoteBooking({
                            name: b.name,
                            eventDate: b.eventDate,
                            contactNumber: b.contactNumber,
                            eventType: b.eventType,
                            notes: b.notes,
                            muhurthamType: b.muhurthamType
                        });
                        // Update local state later or just rely on next fetch
                    } catch (e) { }
                });

                // Combine remote with local unsynced
                const merged = [...remote.map(r => ({ ...r, isSynced: true, localId: r._id! })), ...unsynced];
                saveLocalBookings(merged);
                return merged;
            });

            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            console.error("Sync Error:", error);
        }
    }, [bookings]);

    const addBooking = async (payload: NewBookingPayload) => {
        const localId = Date.now().toString();
        const newBooking: Booking = {
            ...payload,
            localId,
            isSynced: false,
            createdAt: new Date().toISOString()
        };

        const updated = [newBooking, ...bookings];
        setBookings(updated);
        await saveLocalBookings(updated);

        // Try immediate sync
        const state = await NetInfo.fetch();
        if (state.isConnected) {
            try {
                const synced = await createRemoteBooking(payload);
                const final = updated.map(b => b.localId === localId ? { ...synced, isSynced: true, localId: synced._id! } : b);
                setBookings(final);
                await saveLocalBookings(final);
                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            } catch (e) {
                console.error("Immediate sync failed", e);
            }
        }
    };

    const editBooking = async (id: string, updates: Partial<Booking>) => {
        const updated = bookings.map(b => b.localId === id ? { ...b, ...updates, isSynced: false } : b);
        setBookings(updated);
        await saveLocalBookings(updated);

        const booking = updated.find(b => b.localId === id);
        const state = await NetInfo.fetch();
        if (state.isConnected && booking?._id) {
            try {
                const synced = await updateRemoteBooking(booking._id, updates);
                const final = updated.map(b => b.localId === id ? { ...synced, isSynced: true, localId: synced._id! } : b);
                setBookings(final);
                await saveLocalBookings(final);
            } catch (e) { }
        }
    };

    const removeBooking = async (id: string) => {
        const booking = bookings.find(b => b.localId === id);
        if (!booking) return;

        // If not synced, just remove locally
        if (!booking._id) {
            const filtered = bookings.filter(b => b.localId !== id);
            setBookings(filtered);
            await saveLocalBookings(filtered);
            return;
        }

        // If synced, mark as deleted and try remote removal
        const updated = bookings.map(b => b.localId === id ? { ...b, deleted: true } : b);
        setBookings(updated.filter(b => !b.deleted)); // Hide from UI immediately
        await saveLocalBookings(updated);

        const state = await NetInfo.fetch();
        if (state.isConnected) {
            try {
                await deleteRemoteBooking(booking._id);
                const final = updated.filter(b => b.localId !== id);
                setBookings(final);
                await saveLocalBookings(final);
            } catch (e) {
                console.error("Delete sync failed", e);
            }
        }
    };

    return (
        <BookingContext.Provider value={{ bookings: bookings.filter(b => !b.deleted), loading, addBooking, editBooking, removeBooking, syncData }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBookings = () => {
    const context = useContext(BookingContext);
    if (!context) throw new Error('useBookings must be used within a BookingProvider');
    return context;
};
