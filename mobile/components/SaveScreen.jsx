import { View, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {COLORS} from '/Users/torresmacbookair/Desktop/React Native app/mobile/constants/colors.js';



const SaveScreen = ({ children }) => {
    const insets = useSafeAreaInsets();

  return (
    <View style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: COLORS.background}}>
      {children}
    </View>
  )
}



export default SaveScreen;