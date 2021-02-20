import React, { useCallback, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme, Drawer } from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import { AuthContext } from "../context/AuthContext";

const icon_color = "#FFF";

export const DrawerContent = (props) => {
    const { signOut } = useContext(AuthContext);

    const logout = useCallback(() => {
        try {
            props.navigation.closeDrawer();
            signOut();
        } catch (err) {
            alert(
                "An error ocurred while trying to sign out. Please try again."
            );
        }
    }, []);

    return (
        <View style={styles.container}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            icon={({ color, size }) => (
                                <MaterialCommunityIcons
                                    name="lock"
                                    size={24}
                                    color={icon_color}
                                />
                            )}
                            label="Locked"
                            labelStyle={styles.label}
                            onPress={() => {
                                props.navigation.navigate("Locked");
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <MaterialIcons
                                    name="person"
                                    size={24}
                                    color={icon_color}
                                />
                            )}
                            label="Account"
                            labelStyle={styles.label}
                            onPress={() => {
                                props.navigation.navigate("AccountStack");
                            }}
                        />

                        <DrawerItem
                            icon={({ color, size }) => (
                                <MaterialCommunityIcons
                                    name="logout"
                                    size={24}
                                    color={icon_color}
                                />
                            )}
                            label="Sign Out"
                            labelStyle={styles.label}
                            onPress={logout}
                        />
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#333",
    },
    drawerContent: {
        flex: 1,
    },
    drawerSection: {
        marginTop: 15,
    },
    label: {
        fontSize: 16,
        color: "#FFF",
    },
});
