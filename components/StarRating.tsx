import { FontAwesome } from "@expo/vector-icons";
import { View } from "react-native";

interface StarRatingProps {
  rating: number;
  size?: number;
  color?: string;
}

export default function StarRating({
  rating,
  size = 16,
  color = "#FFD700",
}: StarRatingProps) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <FontAwesome key={`star-${i}`} name="star" size={size} color={color} />
      );
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(
        <FontAwesome
          key={`star-${i}`}
          name="star-half-o"
          size={size}
          color={color}
        />
      );
    } else {
      stars.push(
        <FontAwesome
          key={`star-${i}`}
          name="star-o"
          size={size}
          color={color}
        />
      );
    }
  }

  return <View style={{ flexDirection: "row", gap: 4 }}>{stars}</View>;
}
