import { useEffect } from "react";
import { router } from "expo-router";
import "./globals.css";

export default function Index() {
  useEffect(() => {
    router.replace("/(authenticated)/home");
  }, []);
  return null;
}
