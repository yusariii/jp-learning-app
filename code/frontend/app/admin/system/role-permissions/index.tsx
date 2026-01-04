import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useRouter, Href } from 'expo-router';
import LayoutDefault from '@/layout-default/layout-default';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';

import RoleDropdown from '@/components/admin/ui/RoleDropdown';
import Checkbox from '@/components/admin/ui/CheckBox';

import {
  getRolePermissions,
  updateRolePermissions,
  type PermissionMatrix,
  type Action,
  type FeatureKey,
} from '@/api/admin/role-permissions';

/** ===== Cấu hình hiển thị bảng (nhóm & nhãn) ===== */
const UI_GROUPS: Array<{ title: string; features: Array<{ key: FeatureKey; label: string }> }> = [
  {
    title: 'Nội dung học',
    features: [
      { key: 'word', label: 'Từ vựng' },
      { key: 'grammar', label: 'Ngữ pháp' },
      { key: 'reading', label: 'Đọc hiểu' },
      { key: 'listening', label: 'Nghe hiểu' },
      { key: 'lesson', label: 'Bài học' },
      { key: 'test', label: 'Đề thi' },
    ],
  },
  {
    title: 'Hệ thống',
    features: [
      { key: 'admin', label: 'Quản trị viên' },
      { key: 'role', label: 'Vai trò' },
    ],
  },
];

const ACTIONS: Array<{ key: Action; label: string }> = [
  { key: 'view', label: 'Xem' },
  { key: 'create', label: 'Thêm mới' },
  { key: 'update', label: 'Chỉnh sửa' },
  { key: 'delete', label: 'Xóa' },
];

/** Clone sâu để tránh dùng chung reference (nguyên nhân “matrix dính nhau”) */
const deepClone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

