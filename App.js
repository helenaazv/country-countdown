import React, { useState, useEffect, useRef } from 'react';
import Globe from './globe';
import styles from './AppStyles';

import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';

function getFlagEmoji(code) {//Converts 2-letter country code into a flag emoji
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()));
}

const TOTAL_TIME = 15 * 60;

export default function App() {
  const [guess, setGuess] = useState(''); 
  const [countries, setCountries] = useState({}); //Dictionary: country names → 2-letter codes
  const [guessed, setGuessed] = useState([]);   //List of correctly guessed country names
  const [score, setScore] = useState(0);   
  const [bestScore, setBestScore] = useState(0);  
  const [msg, setMsg] = useState('');   
  const [loading, setLoading] = useState(true);   
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);  
  const [timerStarted, setTimerStarted] = useState(false);   //True if started
  const [gameOver, setGameOver] = useState(false);   //True if ended
  const timerRef = useRef(null);   //Mutable reference to the timer interval


  //Custom fonts
  const [fontsLoaded] = useFonts({
    'CabinSketch-Bold': require('./assets/fonts/CabinSketch-Bold.ttf'),
    'CabinSketch-Regular': require('./assets/fonts/CabinSketch-Regular.ttf'),
  });

  //Fetch country data and load best score
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,cca2,independent') //REST Countries API
      .then((res) => res.json()) //Parse response as JSON
      .then((json) => {
        const map = {};
        const independentCountries = json.filter(c => c.independent); //Only include independent countries

        //Map each country name (lowercased) to its 2-letter code
        independentCountries.forEach((c) => {
          map[c.name.common.toLowerCase()] = c.cca2;
        });

        setCountries(map); //Countries-country code map
      })
      .catch((error) => {
        console.error('Error fetching countries:', error); 
        setMsg('Failed to fetch countries'); 
      })
      .finally(() => setLoading(false)); //Hide loading spinner

    loadBestScore(); //Load the best score from storage

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []); 




  //Try to update best score if it's higher
  useEffect(() => {
    if (gameOver) {
      updateBestScore(score);
    }
  }, [gameOver]); 

  
  //Loads best score from AsyncStorage
  const loadBestScore = async () => {
    const stored = await AsyncStorage.getItem('bestScore');
    if (stored) setBestScore(parseInt(stored));
  };


  //Updates best score if new score is better
  const updateBestScore = async (newScore) => {
    const stored = await AsyncStorage.getItem('bestScore');
    let storedScore;
    if (stored) { //anything but null, 0, undefined....
      storedScore = parseInt(stored); //string to int
    } else {
      storedScore = 0;
    }

    if (newScore > storedScore) {
      await AsyncStorage.setItem('bestScore', newScore.toString());
      setBestScore(newScore);
    }
  };

  //Starts the countdown timer
  const startTimer = () => {
    setTimerStarted(true);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current); //Stop timer at 0
          setMsg('⏰ Time is up!');
          setGameOver(true);
          return 0;
        }
        return t - 1; //Decrement time
      });
    }, 1000);  //Run every 1 second
  };

  //Handles a guess
  const handleGuess = () => {
    const g = guess.trim().toLowerCase(); //Normalize input

    if (!g || gameOver) return; //Ignore empty or gameOver

    if (!timerStarted) startTimer(); //Start timer on first guess

    if (!loading) {
      if (countries[g]) {
        if (!guessed.includes(g)) {
          const newScore = score + 1;
          setGuessed([...guessed, g]); //Add to guessed list
          setScore(newScore); //Update score
          setMsg(`✅ Correct!`);
        } else {
          setMsg('⚠️ Already guessed.');
        }
      } else {
        setMsg('❌ Not a valid country.');
      }
    }

    setGuess(''); // Clear input field
  };

  //Resets game
  const restartGame = () => {
    clearInterval(timerRef.current);  // Stop timer
    setGuess('');
    setGuessed([]);
    setScore(0);
    setMsg('');
    setTimeLeft(TOTAL_TIME); // Reset timer
    setTimerStarted(false);
    setGameOver(false);
  };

  //Clears best score 
  const clearBestScore = async () => {
    await AsyncStorage.removeItem('bestScore');
    setBestScore(0);
  };


  //Time Format - MM:SS
  const formatTime = (secs) => {
    const min = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const sec = (secs % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  //Loading - if fonts or data aren't ready
  if (!fontsLoaded || loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007AFF" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Globe />
        <Text style={styles.title}>Country Countdown</Text>

        <Text style={styles.instructions}>
          Type the name of as many countries as you can in 15 minutes!{"\n"}
          Try to beat your best score before the timer runs out!
        </Text>

        {/*Input field and submit button*/}
        {!gameOver && (
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Type a country name"
              placeholderTextColor="#888"
              value={guess}
              onChangeText={setGuess}
              onSubmitEditing={handleGuess}
            />
            <Button title="Submit" onPress={handleGuess} color='#74B7D1' />
          </View>
        )}

        {/*Message feedback to user */}
        <Text style={styles.msg}>{msg}</Text>


        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Score</Text>
          <Text style={styles.scoreValue}>{score}</Text>
          <Text style={styles.scoreTotal}>/ {Object.keys(countries).length}</Text>
        </View>


        <Text style={styles.timerText}>Time Left: {formatTime(timeLeft)}</Text>
        <Text style={styles.bestScore}>🏆 Best Score: {bestScore}</Text>

        {/*Restart and ClearBestScore buttons*/}
        {gameOver && (
          <View style={{ marginVertical: 16 }}>
            <Button title="Restart Game" onPress={restartGame} color="#D17474" />
            <View style={{ marginTop: 10 }}>
              <Button title="Clear Best Score" onPress={clearBestScore} color="#D17474" />
            </View>
          </View>
        )}

        {/*Guessed countries list*/}
        <Text style={styles.guessTitle}>Guessed Countries: </Text>
        <FlatList
          data={guessed}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.guessItem}>
              <Text style={styles.guessText}>
                {item.charAt(0).toUpperCase() + item.slice(1)}{' '}
                {getFlagEmoji(countries[item])}
              </Text>
            </View>
          )}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      </View>
    </ScrollView>
  );
}


