export interface Address {
    street_address1: string;
    street_address2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
}

export interface Money {
    amount: number;
    currency: string;
}

export interface Dimensions {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'inch';
}

export interface ApiResponse<T> {
    status: 'success' | 'error';
    data?: T;
    message?: string;
    error?: {
        code: string;
        details?: any;
    };
}

export type ValidationError = {
    field: string;
    message: string;
}