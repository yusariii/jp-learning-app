import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/hooks/use-app-theme';
import LabeledInput from '../ui/LabeledInput';
import ContentCard from '../card/ContentCard';
import ReadingGroupEditor from './ReadingGroupEditor'; // đã có: passage -> questions

export type ReadingPassage = {
  _id?: string;
  title?: string;
  passageJP: string;
  passageEN?: string;
  questions: any[];
};

export type ReadingUnit = {
  _id?: string;
  title?: string;
  instructionsJP?: string;
  instructionsEN?: string;
  passages: ReadingPassage[];
};

export default function ReadingUnitEditor({
  value, onChange, title = 'Danh sách BÀI (Reading)',
}: {
  value: ReadingUnit[];
  onChange: (next: ReadingUnit[]) => void;
  title?: string;
}) {
  const { theme } = useAppTheme();

  const addUnit = () => onChange([...value, { title:'', instructionsJP:'', instructionsEN:'', passages: [] }]);
  const setUnit = (i:number, patch: Partial<ReadingUnit>) => { const a=[...value]; a[i]={...a[i],...patch}; onChange(a); };
  const delUnit = (i:number) => onChange(value.filter((_,idx)=>idx!==i));
  const moveUnit = (from:number,to:number) => { if(to<0||to>=value.length) return; const a=[...value]; const [x]=a.splice(from,1); a.splice(to,0,x); onChange(a); };

  return (
    <View style={{ gap: theme.tokens.space.md }}>
      <Text style={theme.text.h3}>{title}</Text>

      {!value.length && <Text style={theme.text.secondary}>Chưa có BÀI đọc hiểu. Nhấn “＋ Thêm bài”.</Text>}

      {value.map((u,i)=>(
        <ContentCard key={i}>
          <View style={{ flexDirection:'row', alignItems:'center', gap: theme.tokens.space.xs, justifyContent:'space-between' }}>
            <Text style={theme.text.h3}>Bài #{i+1}{u.title ? ` — ${u.title}` : ''}</Text>
            <View style={{ flexDirection:'row', gap: theme.tokens.space.xs }}>
              <TouchableOpacity onPress={()=>moveUnit(i,i-1)} style={theme.button.ghost.container}><Text style={theme.button.ghost.label}>↑</Text></TouchableOpacity>
              <TouchableOpacity onPress={()=>moveUnit(i,i+1)} style={theme.button.ghost.container}><Text style={theme.button.ghost.label}>↓</Text></TouchableOpacity>
              <TouchableOpacity onPress={()=>delUnit(i)} style={[theme.button.ghost.container,{ borderColor: theme.color.danger, borderWidth:1 }]}><Text style={[theme.button.ghost.label,{ color: theme.color.danger }]}>Xoá bài</Text></TouchableOpacity>
            </View>
          </View>

          <View style={{ height: theme.tokens.space.sm }} />

          <LabeledInput label="Tiêu đề bài (tuỳ chọn)" value={u.title||''} onChangeText={(t)=>setUnit(i,{title:t})}/>
          <View style={{ height: theme.tokens.space.xs }} />
          <LabeledInput label="Đề bài (JP)" value={u.instructionsJP||''} onChangeText={(t)=>setUnit(i,{instructionsJP:t})} multiline/>
          <View style={{ height: theme.tokens.space.xs }} />
          <LabeledInput label="Đề bài (EN) (tuỳ chọn)" value={u.instructionsEN||''} onChangeText={(t)=>setUnit(i,{instructionsEN:t})} multiline/>

          <View style={{ height: theme.tokens.space.sm }} />
          {/* Passages (đoạn văn) */}
          <ReadingGroupEditor
            title="Đoạn văn thuộc BÀI"
            value={u.passages as any}
            onChange={(groups)=>setUnit(i,{ passages: groups })}
          />
        </ContentCard>
      ))}

      <TouchableOpacity onPress={addUnit} style={{ ...theme.button.primary.container, alignSelf:'flex-start', paddingHorizontal: theme.tokens.space.md }}>
        <Text style={theme.button.primary.label}>＋ Thêm bài</Text>
      </TouchableOpacity>
    </View>
  );
}
