import {
  createDrawerNavigator,
  DrawerContentScrollView, // kerimisvõimeline konteiner draweri sisu jaoks — hoiab kohandatud sisu õigesti käitusaja turvaalasid (safe area) arvestades
  DrawerItemList, // React Navigationi enda "renderda kõik Drawer.Screen'id nimekirjana" komponent
  DrawerContentComponentProps, // tüüp, mis kirjeldab, mida React Navigation drawerContent-funktsioonile argumendiks annab
} from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import CustomButton from '../components/CustomButton';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type DrawerParamList = {
  Home: undefined;
  Settings: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

// Oma kujundusega asendus vaikimisi drawer-menüü sisule. React Navigation
// kutsub selle komponendi ise välja ja annab `props`-iks kõik, mida
// drawer-menüü toimimiseks vaja (nt navigeerimisfunktsioonid, avatud oleku info).
function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { user, logout } = useAuth();

  return (
    // {...props} paneb kõik saadud propid (sh navigatsiooni ja stiili
    // puudutavad) DrawerContentScrollView'ile edasi — ilma selleta kaoks
    // nt õige safe-area käitumine ja kerimine.
    // contentContainerStyle={{ flexGrow: 1 }} laseb sisul täita kogu draweri kõrguse —
    // ilma selleta ei saaks väljalogimisnuppu allservas põhja lükata (vt styles.logoutContainer).
    <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
      {/* user && (...) — see plokk kuvatakse ainult siis, kui keegi on
          tegelikult sisse logitud (user pole null). Kuna DrawerStack renderdub
          alles pärast sisselogimist (vt App.tsx kokkupanekut), on user siin
          praktikas alati olemas, aga kontroll kaitseb TypeScript'i "user
          võib olla null" tüübi eest. */}
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.userInfoLabel}>Sisse logitud:</Text>
          <Text style={styles.userInfoEmail}>{user.email}</Text>
        </View>
      )}

      {/* Renderdab automaatselt kõik allpool DrawerStack'is defineeritud
          Drawer.Screen'id (Home, Settings) koos nende ikoonide ja pealkirjadega —
          me ei pea ise nende nimekirja käsitsi üles kirjutama. */}
      <DrawerItemList {...props} />

      {/* marginTop: 'auto' lükkab selle View'i (ja nupu selle sees) kerimisala
          põhja, ükskõik kui palju sisu tema kohal on — vt styles.logoutContainer allpool. */}
      <View style={styles.logoutContainer}>
        <CustomButton title="Logi välja" onPress={logout} variant="danger" />
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerStack() {
  return (
    <Drawer.Navigator
      // See ongi see rida, mis vaikimisi drawer-sisu meie omaga asendab.
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#5460af' },
        headerTintColor: '#fff',
        drawerActiveBackgroundColor: '#5460af22', // aktiivse (praegu avatud) ekraani rea taust drawer-menüüs
        drawerActiveTintColor: '#5460af', // aktiivse rea teksti/ikooni värv
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Avaleht',
          drawerIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Seaded',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  userInfo: { margin: 16, padding: 16, backgroundColor: '#5460af22', borderRadius: 8 },
  userInfoLabel: { fontSize: 12, color: '#666' },
  userInfoEmail: { fontSize: 16, fontWeight: '600', marginTop: 4 },
  logoutContainer: { marginTop: 'auto', padding: 16 }, // 'auto' võtab kogu vaba ruumi enda kohale — töötab, kuna sisu konteineril on flexGrow: 1
});
