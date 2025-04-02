import { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function AddNoteScreen() {
  const [note, setNote] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const router = useRouter();

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Ошибка', 'Доступ к галерее не разрешён');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const saveNote = async () => {
    if (!note.trim()) {
      Alert.alert('Ошибка', 'Введите текст заметки');
      return;
    }

    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      const notesArray = storedNotes ? JSON.parse(storedNotes) : [];
      const newNote = { id: Date.now(), content: note, image: imageUri };
      notesArray.push(newNote);
      await AsyncStorage.setItem('notes', JSON.stringify(notesArray));
      Alert.alert('Успех', 'Заметка сохранена!');
      setNote('');
      setImageUri(null);
      router.back();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить заметку');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Добавление заметки</Text>
      <TextInput
        placeholder="Введите заметку..."
        value={note}
        onChangeText={setNote}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
          height: 100,
        }}
        multiline
      />
      <Button title="Выбрать изображение" onPress={pickImage} />
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 200, height: 200, marginVertical: 10 }}
        />
      )}
      <Button title="Сохранить" onPress={saveNote} />
      <Button title="Отмена" onPress={() => router.back()} color="gray" />
    </View>
  );
}
