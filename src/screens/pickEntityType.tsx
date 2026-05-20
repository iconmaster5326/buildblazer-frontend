import { NavigationProps } from "@/app";
import ModalScreen from "@/components/ModalScreen";
import { BUILDBLAZER } from "@/storage";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ListItem,
  SizableText,
  styled,
  Text,
  useMedia,
  YGroup,
  YStack,
} from "tamagui";

interface TraitInfo {
  name: string;
  desc: string;
  color: string;
}

const TRAIT_INFO: Record<string, TraitInfo> = {
  counter: {
    name: "Counter",
    desc: "Keeps track of a numeric value that can go up and down on sheets, such as HP, ability uses, or money earned.",
    color: "#aa0000",
  },
  stat: {
    name: "Statistic",
    desc: "A number or die roll that can change as your character changes.",
    color: "#aa5500",
  },
  mod: {
    name: "Modifier",
    desc: "A single alteration to one of your statistics. Can be placed anywhere relative to that statistic.",
    color: "#aaaa00",
  },
  toggle: {
    name: "Toggle",
    desc: "A switch on your sheets to influence statistics and modifiers.",
    color: "#55aa00",
  },
  section: {
    name: "Section",
    desc: "A grouping of traits. Used for tabs, sections, and rows.",
    color: "#00aaaa",
  },
  trait: {
    name: "Trait",
    desc: "Describe something your character has.",
    color: "#0000aa",
  },
};

export default function ScreenPickEntityType({
  route,
}: {
  route: RouteProp<NavigationProps, "PickEntityType">;
}) {
  const build = route.params.build;
  const entityTypes = Object.keys(BUILDBLAZER.entityTypes).toSorted();

  const media = useMedia();
  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();

  return (
    <ModalScreen
      title="Add New Trait"
      onDismiss={async () => {
        nav.goBack();
      }}
    >
      <YGroup minWidth={275}>
        {entityTypes.map((etype) => (
          <YGroup.Item key={etype}>
            <ListItem
              title={
                <ListItem.Title
                  borderRadius="$2"
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  alignSelf="flex-start"
                  backgroundColor={TRAIT_INFO[etype].color}
                >
                  {TRAIT_INFO[etype].name}
                </ListItem.Title>
              }
              subTitle={
                media.md ? (
                  <ListItem.Subtitle>
                    {TRAIT_INFO[etype].desc}
                  </ListItem.Subtitle>
                ) : (
                  <Text fontSize="$2" color="$color10">
                    {TRAIT_INFO[etype].desc}
                  </Text>
                )
              }
              onPress={async () => {
                nav.goBack();
                // TODO: go forward
              }}
            />
          </YGroup.Item>
        ))}
      </YGroup>
    </ModalScreen>
  );
}
