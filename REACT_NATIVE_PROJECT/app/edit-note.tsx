import React, { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Note {
  id: number;
  content: string;
  category?: string;
}

export default function EditNoteScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { noteId } = useLocalSearchParams();
  const [noteContent, setNoteContent] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    const loadNote = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem("notes");
        if (storedNotes) {
          const notesArray: Note[] = JSON.parse(storedNotes);
          const foundNote = notesArray.find((n) => n.id.toString() === noteId);
          if (foundNote) {
            setNote(foundNote);
            setNoteContent(foundNote.content);
            setCategory(foundNote.category || "");
          } else {
            Alert.alert("Ошибка", "Заметка не найдена");
            router.back();
          }
        }
      } catch (error) {
        Alert.alert("Ошибка", "Не удалось загрузить заметку");
      }
    };

    if (noteId) {
      loadNote();
    }
  }, [noteId]);

  const saveEditedNote = async () => {
    if (!note) return;
    try {
      const storedNotes = await AsyncStorage.getItem("notes");
      if (storedNotes) {
        const notesArray: Note[] = JSON.parse(storedNotes);
        const updatedNotes = notesArray.map((n) =>
          n.id === note.id
            ? { ...n, content: noteContent, category: category.trim() }
            : n
        );
        await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
        Alert.alert("Успех", "Заметка обновлена");
        router.back();
      }
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось сохранить изменения");
    }
  };

  return (
    <View
      style={{ flex: 1, padding: 20, backgroundColor: theme.colors.background }}
    >
      <Text variant="headlineMedium" style={{ marginBottom: 10 }}>
        Редактирование заметки
      </Text>
      <TextInput
        mode="outlined"
        label="Содержимое заметки"
        value={noteContent}
        onChangeText={setNoteContent}
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
        style={{ marginBottom: 20, backgroundColor: theme.colors.surface }}
        outlineColor={theme.colors.primary}
        textColor={theme.colors.onSurface}
        placeholderTextColor={theme.colors.onSurfaceVariant}
      />
      <Button
        mode="contained"
        onPress={saveEditedNote}
        style={{ marginBottom: 10 }}
      >
        Сохранить изменения
      </Button>
      <Button mode="outlined" onPress={() => router.back()}>
        Отмена
      </Button>
    </View>
  );
}
