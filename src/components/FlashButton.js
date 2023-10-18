import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const FlashButton = ({ onPress, isFlashOn }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <MaterialIcons
        name={isFlashOn ? "flash-on" : "flash-off"}
        size={34}
        color="white"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 50,
    right: 20,
  },
});

export default FlashButton;
