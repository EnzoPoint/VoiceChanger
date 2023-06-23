import { Animated, Easing, Text } from 'react-native';
import React, { useRef, useCallback, useEffect } from 'react';

const ShowPagination = ( props: any ) => {
    const showPaginationRef = useRef(new Animated.Value(1)).current;

  const animate = useCallback(
    (toValue = 0) => {
      Animated.timing(showPaginationRef, {
        toValue,
        duration: 200,
        isInteraction: false,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start();
    },
    [showPaginationRef],
  );

  useEffect(() => {
    setTimeout(() => animate(), props.delay);
  }, [animate]);

  const opacity = showPaginationRef.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  return (
    <Animated.View style={[{ opacity }]}>
      <Text style={props.style}>{props.children}</Text>
    </Animated.View>
  );
};

export default ShowPagination;