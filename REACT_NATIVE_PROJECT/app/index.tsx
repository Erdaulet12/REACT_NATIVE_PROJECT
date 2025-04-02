import React, { useState, useCallback } from "react";
import { View, Alert, FlatList, Image } from "react-native";
import { Text, Button, TextInput, Card, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

interface Note {
  id: number;
  content: string;
  image?: string;
  category?: string;
}

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(""); // для фильтрации по категории
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // сортировка по дате

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem("notes");
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
      Alert.alert("Ошибка", "Не удалось загрузить заметки");
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
      await AsyncStorage.setItem("notes", JSON.stringify(filteredNotes));
      setNotes(filteredNotes);
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось удалить заметку");
    }
  };

  const filteredNotes = notes.filter((note) => {
    const matchesContent = note.content
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter
      ? note.category?.toLowerCase().includes(categoryFilter.toLowerCase())
      : true;
    return matchesContent && matchesCategory;
  });

  const sortedNotes = filteredNotes.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.id - b.id;
    } else {
      return b.id - a.id;
    }
  });

  return (
    <View
      style={{ flex: 1, padding: 20, backgroundColor: theme.colors.background }}
    >
      <Text
        variant="headlineMedium"
        style={{ textAlign: "center", marginBottom: 10 }}
      >
        Мои заметки
      </Text>
      <TextInput
        mode="outlined"
        label="Поиск заметок..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{ marginBottom: 10, backgroundColor: theme.colors.surface }}
        outlineColor={theme.colors.primary}
        textColor={theme.colors.onSurface}
        placeholderTextColor={theme.colors.onSurfaceVariant}
      />
      <TextInput
        mode="outlined"
        label="Фильтр по категории..."
        value={categoryFilter}
        onChangeText={setCategoryFilter}
        style={{ marginBottom: 10, backgroundColor: theme.colors.surface }}
        outlineColor={theme.colors.primary}
        textColor={theme.colors.onSurface}
        placeholderTextColor={theme.colors.onSurfaceVariant}
      />
      <Button
        mode="outlined"
        onPress={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        style={{ marginBottom: 10 }}
      >
        Сортировка: {sortOrder === "asc" ? "Сначала старые" : "Сначала новые"}
      </Button>
      {sortedNotes.length === 0 ? (
        <Text style={{ textAlign: "center", fontSize: 16, marginBottom: 20 }}>
          Нет заметок
        </Text>
      ) : (
        <FlatList
          data={sortedNotes}
          keyExtractor={(item, index) =>
            item && item.id ? item.id.toString() : index.toString()
          }
          renderItem={({ item }) => (
            <Card
              style={{
                marginBottom: 10,
                backgroundColor: theme.colors.surface,
              }}
            >
              <Card.Content>
                <Text style={{ marginBottom: 5 }}>{item.content}</Text>
                {item.category ? (
                  <Text
                    style={{
                      fontStyle: "italic",
                      color: theme.colors.onSurfaceVariant,
                    }}
                  >
                    Категория: {item.category}
                  </Text>
                ) : null}
                {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 100, height: 100, marginTop: 5 }}
                  />
                )}
              </Card.Content>
              <Card.Actions style={{ justifyContent: "flex-end" }}>
                <Button
                  onPress={() => router.push(`/edit-note?noteId=${item.id}`)}
                >
                  Редактировать
                </Button>
                <Button onPress={() => deleteNote(item.id)} textColor="#000000">
                  Удалить
                </Button>
              </Card.Actions>
            </Card>
          )}
        />
      )}
      <Button mode="contained" onPress={() => router.push("/add-note")}>
        Добавить заметку
      </Button>
    </View>
  );
}
