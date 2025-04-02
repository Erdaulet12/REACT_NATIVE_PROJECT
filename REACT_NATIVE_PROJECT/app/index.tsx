import { useState, useCallback } from 'react';
import { View, Text, Button, FlatList, Alert, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface Note {
  id: number;
  content: string;
  image?: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        if (Array.isArray(parsedNotes)) {
          const validNotes = parsedNotes.filter(
            (note: any) => note && note.id !== undefined
          );
          setNotes(validNotes);
        } else {
          setNotes([]);
        }
      } else {
        setNotes([]);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить заметки');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const deleteNote = async (id: number) => {
    try {
      const filteredNotes = notes.filter((note) => note.id !== id);
      await AsyncStorage.setItem('notes', JSON.stringify(filteredNotes));
      setNotes(filteredNotes);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить заметку');
    }
  };

  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 10 }}>
        Мои заметки
      </Text>
      <TextInput
        placeholder="Поиск заметок..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
        }}
      />
      {filteredNotes.length === 0 ? (
        <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 20 }}>
          Нет заметок
        </Text>
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item, index) =>
            item && item.id ? item.id.toString() : index.toString()
          }
          renderItem={({ item }) => (
            <View
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderColor: '#ddd',
                marginBottom: 10,
              }}
            >
              <Text style={{ marginBottom: 5 }}>{item.content}</Text>
              {item.image && (
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 100, height: 100, marginBottom: 5 }}
                />
              )}
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Button
                  title="Редактировать"
                  onPress={() => router.push(`/edit-note?noteId=${item.id}`)}
                />
                <View style={{ width: 10 }} />
                <Button title="Удалить" onPress={() => deleteNote(item.id)} color="red" />
              </View>
            </View>
          )}
        />
      )}
      <Button title="Добавить заметку" onPress={() => router.push('/add-note')} />
    </View>
  );
}
