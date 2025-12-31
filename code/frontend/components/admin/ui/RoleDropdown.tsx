import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useAppTheme } from '@/hooks/use-app-theme';
import { listRoles, type RoleDoc } from '@/api/admin/roles';

export default function RoleDropdown({
  value, onChange,
}: { value?: string; onChange:(id:string)=>void }) {
  const { theme } = useAppTheme();
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState<RoleDoc[]>([]);
  const [label, setLabel] = useState<string>('Chọn role');

  useEffect(() => { (async () => {
    const res = await listRoles({ page:1, limit:100 }) as any;
    setRoles(res.data || []);
  })(); }, []);

  useEffect(() => {
    const found = roles.find(r => r._id === value);
    setLabel(found ? found.title : 'Chọn role');
  }, [roles, value]);

  return (
    <>
      <Pressable onPress={()=>setOpen(true)} style={[theme.button.ghost.container, { justifyContent:'space-between', paddingVertical:12 }]}>
        <Text style={theme.button.ghost.label}>{label}</Text>
        <Text style={theme.button.ghost.label}>▾</Text>
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={()=>setOpen(false)}>
        <Pressable style={{ flex:1, backgroundColor:'#0006' }} onPress={()=>setOpen(false)}>
          <View style={{
            marginTop:'30%', marginHorizontal:16, borderRadius: theme.tokens.radius.lg,
            backgroundColor: theme.color.bgBase, padding: theme.tokens.space.md,
          }}>
            <Text style={theme.text.h3}>Chọn role</Text>
            <ScrollView style={{ maxHeight: 360, marginTop: theme.tokens.space.sm }}>
              {roles.map(r => (
                <Pressable key={r._id} onPress={()=>{ onChange(r._id!); setOpen(false); }}
                  style={{ paddingVertical:12, borderBottomWidth:1, borderBottomColor: theme.color.border }}>
                  <Text style={theme.text.body}>{r.title}</Text>
                  {!!r.description && <Text style={theme.text.meta}>{r.description}</Text>}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
