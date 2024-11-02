import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { Home } from "./pages/Home";
import { Trackings } from "./pages/Trackings";

const Tab = createBottomTabNavigator();

export function Routes() {
  return (
    <Tab.Navigator screenOptions={{ tabBarHideOnKeyboard: true }}>
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons
              size={size}
              color={color}
              name={focused ? "home" : "home-outline"}
            />
          ),
        }}
      />

      <Tab.Screen
        name="trackings"
        component={Trackings}
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons
              size={size}
              color={color}
              name={focused ? "cube" : "cube-outline"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
