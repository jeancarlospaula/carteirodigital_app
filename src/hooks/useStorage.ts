import AsyncStorage from "@react-native-async-storage/async-storage";

const useStorage = () => {
  const getItem = async (key: string) => {
    try {
      const items = await AsyncStorage.getItem(key);

      return JSON.parse(items as string) || [];
    } catch (error) {
      console.log("Erro ao buscar", error);

      return [];
    }
  };

  const saveItem = async (key: string, value: Record<string, any>) => {
    try {
      const items: any[] = await getItem(key);

      const itemId = value.id;

      const itemIndex = items.findIndex((item) => item.id === itemId);

      if (itemIndex >= 0) {
        items.splice(itemIndex, 1, value);
      } else {
        items.push(value);
      }

      await AsyncStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
      console.log("Erro ao salvar", error);
    }
  };

  const removeItem = async (key: string, id: string) => {
    try {
      const items = await getItem(key);

      const itemsUpdated = items.filter(
        (item: { id: string }) => item.id !== id
      );

      await AsyncStorage.setItem(key, JSON.stringify(itemsUpdated));

      return itemsUpdated;
    } catch (error) {
      console.log("Erro ao deletar", error);
    }
  };

  return {
    getItem,
    saveItem,
    removeItem,
  };
};

export default useStorage;
