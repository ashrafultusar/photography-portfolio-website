import AdminsManager from "@/components/admin/admins/AdminsManager";
import { getAllAdmins } from "@/lib/data/adminsData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminsPage() {
    const admins = await getAllAdmins();
    return <AdminsManager admins={admins} />;
}
