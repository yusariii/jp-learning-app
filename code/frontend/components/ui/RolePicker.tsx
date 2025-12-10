import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAppTheme } from "@/hooks/use-app-theme";
import Chip from "./Chip";
import { listRoles, type RoleItem } from "@/api/admin/admins";

export default function RolePicker({
  value, onChange, inline = true,
}: {
  value?: string;                             // roleId hiện tại
  onChange: (roleId: string) => void;
  inline?: boolean;                           // true: hiển thị dạng chips
}) {
  const { theme } = useAppTheme();
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try { const data = await listRoles(); if (alive) setRoles(data); }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) return <ActivityIndicator color={theme.color.textSub} />;

  if (inline) {
    return (
      <View style={{ flexDirection: "row", gap: theme.tokens.space.xs, flexWrap: "wrap" }}>
        {roles.map(r => (
          <Chip key={r._id} label={r.title} active={value === r._id} onPress={() => onChange(r._id)} />
        ))}
      </View>
    );
  }

  return (
    <View style={{ gap: theme.tokens.space.xs }}>
      {roles.map(r => (
        <TouchableOpacity
          key={r._id}
          onPress={() => onChange(r._id)}
          style={[
            theme.button.ghost.container,
            value === r._id && { borderColor: theme.color.primary, borderWidth: 2 },
          ]}
        >
          <Text style={theme.button.ghost.label}>{r.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
