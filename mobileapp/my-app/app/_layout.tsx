import { Stack } from "expo-router";
import { useEffect } from "react";
import { socketService } from "../src/services/socketService";

export default function RootLayout() {
  useEffect(() => {
    // Initialize socket connection when app starts
    const socket = socketService.connect();
    
    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
