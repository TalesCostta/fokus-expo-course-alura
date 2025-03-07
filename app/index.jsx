import { useRef, useState, useEffect } from "react";
import { Image, StyleSheet, Text, View, Animated } from "react-native";
import { FokusButton } from "../components/FokusButton";
import { ActionButton } from "../components/ActionButton";
import { Timer } from "../components/Timer";
import { IconPause, IconPlay } from "../components/Icons"


const pomodoro = [
  {
    id: 'focus',
    initialValue: 25 * 60,
    image: require('../assets/images/pomodoro.png'),
    display: 'Foco'
  },
  {
    id: 'short',
    initialValue: 5 * 60,
    image: require('../assets/images/short.png'),
    display: 'Pausa Curta'
  },
  {
    id: 'long',
    initialValue: 15 * 60,
    image: require('../assets/images/long.png'),
    display: 'Pausa Longa'
  },
]


export default function Index() {
  const [timerType, setTimerType] = useState(pomodoro[0]);
  const [seconds, setSeconds] = useState(pomodoro[0].initialValue)
  const [timerRunning, setTimerRunning] = useState(false)

  const backgroundAnim = useRef(new Animated.Value(0)).current;

  const timerRef = useRef(null);

  const startBackgroundAnimation = () => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    );
  };

  const animatedBackgroundColor = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#021123', '#06214a'] 
  });

  const clear = () => {
    if (timerRef.current != null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setTimerRunning(false);
    }
  }

  const toggleTimerType = (newTimerType) => {
    setTimerType(newTimerType);
    setSeconds(newTimerType.initialValue)
    clear();
  }

  const toggleTimer = () => {
    if (timerRef.current) {
      clear();
      return
    }

    setTimerRunning(true);

    const id = setInterval(() => {
      setSeconds(oldState => {
        if (oldState === 0) {
          clear()
          return timerType.initialValue
        }
        return oldState - 1
      })
    }, 1000)
    timerRef.current = id;
  }

  useEffect(() => {
    let animation;
    if (timerRunning) {
      animation = startBackgroundAnimation();
      animation.start();
    } else {
      backgroundAnim.setValue(0);
    }

    return () => animation?.stop();
  }, [timerRunning]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.animatedBackground,
          { backgroundColor: animatedBackgroundColor }
        ]}
      />
      <Image source={timerType.image} style={{ height: 280, width: 280 }} />
      <View style={styles.actions}>
        <View style={styles.context}>
          {pomodoro.map(p => (
            <ActionButton
              key={p.id}
              active={timerType.id === p.id}
              onPress={() => toggleTimerType(p)}
              display={p.display}
            />
          ))}
        </View>
        <Timer totalSeconds={seconds} />
        <FokusButton
          title={timerRunning ? 'Pausar' : 'Começar'}
          icon={timerRunning ? <IconPause /> : <IconPlay />}
          onPress={toggleTimer}
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Projeto fictício e sem fins comerciais.
        </Text>
        <Text style={styles.footerText}>
          Desenvolvido por Alura no Curso de React-Native com Expo.
        </Text>
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#021123',
    gap: 40,
  },
  animatedBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  actions: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    backgroundColor: '#14448080',
    width: '80%',
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#144480',
    gap: 32,
  },
  context: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  footer: {
    width: '80%'
  },
  footerText: {
    textAlign: 'center',
    color: '#98A0A8',
    fontSize: 12.5
  }
})