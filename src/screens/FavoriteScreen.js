import React, { useActionState, useEffect } from "react";
import { useState } from "react";
import { Card, FAB } from "@rn-vui/themed";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    Button,
    TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AddEvent from "../components/AddEvent";
import EventInfo from "../components/EventInfo";
import { supabase } from "../utils/hooks/supabase";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import { FlatList } from "react-native-gesture-handler";


export default function FavoriteScreen({ route, navigation }) {
    const { user } = useAuthentication();
    const [favs, setFavs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchTableData() {

            const { data, error } = await supabase
                .from("location")
                .select("name"); // Select all columns, or specify columns like 'id, name'

            if (error) {
                console.log("Profile pic fetch failure");
            } else if (data) {
                setFavs(data);
            }
        };

        fetchTableData();
    }, []);
    console.log(favs);

    return (
        <View style={[styles.container]}>
            <Text>Data from Supabase:</Text>
            <FlatList
                data={favs}
                keyExtractor={(item) => item.id.toString()} // Adjust keyExtractor based on your table's primary key
                renderItem={({ item }) => (
                    <View>
                        <Text>{JSON.stringify(item)}</Text>
                    </View>
                )}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    }
})





