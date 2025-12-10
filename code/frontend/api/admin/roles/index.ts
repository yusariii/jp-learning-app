import qs from "qs";
import { get, post, put, del } from "@/helpers/http";

export type RoleDoc = {
  _id?: string;
  title: string;
  description?: string;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export async function listRoles(params: { page?: number; limit?: number; q?: string } = {}) {
  const query = qs.stringify(params, { addQueryPrefix: true, skipNulls: true });
  return get<{ data: RoleDoc[]; page: number; limit: number; total: number }>(`roles${query}`);
}
export const getRole    = (id: string) => get<RoleDoc>(`roles/${encodeURIComponent(id)}`);
export const createRole = (payload: RoleDoc) => post<RoleDoc>("roles", payload);
export const updateRole = (id: string, payload: Partial<RoleDoc>) =>
  put<RoleDoc>(`roles/${encodeURIComponent(id)}`, payload);
export const deleteRole = (id: string) => del<{ ok: true }>(`roles/${encodeURIComponent(id)}`);
