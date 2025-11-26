import Icon from "@/components/icons";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs } from "expo-router";

export default function IssuerLayout() {
  const { isAuthenticated } = useAuth();
  console.log("IssuerLayout - isAuthenticated:", isAuthenticated);
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: Colors.tint,
      }}
    >
      <Tabs.Protected guard={isAuthenticated}>
        <Tabs.Screen
          name="generate-codes"
          options={{
            title: "Gerar códigos",
            tabBarIcon: ({ color, size }) => (
              <Icon
                provider="Ionicons"
                name="qr-code"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="qr-codes"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Icon
                provider="Ionicons"
                name="qr-code"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, size }) => (
              <Icon
                provider="Ionicons"
                name="person-circle"
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tabs.Protected>
    </Tabs>
  );
}
