import qs from "qs";
import { get, post, put, del } from "@/helpers/http";

export type RoleItem = { _id: string; title: string; description?: string };
export type AdminDoc = {
  _id?: string;
  email: string;
  fullName?: string;
  password?: string;   
  roleId: string | RoleItem;
  createdAt?: string; updatedAt?: string;
};

export async function listAdmins(params: { page?: number; limit?: number; q?: string }) {
  const query = qs.stringify(params, { addQueryPrefix: true, skipNulls: true });
  return get<{ data: AdminDoc[]; page: number; limit: number; total: number }>(`admins${query}`);
}
export const getAdmin   = (id: string) => get<AdminDoc>(`admins/${encodeURIComponent(id)}`);
export const createAdmin= (payload: AdminDoc) => post<AdminDoc>("admins", payload);
export const updateAdmin= (id: string, payload: Partial<AdminDoc>) => put<AdminDoc>(`admins/${encodeURIComponent(id)}`, payload);
export const deleteAdmin= (id: string) => del<{ ok: true }>(`admins/${encodeURIComponent(id)}`);
export const listRoles  = () => get<RoleItem[]>("admins/roles");
