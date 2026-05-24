import { styled, Tabs, XStack } from "tamagui";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export const BBTabIcon = styled(Icon, {
  size: 20,
  color: "$color",
});

export const BBTabs = styled(Tabs, {
  alignSelf: "stretch",
  flex: 1,
});

export const bbTabStyle = {
  activeStyle: {
    backgroundColor: "$color3",
    borderBottomWidth: 0,
    fontWeight: "bold",
  },
  borderWidth: "$0.25",
  borderColor: "$borderColor",
  borderRadius: 0,
  gap: "$1.5",
};
export const BBTab = styled(Tabs.Tab, bbTabStyle);

export const BBTabBar = styled(XStack, {
  flexDirection: "row",
  justifyContent: "space-between",
  backgroundColor: "$color1",
});
