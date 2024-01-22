import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import { useChessService } from '../services/ChessService';


const Chessboard = ({ boardSize }) => {

    const { chessPieces, movePiece, chooseCell } = useChessService();

    const row = boardSize
    const col = boardSize
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'column',
        },
        row: {
            flexDirection: 'row',
        },
        cell: {
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
        },
        lightCell: {
            backgroundColor: 'white',
        },
        darkCell: {
            backgroundColor: 'gray',
        },
        piece: {
            fontSize: 20,
            color: 'black', // Change the color based on your piece color
        },
    });

    // Example game state where 0 represents an empty cell
    // const chessPieces = [
    //     ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    //     ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    //     [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    //     [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    //     [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    //     [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    //     ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    //     ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    // ];

    // Function to handle a cell press
    const handleCellPress = (row, col) => {
        chooseCell(row, col);
    };

    // Function to determine the background color of a cell
    const getCellColor = (row, col) =>
        (row + col) % 2 === 0 ? styles.lightCell : styles.darkCell;

    // Function to render a single chessboard cell
    const renderCell = (row, col) => (
        <TouchableOpacity key={`${row}-${col}`} style={[styles.cell, getCellColor(row, col)]} onPress={() => handleCellPress(row, col)}
        >
            <Text>{chessPieces[row][col]}</Text>
        </TouchableOpacity>
    );

    // Function to render a row of chessboard cells
    const renderRow = (row) => (
        <View key={row} style={styles.row}>
            {Array.from({ length: 8 }, (_, i) => renderCell(row, i))}
        </View>
    );

    // Render the chessboard rows
    return (
        <View style={styles.container}>
            {Array.from({ length: 8 }, (_, i) => renderRow(i))}
        </View>
    );
};

export default Chessboard;
