import { Button, styled } from "tamagui";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export default styled(Button, {
  position: "absolute",
  right: "$4",
  bottom: "$4",
  size: "$6",
  iconSize: "$8",
  circular: true,
  icon: <Icon name="plus" />,
});
