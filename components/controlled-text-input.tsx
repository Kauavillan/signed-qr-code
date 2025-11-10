import { Colors } from "@/constants/theme";
import { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import CustomPressable from "./custom-pressable";
import Icon from "./icons";

type ControlledTextInputType = "email" | "password" | "text";

export interface ControlledTextInputProps<T extends FieldValues>
  extends TextInputProps {
  control: Control<T>;
  placeholder: string;
  name: Path<T>;
  type?: ControlledTextInputType;
  errors: Record<string, any>;
}
export default function ControlledTextInput<T extends FieldValues>({
  control,
  name,
  placeholder,
  type = "text",
  errors,
  ...rest
}: ControlledTextInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={{ gap: 8 }}>
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType={type === "email" ? "email-address" : "default"}
              secureTextEntry={type === "password" && !showPassword}
              autoCapitalize={type === "text" ? "sentences" : "none"}
              placeholder={placeholder}
              style={[
                styles.input,
                isFocused && styles.inputFocused,
                rest.style,
              ]}
              onFocus={() => setIsFocused(true)}
              onEndEditing={() => setIsFocused(false)}
              ref={ref}
              {...rest}
            />
          )}
          name={name}
        />
        {type === "password" && (
          <CustomPressable
            style={{ marginLeft: -40 }}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon
              provider="Feather"
              name={showPassword ? "eye-off" : "eye"}
              color={Colors.grey}
              size={styles.input.minHeight / 2}
            />
          </CustomPressable>
        )}
      </View>
      {errors[name] && (
        <Text style={{ color: Colors.error }}>{errors[name].message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    alignSelf: "center",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    minHeight: 40,
    width: "100%",
    borderRadius: 8,
    backgroundColor: Colors.background,

    paddingHorizontal: 10,
  },
  inputFocused: {
    borderWidth: 1,
    borderColor: Colors.primary,
  },
});
