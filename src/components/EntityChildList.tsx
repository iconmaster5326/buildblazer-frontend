import {
  Button,
  ListItem,
  Text,
  useMedia,
  XStack,
  YGroup,
  YStack,
} from "tamagui";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NavigationProps } from "@/app";
import { useReduxSelector } from "@/redux";
import { BBYGroup, BBYGroupSeparator } from "./BBItemList";
import ReminderText from "./ReminderText";
import EntityTypeBadge from "./EntityTypeBadge";
import PlusButton from "./PlusButton";

export default function EntityChildList({ entityID }: { entityID: string }) {
  const media = useMedia();
  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();

  const children = useReduxSelector((state) =>
    state.entity
      ? (state.entity.descendantOrSelf(entityID)?.children ?? [])
      : [],
  );

  async function addTrait() {
    nav.navigate("NewEntity", { parent: entityID });
  }

  return (
    <YStack gap="$4">
      {children.length === 0 ? (
        <ReminderText>
          There are currently no traits here. Press &quot;
          {media.md ? "Add Trait" : "+"}&quot; to add something!
        </ReminderText>
      ) : (
        <BBYGroup>
          {children.map((child, index) => (
            <>
              {index === 0 ? null : <BBYGroupSeparator />}
              <YGroup.Item key={index}>
                <ListItem
                  onPress={() => {
                    nav.push("EditEntity", { entity: child.id });
                  }}
                >
                  <XStack flex={1} alignItems="center" gap="$4">
                    <Text width={70}>
                      <EntityTypeBadge entityType={child.entityType()} />
                    </Text>
                    <Text flexGrow={1}>{child.name}</Text>
                    <ListItem.Subtitle flexGrow={1}>
                      {child.varName}
                    </ListItem.Subtitle>
                  </XStack>
                </ListItem>
              </YGroup.Item>
            </>
          ))}
        </BBYGroup>
      )}
      {media.md ? (
        <Button onPress={addTrait}>Add Trait</Button>
      ) : (
        <PlusButton onPress={addTrait} />
      )}
    </YStack>
  );
}
