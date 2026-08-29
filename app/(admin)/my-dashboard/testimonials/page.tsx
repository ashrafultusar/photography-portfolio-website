import TestimonialManager from "@/components/admin/testimonials/TestimonialManager";
import { getAdminTestimonials } from "@/lib/data/testimonialData";

export default async function AdminTestimonialsPage() {
    const initialData = await getAdminTestimonials();
    return <TestimonialManager initialData={initialData} />;
}
