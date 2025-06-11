import { Slot } from "expo-router";
import SafeScreen from "@/components/SafeScreen";

export default function RootLayout() {
  
  return (
    <ClerkProvider>
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </ClerkProvider>
  )
}
 