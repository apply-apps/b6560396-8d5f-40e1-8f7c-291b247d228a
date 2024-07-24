// Filename: index.js
// Combined code from all files

import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    View,
    Image,
    FlatList
} from 'react-native';
import axios from 'axios';

const FoodList = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const response = await axios.get('https://apihub.p.appply.xyz:3300/chatgpt', {
                    data: {
                        messages: [
                            { role: "user", content: "Provide a list of food items for an online food delivery app." },
                        ],
                        model: "gpt-4o"
                    }
                });
                setFoods(JSON.parse(response.data.response));
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFoods();
    }, []);

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const renderItem = ({ item }) => (
        <View style={styles.foodContainer}>
            <Image source={{ uri: `https://picsum.photos/200/200?random=${item.id}` }} style={styles.image} />
            <Text style={styles.foodName}>{item.name}</Text>
        </View>
    );

    return (
        <FlatList
            data={foods}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
        />
    );
};

const styles = StyleSheet.create({
    list: {
        alignItems: 'center',
    },
    foodContainer: {
        margin: 10,
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    foodName: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        marginTop: 30,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
    },
});

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>Online Food Delivery</Text>
                <FoodList />
            </ScrollView>
        </SafeAreaView>
    );
}