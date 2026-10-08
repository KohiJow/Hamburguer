import { useRef, useState } from "react";
import { View, Text, FlatList, SectionList } from "react-native";

import { Link } from "expo-router";

import { Header } from "@/components/header";
import { CategoryButton } from "@/components/category-button";
import { ProductCard } from "@/components/product-card";

import { useCartStore } from "@/stores/cart-store";

import { CATEGORIES, MENU, Product } from "@/utils/data/products";
import { getCartQuantity } from "@/utils/functions/cart-summary";

export default function Home() {
  const products = useCartStore((state) => state.products);
  const [category, setCategory] = useState(CATEGORIES[0]);

  const sectionListRef = useRef<SectionList<Product>>(null);

  const cartQuantityItems = getCartQuantity(products);

  function handleCategorySelect(selectedCategory: string) {
    setCategory(selectedCategory);

    const sectionIndex = CATEGORIES.indexOf(selectedCategory);

    if (sectionIndex >= 0) {
      sectionListRef.current?.scrollToLocation({
        animated: true,
        sectionIndex,
        itemIndex: 0,
      });
    }
  }

  return (
    <View className="flex-1 pt-8">
      <Header title="Faça um pedido" cartQuantityItem={cartQuantityItems} />

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <CategoryButton
            title={item}
            isSelected={item === category}
            onPress={() => handleCategorySelect(item)}
          />
        )}
        horizontal
        accessibilityRole="tablist"
        className="max-h-11 mt-5"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
      />

      <SectionList
        ref={sectionListRef}
        sections={MENU}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        renderItem={({ item }) => (
          <Link href={`/product/${item.id}`} asChild>
            <ProductCard data={item} />
          </Link>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text
            className="text-xl text-foreground font-heading mt-8 mb-3"
            accessibilityRole="header"
          >
            {title}
          </Text>
        )}
        className="flex-1 p-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}
