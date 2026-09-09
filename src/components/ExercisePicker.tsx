import React, {useState} from 'react';
import {KeyboardAvoidingView, Modal, Platform, View, Text, ScrollView, Pressable} from 'react-native';
import {exercises} from '../lib/model';
import {Button, Field, C, s} from './ui';

export function ExercisePicker({value, onChange, allowAll = false}: {
  value: string;
  onChange: (id: string) => void;
  allowAll?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const name = exercises.find(e => e.id === value)?.name || (allowAll ? 'Todos los ejercicios' : 'Elegir ejercicio');
  const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const options = exercises.filter(e => normalize(e.name + ' ' + e.group).includes(normalize(search)));
  const select = (id: string) => { onChange(id); setOpen(false); };

  return <>
    <Button title={name + '  ▾'} secondary onPress={() => { setSearch(''); setOpen(true); }}/>
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1, backgroundColor: '#000B', justifyContent: 'center', padding: 20}}
      >
        <View style={[s.card, {width: '100%', maxWidth: 520, height: '85%', maxHeight: 680, alignSelf: 'center'}]}>
          {/* Only the results may shrink or scroll; preserve the full search field. */}
          <View style={{flexShrink: 0, gap: 18}}>
            <View style={s.between}>
              <Text style={s.h2}>Elige un ejercicio</Text>
              <Button small title="Cerrar" secondary onPress={() => setOpen(false)}/>
            </View>
            <View style={{flexShrink: 0}}>
              <Field label="Buscar ejercicio o grupo muscular" value={search} onChangeText={setSearch}/>
            </View>
          </View>
          <ScrollView style={{flex: 1, minHeight: 0}} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
            {allowAll && <Button title="Todos los ejercicios" secondary onPress={() => select('all')}/>}
            {options.map(e => <Pressable
              accessibilityRole="button"
              key={e.id}
              onPress={() => select(e.id)}
              style={{paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.edge}}
            >
              <Text style={s.text}>{e.name}</Text>
              <Text style={s.muted}>{e.group}</Text>
            </Pressable>)}
            {!options.length && <Text style={s.muted}>No hay ejercicios con ese nombre.</Text>}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  </>;
}
