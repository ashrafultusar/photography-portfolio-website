import AdminsManager from "@/components/admin/admins/AdminsManager";
import { getAllAdmins } from "@/lib/data/adminsData";

export default async function AdminsPage() {
    const admins = await getAllAdmins();
    return <AdminsManager admins={admins} />;
}
