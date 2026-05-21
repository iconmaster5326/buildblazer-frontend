import {
  Button,
  H5,
  Input,
  Label,
  ListItem,
  Separator,
  useMedia,
  XStack,
  YGroup,
  YStack,
} from "tamagui";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Screen from "@/components/Screen";
import { NavigationProps } from "@/app";
import { useState } from "react";
import { saveBuild } from "@/storage";
import ReminderText from "@/components/ReminderText";
import PlusButton from "@/components/PlusButton";
import { REDUX_SELECTOR, useReduxSelector } from "@/redux";

export default function ScreenMilestone({
  route,
}: {
  route: RouteProp<NavigationProps, "Milestone">;
}) {
  const build = useReduxSelector(REDUX_SELECTOR.build);
  const index = route.params.index;
  const milestone = build.milestones[index];
  const entity = build.entityAfterMilestone(milestone);

  const media = useMedia();
  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();

  const [name, setName] = useState(milestone.name);

  function pickEntityType() {
    nav.navigate("PickEntityType", { build: build });
  }

  return (
    <Screen>
      <YStack flex={1} alignSelf="stretch" gap="$4" padding="$4">
        <XStack gap="$4">
          <Label htmlFor="name">
            <H5>Name</H5>
          </Label>
          <Input
            flex={1}
            id="name"
            value={name}
            onChangeText={async (v) => {
              milestone.name = v;
              setName(v);
              if (route.params.onNameChanged)
                await route.params.onNameChanged(v);
              nav.setOptions({});
              await saveBuild(build);
            }}
          />
        </XStack>
        <Separator />
        {milestone.changes.length === 0 ? (
          <ReminderText>
            This character currently has no traits. Press &quot;
            {media.md ? "Add Trait" : "+"}&quot; to add something!
          </ReminderText>
        ) : (
          <YGroup>
            {entity.children.map((child, index) => (
              <YGroup.Item key={index}>
                <ListItem>{child.name}</ListItem>
              </YGroup.Item>
            ))}
          </YGroup>
        )}
        {media.md ? (
          <Button onPress={pickEntityType}>Add Trait</Button>
        ) : (
          <PlusButton onPress={pickEntityType} />
        )}
      </YStack>
    </Screen>
  );
}
