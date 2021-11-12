import React from "react";
import { FlatList } from "react-native";
import SearchSuggestion from "./SearchSuggestion";

export default function SearchSuggestionContainer({ data, navigation,scrolling }) {
    return (
        <FlatList
            data={data}
            keyboardShouldPersistTaps="always"
            keyExtractor={(item) => item.id.toString()}
            onScrollBeginDrag={scrolling}
            renderItem={({ item }) => (
                <SearchSuggestion item={item} navigation={navigation} />
            )}
        />
    );
}
