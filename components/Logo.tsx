import { Image, StyleSheet, View } from "react-native";
import { spacing } from "../constants/designSystem";

interface LogoProps {
  size?: "small" | "medium" | "large";
}

export default function Logo({ size = "medium" }: LogoProps) {
  const sizes = {
    small: 60,
    medium: 100,
    large: 140,
  };

  const logoSize = sizes[size];

  return (
    <View style={styles.container}>
      <View style={[styles.logoWrapper, { width: logoSize, height: logoSize }]}>
        <Image
          source={require("../assets/images/booklist_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
});
