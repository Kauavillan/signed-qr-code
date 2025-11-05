import { useEffect, useRef, useState } from "react";
import {
  StyleProp,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export type PressedStyles = "opacity" | "scale" | "none" | StyleProp<ViewStyle>;

interface CustomPressableProps extends TouchableWithoutFeedbackProps {
  children?: React.ReactNode;
  onPress: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  pressedStyle?: PressedStyles;
  /** If true, applies smooth animation to "opacity" or "scale" variations. Default: false */
  animated?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Blocks repeated taps for N ms after a valid press. */
  cooldownMs?: number;
}
export default function CustomPressable({
  children,
  style,
  disabled = false,
  pressedStyle = "opacity",
  animated = false,
  onPress,
  onPressIn,
  onPressOut,
  cooldownMs = 200,
  ...rest
}: CustomPressableProps) {
  const [isPressed, setIsPressed] = useState(false);
  const press = useSharedValue(0);
  const supportsAnimation =
    animated && (pressedStyle === "opacity" || pressedStyle === "scale");
  function onPressStyleType() {
    if (pressedStyle === "none") return;
    switch (pressedStyle) {
      case "opacity":
        return { opacity: isPressed ? 0.5 : 1 };
      case "scale":
        return { transform: [{ scale: isPressed ? 0.95 : 1 }] };
      default:
        return pressedStyle;
    }
  }
  const styleOnPress = onPressStyleType();
  // No side-effect reset; handled directly on press events

  function animate(to: number) {
    if (!supportsAnimation) return;
    // Cancel any ongoing animation to prevent race conditions on quick taps
    cancelAnimation(press);
    press.value = withTiming(to, {
      duration: 120,
      easing: Easing.out(Easing.quad),
    });
  }

  const animatedStyle = useAnimatedStyle(() => {
    if (!supportsAnimation) return {};
    if (pressedStyle === "opacity") {
      return {
        opacity: interpolate(press.value, [0, 1], [1, 0.5]),
      } as ViewStyle;
    }
    // scale
    return {
      transform: [
        {
          scale: interpolate(press.value, [0, 1], [1, 0.95]),
        },
      ],
    } as ViewStyle;
  }, [supportsAnimation, pressedStyle]);

  // Lightweight cooldown without causing re-renders
  const coolingDown = useRef(false);
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    };
  }, []);

  const handlePress = () => {
    if (disabled) return;

    if (cooldownMs > 0) {
      if (coolingDown.current) return;
      coolingDown.current = true;
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
      cooldownTimer.current = setTimeout(() => {
        coolingDown.current = false;
      }, cooldownMs);
    }

    onPress?.();
  };

  return (
    <TouchableWithoutFeedback
      disabled={disabled}
      onPressIn={() => {
        onPressIn && onPressIn();
        if (supportsAnimation) animate(1);
        else setIsPressed(true);
      }}
      onPressOut={() => {
        onPressOut && onPressOut();
        if (supportsAnimation) animate(0);
        else setIsPressed(false);
      }}
      onPress={handlePress}
      {...rest}
    >
      <Animated.View
        onStartShouldSetResponder={() => true}
        // detects if the user’s finger has moved beyond a small threshold while pressing.
        onResponderMove={(e) => {
          const { pageX, pageY } = e.nativeEvent;
          const moveThreshold = 5;
          if (
            Math.abs(pageX - e.nativeEvent.locationX) > moveThreshold ||
            Math.abs(pageY - e.nativeEvent.locationY) > moveThreshold
          ) {
            if (supportsAnimation) animate(0);
            else setIsPressed(false);
          }
        }}
        style={[
          style,
          supportsAnimation ? animatedStyle : isPressed && styleOnPress,
        ]}
      >
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
