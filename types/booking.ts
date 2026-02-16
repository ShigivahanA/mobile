export interface Booking {
    _id?: string;
    name: string;
    eventDate: string; // ISO Date String
    contactNumber: string;
    eventType: string; // 'Wedding', 'Reception', etc.
    notes?: string;
    muhurthamType?: 'Valarpirai' | 'Theipirai' | null;
    createdAt: string;

    // Local sync state
    localId: string; // Unique ID for local tracking
    isSynced: boolean;
    syncError?: string;
    deleted?: boolean;
}

export type NewBookingPayload = Omit<Booking, '_id' | 'createdAt' | 'isSynced' | 'syncError' | 'localId'>;
