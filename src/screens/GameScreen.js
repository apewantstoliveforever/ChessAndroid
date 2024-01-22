import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GameEngine } from 'react-native-game-engine';

import Chessboard from '../components/Chessboard';
import { ChessServiceProvider } from '../services/ChessService';

const GameScreen = ({ navigation }) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        textStyle: {
            fontSize: 20,
            marginBottom: 20,
        },
    });

    // Define the chessboard dimensions
    const boardSize = 8;

    // GameEngine entities containing the Chessboard component
    const entities = {
        chessboard: {
            position: [0, 0],
            size: [boardSize, boardSize],
            renderer: (
                <Chessboard boardSize={boardSize} />
            ),
        },
    };

    return (
        <View style={styles.container}>
            <Text style={styles.textStyle}>Game Screen</Text>
            {/* Use GameEngine with the defined entities */}
            <ChessServiceProvider>
                <GameEngine entities={entities} />
            </ChessServiceProvider>
        </View>
    );
};

export default GameScreen;
