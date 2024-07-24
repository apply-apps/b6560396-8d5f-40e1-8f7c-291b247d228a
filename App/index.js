// Filename: index.js
// Combined code from all files

import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Text, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');
const blockSize = 20;
const initialSnake = [{ x: width / 2, y: width / 2 }];
const initialFood = { x: getRandomCoordinate(width), y: getRandomCoordinate(width) };

const directions = {
    up: { x: 0, y: -blockSize },
    down: { x: 0, y: blockSize },
    left: { x: -blockSize, y: 0 },
    right: { x: blockSize, y: 0 },
};

const getRandomCoordinate = (max) => {
    return Math.floor((Math.random() * (max - blockSize)) / blockSize) * blockSize;
};

export default function App() {
    const [snake, setSnake] = useState(initialSnake);
    const [food, setFood] = useState(initialFood);
    const [direction, setDirection] = useState(directions.right);
    const [isGameOver, setIsGameOver] = useState(false);
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        const handleInterval = () => {
            if (isGameOver) return clearInterval(intervalId);

            moveSnake();
        };

        const id = setInterval(handleInterval, 200);
        setIntervalId(id);
        return () => clearInterval(id);
    }, [snake, direction, isGameOver]);

    const moveSnake = useCallback(() => {
        const newHead = {
            x: snake[0].x + direction.x,
            y: snake[0].y + direction.y
        };

        if (
            newHead.x < 0 ||
            newHead.x >= width ||
            newHead.y < 0 ||
            newHead.y >= width ||
            snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
            setIsGameOver(true);
            return;
        }

        let newSnake = [newHead, ...snake];

        if (newHead.x === food.x && newHead.y === food.y) {
            setFood({ x: getRandomCoordinate(width), y: getRandomCoordinate(width) });
        } else {
            newSnake.pop();
        }

        setSnake(newSnake);
    }, [snake, direction, food]);

    const handleDirectionChange = (newDirection) => {
        if (
            (direction.x + newDirection.x !== 0) ||
            (direction.y + newDirection.y !== 0)
        ) {
            setDirection(newDirection);
        }
    };

    const restartGame = () => {
        setSnake(initialSnake);
        setFood(initialFood);
        setDirection(directions.right);
        setIsGameOver(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Snake Game</Text>
            <View style={styles.gameboard}>
                {snake.map((segment, idx) => (
                    <View key={idx} style={[styles.snakeSegment, { left: segment.x, top: segment.y }]} />
                ))}
                <View style={[styles.food, { left: food.x, top: food.y }]} />
                {isGameOver && (
                    <View style={styles.gameOverOverlay}>
                        <Text style={styles.gameOverText}>Game Over</Text>
                        <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
                            <Text style={styles.restartButtonText}>Restart</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <View style={styles.controls}>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.controlButton} onPress={() => handleDirectionChange(directions.up)}>
                        <Text style={styles.controlButtonText}>↑</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.controlButton} onPress={() => handleDirectionChange(directions.left)}>
                        <Text style={styles.controlButtonText}>←</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.controlButton} onPress={() => handleDirectionChange(directions.down)}>
                        <Text style={styles.controlButtonText}>↓</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.controlButton} onPress={() => handleDirectionChange(directions.right)}>
                        <Text style={styles.controlButtonText}>→</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginVertical: 30,
    },
    gameboard: {
        width: width,
        height: width,
        backgroundColor: '#f0f0f0',
        position: 'relative',
    },
    snakeSegment: {
        position: 'absolute',
        width: blockSize,
        height: blockSize,
        backgroundColor: 'green',
    },
    food: {
        position: 'absolute',
        width: blockSize,
        height: blockSize,
        backgroundColor: 'red',
    },
    controls: {
        marginTop: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    controlButton: {
        width: 60,
        height: 60,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        borderRadius: 30,
    },
    controlButtonText: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    gameOverOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gameOverText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
    },
    restartButton: {
        marginTop: 20,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    restartButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});