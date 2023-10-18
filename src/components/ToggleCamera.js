import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const ToggleCamera = ({ onPress, isFrontCamera }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <MaterialIcons
        name={"flip-camera-android"}
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
    left: 20,
  },
});

export default ToggleCamera;
