import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

export const MapFilterPanel = ({ collapsedText = "Tap to expand", expandedText = "Expanded content", children }) => {
  const [expanded, setExpanded] = useState(false);
  const [heightAnim] = useState(new Animated.Value(150)); // start collapsed height

  const toggleExpand = () => {
    Animated.timing(heightAnim, {
      toValue: expanded ? 150 : 280, // expand height downwards
      duration: 300,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
    <Animated.View style={[styles.pill, { height: heightAnim }]}>
      {children}
      {/* <IonIcon name="filter-outline" size={28} color="purple" /> */}
      {/* <Text style={styles.text}>{expanded ? expandedText : collapsedText}</Text> */}
      <TouchableOpacity onPress={toggleExpand} style={styles.button}>
        <IonIcon name={expanded ? "chevron-up-outline" : "chevron-down-outline"} size={24} color="purple" />
      </TouchableOpacity>
    </Animated.View>
    </View> 
  );
};

const styles = StyleSheet.create({
  pill: {
    width: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 10, // padding handled by height animation
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    flexDirection: "column",
  },
  text: {
    marginTop: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    marginTop: "auto",
  },
  container: {
  position: 'absolute',
  right: 20,
  top: 100,
  zIndex: 9999,
}
});
