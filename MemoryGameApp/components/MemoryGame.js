import React, {useRef, useState, useEffect} from "react";
import {Text, View, StyleSheet, Button, TextInput, TouchableHighlight, FlatList } from "react-native";

export default function MemoryGame() {

    // TODO add your code
    const [wordsLeft, setWordsLeft] = useState(3);
    const [gameData, setGameData] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);

    const [savedCards, addSavedCards] = useState([])



    let moveCount = useRef(0)
    let wordsAdded = useRef([]);
    let inputElement = useRef("");



    useEffect(() => {
        if (selectedCards.length === 2) {
            console.log('Selected cards:', selectedCards)

            moveCount.current += 1

            if (selectedCards[0].value === selectedCards[1].value) {
                let existingCards =  selectedCards.map(card => {
                    let foundCard = savedCards.find(item => card.value === item.value && card.index === item.index);

                    return foundCard ? 1 : -1;
                }).filter(value => value === 1);

                console.log('Already existing cards:', existingCards.length)

                if (existingCards.length === 0) {
                    let newSavedItems = [...savedCards];
                    selectedCards.map(item => newSavedItems.push(item));

                    addSavedCards(newSavedItems)
                }




            }

            setSelectedCards([])
            //setTimeout(() => { setSelectedCards([]) }, 500)


        }
    }, [selectedCards])



    const findCard = (value, index, type) => {
        let cardType = type === 'saved' ? savedCards : selectedCards;
        let card = cardType.find(item => item.value == value && item.index == index);

        return card ? 1 : -1;
    }

    const GameCard = ({item, index}) => {
        return (
            <TouchableHighlight
                testID="game-card"
                style={[styles.gameCard]}
                underlayColor="#F5F5F5"
                activeOpacity={.7}
                onPress={() => {
                    if (selectedCards.length < 2 && findCard(item, index, "selected") === -1) {
                        let newCards = [...selectedCards];
                        newCards.push({value: item, index: index})

                        setSelectedCards(newCards)
                    }




                }}
            >
                <Text style={[styles.gameCardText]}>{findCard(item, index, "selected")=== -1  && findCard(item, index, "saved")=== -1 ? "❔" : item}</Text>
            </TouchableHighlight>
        )
    }

    const renderItem = ({item, index}) => {
        return (
            <GameCard item={item} index={index} />
        )
    }

    return (
        <View style={[styles.container]}>
            <View style={[styles.topControls]}>
                <TextInput
                    style={[styles.textInput]}
                    placeholder="Add new word"
                    testID="new-word-value"
                    ref={element => inputElement.current = element}
                    onFocus={() => {
                        inputElement.current.hasAttribute('style')  ? inputElement.current.removeAttribute('style')  : null
                    }}
                />

                <TouchableHighlight
                    underlayColor="#f5f5f5"
                    activeOpacity={0.8}
                    style={[styles.button]}
                    testID="add-word"
                    onPress={() => {
                        let inputValue = inputElement.current.value

                        if (wordsAdded.current.indexOf(inputValue.toString()) !== -1 || inputValue.current == '') {
                            inputElement.current.style.border = '1px solid #ff0000'
                        } else {
                            if ( wordsLeft > 0) {
                                wordsAdded.current.push(inputValue.toString());
                                setWordsLeft(3 - wordsAdded.current.length)
                                inputElement.current.value = ''

                                if (wordsLeft - 1 === 0) {

                                    let wordData = [...wordsAdded.current, ...[...wordsAdded.current]];
                                    console.log('Word data:', wordData)

                                    let wordShuffle = wordData.sort((a,b) => 0.5 - Math.random())

                                    setGameData(wordShuffle)

                                }
                            } else {
                                inputElement.current.style.border = '1px solid #ff0000'

                            }

                        }
                    }}
                >
                    <Text>Add word</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    underlayColor="#f5f5f5"
                    activeOpacity={0.8}
                    style={[styles.button]}
                    testID="reset-game"
                    onPress={() => {
                        setGameData([]);
                        wordsAdded.current = [];
                        setWordsLeft(3);
                        setSelectedCards([])
                        addSavedCards([])
                        moveCount.current = 0
                    }}
                >
                    <Text>Reset game</Text>
                </TouchableHighlight>
            </View>
            <Text>{wordsLeft} words left</Text>


            {
                gameData.length > 0 ? <FlatList
                    data={gameData}
                    keyExtractor={(item, index)  => index}
                    numColumns={1}
                    renderItem={renderItem}
                    testID="game-board"
                    style={[{width: '100%', marginVertical: 20}]}

                /> : null
            }
            {
                savedCards.length === gameData.length && wordsLeft === 0 ? <Text style={[{textAlign: 'center'}]}>You won the game with {moveCount.current} moves</Text> : null
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '75%',
        marginVertical: 20,
        marginLeft: 'auto',
        marginRight: 'auto'
    },

    topControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    textInput: {
        width: '50%',
        borderWidth: 1,
        borderColor: '#f2f2f2',
        paddingHorizontal: 8,
        paddingVertical: 10
    },

    button: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 6
    },

    gameCard: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#173570',
        height: 120,
        marginRight: 12,
        marginBottom: 12,
        width: 135
    },

    gameCardText: {
        textAlign: 'center',
        fontSize: 15,
        color: '#FFFFFF'
    }
})
