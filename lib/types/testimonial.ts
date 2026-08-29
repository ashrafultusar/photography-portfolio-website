export interface TestimonialItem {
    _id?: string;
    name: string;
    role: string;
    image: string;
    rating: number;
    comment: string;
    order?: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