export default function RolePermissionsScreen() {
  const { theme } = useAppTheme();
  const { role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (role?.title !== 'SuperAdmin') {
      router.replace('/admin/unauthorized' as Href);
    }
  }, [role, router]);

  const [roleId, setRoleId] = useState<string | undefined>(undefined);
  const [matrix, setMatrix] = useState<PermissionMatrix | null>(null);
  const [loading, setLoading] = useState(false);

  /** Cache matrix theo role để chuyển qua lại mượt */
  const cacheRef = useRef<Record<string, PermissionMatrix>>({});

  /** Chống race-condition khi chọn role liên tiếp (response cũ về sau) */
  const reqSeq = useRef(0);

  /** Tải quyền khi đổi role */
  useEffect(() => {
    if (!roleId) {
      setMatrix(null);
      return;
    }

    setLoading(true);
    setMatrix(null); // reset UI trong lúc tải

    const mySeq = ++reqSeq.current;

    (async () => {
      // Ưu tiên cache
      const cached = cacheRef.current[roleId];
      if (cached) {
        setMatrix(deepClone(cached));
        setLoading(false);
        return;
      }

      const res = await getRolePermissions(roleId);
      if (reqSeq.current !== mySeq) return; // response cũ -> bỏ

      const fresh = deepClone((res?.permissions || {}) as PermissionMatrix);
      cacheRef.current[roleId] = fresh; // ghi cache
      setMatrix(deepClone(fresh));
      setLoading(false);
    })();
  }, [roleId]);

  /** Toggle 1 action của 1 feature (immutable + đồng bộ cache) */
  const toggle = (feature: FeatureKey, action: Action, value: boolean) => {
    if (!roleId) return;
    setMatrix(prev => {
      const next: PermissionMatrix = deepClone((prev || {}) as PermissionMatrix);
      next[feature] = { ...(next[feature] || {}), [action]: value };
      cacheRef.current[roleId] = deepClone(next);
      return next;
    });
  };

  /** Check “chọn tất cả” cho 1 feature */
  const allForFeatureChecked = (feature: FeatureKey) =>
    ACTIONS.every(a => !!matrix?.[feature]?.[a.key]);

  /** Toggle “chọn tất cả” cho 1 feature */
  const toggleAllInFeature = (feature: FeatureKey, value: boolean) => {
    if (!roleId) return;
    setMatrix(prev => {
      const next: PermissionMatrix = deepClone((prev || {}) as PermissionMatrix);
      next[feature] = { view: value, create: value, update: value, delete: value };
      cacheRef.current[roleId] = deepClone(next);
      return next;
    });
  };

  /** Lưu matrix hiện tại */
  const save = async () => {
    if (!roleId || !matrix) return;
    await updateRolePermissions(roleId, matrix);
    cacheRef.current[roleId] = deepClone(matrix); // xác nhận lại cache
    Alert.alert('Thành công', 'Đã cập nhật phân quyền.');
  };

  const header = useMemo(
    () => (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.tokens.space.md,
        }}
      >
        <Text style={theme.text.h1}>Phân quyền</Text>
        <TouchableOpacity
          onPress={save}
          disabled={!roleId}
          style={[theme.button.primary.container, { opacity: roleId ? 1 : 0.5 }]}
        >
          <Text style={theme.button.primary.label}>Cập nhật</Text>
        </TouchableOpacity>
      </View>
    ),
    [theme.mode, roleId, matrix]
  );

  return (
    <LayoutDefault title="Phân quyền theo role">
      <ScrollView contentContainerStyle={{ padding: theme.tokens.space.md }}>
        {header}

        <Text style={theme.text.h3}>Chọn vai trò</Text>
        <View style={{ height: theme.tokens.space.xs }} />
        <RoleDropdown value={roleId} onChange={setRoleId} />

        {!roleId ? (
          <Text style={[theme.text.secondary, { marginTop: theme.tokens.space.lg }]}>
            Hãy chọn một role để cấu hình phân quyền.
          </Text>
        ) : loading ? (
          <View style={{ paddingVertical: theme.tokens.space.lg }}>
            <ActivityIndicator color={theme.color.textSub} />
          </View>
        ) : (
          <View
            style={{
              marginTop: theme.tokens.space.lg,
              borderWidth: 1,
              borderColor: theme.color.border,
              borderRadius: theme.tokens.radius.lg,
              overflow: 'hidden',
            }}
          >
            {/* Header hàng cột */}
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: theme.color.bgSubtle,
                paddingVertical: 12,
                paddingHorizontal: 16,
              }}
            >
              <Text style={[theme.text.h3, { flex: 2 }]}>Tính năng</Text>
              <Text style={[theme.text.h3, { flex: 2 }]}>Hành động</Text>
              <Text style={[theme.text.h3, { width: 120, textAlign: 'center' }]} />
            </View>

            {UI_GROUPS.map((group, gi) => (
              <View key={group.title}>
                {/* Nhãn nhóm */}
                <View
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    backgroundColor: theme.color.bgSubtle,
                    borderTopWidth: gi === 0 ? 0 : 1,
                    borderTopColor: theme.color.border,
                  }}
                >
                  <Text style={[theme.text.title]}>{group.title}</Text>
                </View>

                {group.features.map(f => (
                  <View key={f.key} style={{ borderTopWidth: 1, borderTopColor: theme.color.border }}>
                    {/* Hàng tổng hợp “Chọn tất cả” cho feature */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
                      <Text style={[theme.text.h3, { flex: 2 }]}>{f.label}</Text>
                      <Text style={[theme.text.body, { flex: 2 }]}>Chọn tất cả</Text>
                      <View style={{ width: 120, alignItems: 'center' }}>
                        <Checkbox
                          checked={allForFeatureChecked(f.key)}
                          onChange={v => toggleAllInFeature(f.key, v)}
                        />
                      </View>
                    </View>

                    {/* Các hành động con */}
                    {ACTIONS.map(a => (
                      <View
                        key={`${f.key}-${a.key}`}
                        style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}
                      >
                        <Text style={{ flex: 2 }} />
                        <Text style={[theme.text.body, { flex: 2 }]}>{a.label}</Text>
                        <View style={{ width: 120, alignItems: 'center' }}>
                          <Checkbox
                            checked={!!matrix?.[f.key]?.[a.key]}
                            onChange={v => toggle(f.key, a.key, v)}
                          />
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </LayoutDefault>
  );
}
