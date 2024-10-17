import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const TabBar = ({ state, descriptors, navigation }) => {
  const primary = "#BD6A33";
  const gray = "#BDBDBD"
  const icons = {
    '(home)': (props) => <AntDesign name='home' size={22} color={gray}{...props} />,
    index: (props) => <AntDesign name='home' size={22} color={gray}{...props} />,
    account: (props) => <AntDesign name='user' size={22} color={gray}{...props} />
  }

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        return (
          <TouchableOpacity
            key={route.name}
            style={styles.tabbarItem}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}

          >
            {
              icons[route.name]({
                color: isFocused ? primary : gray
              })
            }
            <Text style={{ color: isFocused ? primary : gray, fontSize: 8 }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: "rgba(66, 66, 66, 0.7)",
    marginHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 25,
    borderCurve: "continuous",
  },
  tabbarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4
  }
})
export default TabBar