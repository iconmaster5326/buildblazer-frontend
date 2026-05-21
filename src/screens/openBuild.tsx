import { useNavigation } from "@react-navigation/native";
import {
  ContextMenu,
  Dialog,
  Em,
  Form,
  ListItem,
  Strong,
  Text,
  View,
  XStack,
  YGroup,
  YStack,
} from "tamagui";
import { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import ModalScreen from "@/components/ModalScreen";
import { NavigationProps } from "@/app";
import { BuildSummary, loadBuild } from "@/storage";
import ReminderText from "@/components/ReminderText";
import {
  REDUX_DISPATCH,
  REDUX_SELECTOR,
  useReduxDispatch,
  useReduxSelector,
} from "@/redux";

export default function ScreenNewBuild() {
  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();
  const dispatch = useReduxDispatch();
  const buildList = useReduxSelector(REDUX_SELECTOR.builds);

  const [buildChosen, setBuildChosen] = useState(
    undefined as BuildSummary | undefined,
  );
  const [buildRClicked, setBuildRClicked] = useState(
    undefined as BuildSummary | undefined,
  );

  return (
    <ModalScreen
      title="Open Build"
      onDismiss={async () => {
        nav.goBack();
        if (buildChosen) {
          await dispatch(REDUX_DISPATCH.loadBuild(buildChosen.id));
          nav.navigate("Build");
        }
      }}
    >
      <Form>
        <YStack gap="$6">
          <XStack gap="$4" flex={1}>
            <Strong flex={1}>Name</Strong>
            <Strong flex={1}>System</Strong>
            <Strong flex={1}>Last Modified</Strong>
          </XStack>
          <View>
            {buildList.length === 0 ? (
              <ReminderText padding="$4">
                You don&apos;t have any builds. Make one by pressing &quot;New
                Build&quot;!
              </ReminderText>
            ) : (
              <ContextMenu>
                <ContextMenu.Trigger asChild>
                  <YGroup>
                    {buildList.map((summary, index) => (
                      <YGroup.Item key={index}>
                        <Form.Trigger asChild>
                          <Dialog.Close asChild>
                            <ListItem
                              onPress={() => setBuildChosen(summary)}
                              onContextMenu={() => setBuildRClicked(summary)}
                            >
                              <XStack gap="$4" flex={1}>
                                <Strong flex={1}>
                                  {summary.name ? (
                                    <Text>{summary.name}</Text>
                                  ) : (
                                    <Em>New Build</Em>
                                  )}
                                </Strong>
                                <Text flex={1}>{summary.system}</Text>
                                <Text flex={1}>
                                  {new Date(summary.lastEditTime).toISOString()}
                                </Text>
                              </XStack>
                            </ListItem>
                          </Dialog.Close>
                        </Form.Trigger>
                      </YGroup.Item>
                    ))}
                  </YGroup>
                </ContextMenu.Trigger>
                <ContextMenu.Portal zIndex={100}>
                  <ContextMenu.Content>
                    <ContextMenu.Item
                      theme="red"
                      onPress={async () => {
                        if (!buildRClicked) return;
                        await dispatch(
                          REDUX_DISPATCH.deleteBuild(buildRClicked.id),
                        );
                      }}
                    >
                      <ContextMenu.ItemTitle>
                        <Strong>Delete</Strong>
                      </ContextMenu.ItemTitle>
                    </ContextMenu.Item>
                  </ContextMenu.Content>
                </ContextMenu.Portal>
              </ContextMenu>
            )}
          </View>
        </YStack>
      </Form>
    </ModalScreen>
  );
}
