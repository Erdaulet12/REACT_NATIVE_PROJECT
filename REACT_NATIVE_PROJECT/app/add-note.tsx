import React, { useState } from "react";
import { View, Alert } from "react-native";
import { Text, TextInput, Button, Card, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

export default function AddNoteScreen() {
  const theme = useTheme();
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const router = useRouter();

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Ошибка", "Доступ к галерее не разрешён");
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
      Alert.alert("Ошибка", "Введите текст заметки");
      return;
    }

    try {
      const storedNotes = await AsyncStorage.getItem("notes");
      const notesArray = storedNotes ? JSON.parse(storedNotes) : [];
      const newNote = {
        id: Date.now(),
        content: note,
        image: imageUri,
        category: category.trim(),
      };
      notesArray.push(newNote);
      await AsyncStorage.setItem("notes", JSON.stringify(notesArray));
      Alert.alert("Успех", "Заметка сохранена!");
      setNote("");
      setCategory("");
      setImageUri(null);
      router.back();
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось сохранить заметку");
    }
  };

  return (
    <View
      style={{ flex: 1, padding: 20, backgroundColor: theme.colors.background }}
    >
      <Text variant="headlineMedium" style={{ marginBottom: 10 }}>
        Добавление заметки
      </Text>
      <TextInput
        mode="outlined"
        label="Введите заметку..."
        value={note}
        onChangeText={setNote}
        multiline
        style={{
          marginBottom: 10,
          height: 100,
          backgroundColor: theme.colors.surface,
        }}
        outlineColor={theme.colors.primary}
        textColor={theme.colors.onSurface}
        placeholderTextColor={theme.colors.onSurfaceVariant}
      />
      <TextInput
        mode="outlined"
        label="Категория (необязательно)"
        value={category}
        onChangeText={setCategory}
        style={{ marginBottom: 10, backgroundColor: theme.colors.surface }}
        outlineColor={theme.colors.primary}
        textColor={theme.colors.onSurface}
        placeholderTextColor={theme.colors.onSurfaceVariant}
      />
      <Button mode="outlined" onPress={pickImage} style={{ marginBottom: 10 }}>
        Выбрать изображение
      </Button>
      {imageUri && (
        <Card
          style={{ marginBottom: 10, backgroundColor: theme.colors.surface }}
        >
          <Card.Cover source={{ uri: imageUri }} />
          <Button mode="text" onPress={() => setImageUri(null)}>
            Удалить изображение
          </Button>
        </Card>
      )}
      <Button mode="contained" onPress={saveNote} style={{ marginBottom: 10 }}>
        Сохранить
      </Button>
      <Button mode="outlined" onPress={() => router.back()}>
        Отмена
      </Button>
    </View>
  );
}
