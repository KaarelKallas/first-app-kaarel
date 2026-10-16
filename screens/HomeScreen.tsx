// screens/HomeScreen.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from './MainScreen';
import SecondaryScreen from './SecondaryScreen';
import { Ionicons } from '@expo/vector-icons';

// Tüüp kirjeldab, millised vahekaardid (tabs) siin navigaatoris on
export type HomeTabParamList = {
  Main: undefined;
  Secondary: undefined;
};

const Tab = createBottomTabNavigator<HomeTabParamList>();

export default function HomeScreen() {
  return (
    // headerShown: false — Tab.Navigator näitaks muidu oma päist ("Main") Stacki päise all
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Main"
        component={MainScreen}
        options={{
          // tabBarIcon saab funktsiooniargumendina hetke värvi ja suuruse
          // (React Navigation vahetab need automaatselt, kui vahekaart on aktiivne/mitteaktiivne)
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Secondary"
        component={SecondaryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
