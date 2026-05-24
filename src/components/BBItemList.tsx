import { Separator, styled, YGroup } from "tamagui";

export const BBYGroup = styled(YGroup, {
  borderWidth: "$1",
  borderRadius: "$2",
  borderColor: "$borderColor",
});

export const BBYGroupSeparator = styled(Separator, {
  borderWidth: "$0.5",
  borderColor: "$borderColor",
});
