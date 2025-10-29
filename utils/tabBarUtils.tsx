import { FontAwesome } from "@expo/vector-icons";
import React from "react";

export function getTabBarIcon(name: string, color: string, size: number = 24) {
  if (name === "index") {
    return <FontAwesome name="book" size={size} color={color} />;
  } else if (name === "add") {
    return <FontAwesome name="plus" size={size} color={color} />;
  }
  return null;
}

export function getTabBarLabel(name: string) {
  if (name === "index") {
    return "Livres";
  } else if (name === "add") {
    return "Ajouter";
  }
  return "";
}
