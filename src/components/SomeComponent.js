import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  Image, Linking,
  LogBox,
  Platform,
  Pressable, ScrollView, StyleSheet,
  TouchableOpacity,
  View,
  Text
} from "react-native";

export const SomeComponent = ({text}) => {

    const NUM_LINES = 4; //Just define the minimum lines that you want to show, no matter what
  
    const [hasMore, setHasMore] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [numOfLines, setNumOfLines] = useState(NUM_LINES);
    const readMoreText = showMore ? 'Show Less' : 'Read More...';
  
    
    const onLoadMoreToggle = () => {
      setShowMore(!showMore);
    };
  
    const onTextLayout = e => {
      //we are checking if the original text lines are above our minimum number of lines
      setHasMore(e.nativeEvent.lines.length > NUM_LINES);
      //storing original number of lines
      setNumOfLines(e.nativeEvent.lines.length);
    };
  
  
  
    return (
      <Pressable onPress={() => onLoadMoreToggle()}>
        <Text
          onTextLayout={onTextLayout}
          style={{opacity: 0, position: 'absolute',}}>
          {post.text}
        </Text>
        <Text
          numberOfLines={
            !hasMore ? NUM_LINES : showMore ? numOfLines : NUM_LINES
          }>
          {text}
        </Text>
        {hasMore && (
          <View>
            <Text >{readMoreText}</Text>
          </View>
        )}
      </Pressable>
    );
  };