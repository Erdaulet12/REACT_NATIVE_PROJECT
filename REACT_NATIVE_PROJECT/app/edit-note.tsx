import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Note {
  id: number;
  content: string;
}

export default function EditNoteScreen() {
  const router = useRouter();
  const { noteId } = useLocalSearchParams();
  const [noteContent, setNoteContent] = useState('');
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    const loadNote = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem('notes');
        if (storedNotes) {
          const notesArray: Note[] = JSON.parse(storedNotes);
          // Сравниваем noteId как строку, так как query-параметры всегда строки
          const foundNote = notesArray.find((n) => n.id.toString() === noteId);
          if (foundNote) {
            setNote(foundNote);
            setNoteContent(foundNote.content);
          } else {
            Alert.alert('Ошибка', 'Заметка не найдена');
            router.back();
          }
        }
      } catch (error) {
        Alert.alert('Ошибка', 'Не удалось загрузить заметку');
      }
    };

    if (noteId) {
      loadNote();
    }
  }, [noteId]);

  const saveEditedNote = async () => {
    if (!note) return;
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) {
        const notesArray: Note[] = JSON.parse(storedNotes);
        const updatedNotes = notesArray.map((n) =>
          n.id === note.id ? { ...n, content: noteContent } : n
        );
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
        Alert.alert('Успех', 'Заметка обновлена');
        router.back();
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить изменения');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Редактирование заметки</Text>
      <TextInput
        value={noteContent}
        onChangeText={setNoteContent}
        multiline
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          padding: 10,
          marginBottom: 20,
          height: 100,
        }}
      />
      <Button title="Сохранить изменения" onPress={saveEditedNote} />
      <Button title="Отмена" onPress={() => router.back()} color="gray" />
    </View>
  );
}
