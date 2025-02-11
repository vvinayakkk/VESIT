import React, { useEffect, useState, useRef } from 'react';
import { Text, Animated } from 'react-native';

const AnimatedQuote = ({ text, style }) => {
  const [displayText, setDisplayText] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const colors = ['#fff7ed', '#ffedd5', '#fed7aa', '#fdba74'];
  
  useEffect(() => {
    let mounted = true;
    let currentIndex = 0;
    
    const typeText = () => {
      if (!mounted) return;
      
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        currentIndex++;
        
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300, // Increased fade duration
            useNativeDriver: true
          })
        ]).start();
        
        // Increased delay between characters to 250ms
        setTimeout(typeText, 250);
      }
    };
    
    // Add initial delay before starting
    setTimeout(() => {
      typeText();
    }, 500);

    return () => {
      mounted = false;
    };
  }, [text]);
  
  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text style={style}>
        {displayText.split('').map((char, index) => (
          <Text
            key={index}
            style={{
              color: colors[index % colors.length],
              fontFamily: 'System',
              textShadowColor: 'rgba(0, 0, 0, 0.75)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}
          >
            {char}
          </Text>
        ))}
      </Text>
    </Animated.View>
  );
};

export default AnimatedQuote;