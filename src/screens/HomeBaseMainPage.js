import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";



export default function HomeBaseMainPage({ route, navigation }) {
  const { selectedCards } = route.params || {};

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Homebase Home</Text>

      {selectedCards?.length > 0 ? (
        selectedCards.map((card) => (
          <Text key={card.id} style={styles.cardText}>• {card.name}</Text>
        ))
      ) : (
        <Text style={styles.cardText}>No selections passed.</Text>
      )}

      {/* <View style={styles.largeCard}> */}
  
<TouchableOpacity
      onPress={() =>
        navigation.navigate("CorkBoardScreen", { resource: selectedCards?.[0] })
      }
      style={styles.largeCard}
    >
        <Text style={styles.cardTitle}>CorkBoard Screen</Text>
        {selectedCards?.[0] && (
          <Text style={styles.cardContent}>{selectedCards[0].name}</Text>
        )}
         </TouchableOpacity>
      
<TouchableOpacity
      onPress={() =>
        navigation.navigate("Map")
      }
      style={styles.smallCard}
    >
        <Text style={styles.cardTitle}>Map</Text>

        {selectedCards?.[1] && (
          <Text style={styles.cardContent}>{selectedCards[1].name}</Text>
        )}
    </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
   scrollContainer: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  largeCard: {
    flex: 3, // take more vertical space
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  smallCard: {
    flex: 1.2, // smaller height
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 16,
  },
});
