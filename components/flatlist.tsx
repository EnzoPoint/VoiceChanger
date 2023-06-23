import React from "react";
import {View,  FlatList, FlatListProps } from "react-native";

import styles from "@styles/components/flatlist.scss"

interface Props<T> extends FlatListProps<T> {
    renderItem: ({ item }: { item: T }) => JSX.Element;
    keyExtractor: (item: T, index: number) => string;
}


const CustomFlatList = <T extends any> (
    { data, renderItem, keyExtractor, ...props }: Props<T>
) => {
  return (
      <FlatList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.container}
          {...props} 
      />
  );
};

export default CustomFlatList;