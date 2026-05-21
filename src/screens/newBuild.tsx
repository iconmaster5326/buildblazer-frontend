import { useNavigation } from "@react-navigation/native";
import {
  Button,
  Dialog,
  Form,
  Input,
  Label,
  Select,
  VisuallyHidden,
  XStack,
  YStack,
} from "tamagui";
import { ReactElement, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

import ModalScreen from "@/components/ModalScreen";
import { NavigationProps } from "@/app";
import { BUILDBLAZER, loadBuild } from "@/storage";
import { REDUX_DISPATCH, useReduxDispatch } from "@/redux";

export default function ScreenNewBuild() {
  const systemIDs = Object.keys(BUILDBLAZER.systems);

  const nav = useNavigation<NativeStackNavigationProp<NavigationProps>>();
  const [success, setSuccess] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [fieldSystem, setFieldSystem] = useState(systemIDs[0]);
  const dispatch = useReduxDispatch();

  let problems: ReactElement[] = [];

  return (
    <ModalScreen
      title="New Build"
      onDismiss={async () => {
        nav.goBack();
        if (success) {
          nav.navigate("Build", {
            build: (
              await loadBuild(
                await dispatch(
                  REDUX_DISPATCH.newBuild({
                    name: fieldName,
                    system: fieldSystem,
                  }),
                ).unwrap(),
              )
            ).id,
          });
        }
      }}
    >
      <Form>
        <YStack gap="$4">
          <XStack gap="$8">
            <Label htmlFor="name" width="$2">
              Name
            </Label>
            <Input
              id="name"
              value={fieldName}
              onChangeText={setFieldName}
              placeholder="New Build"
            />
          </XStack>
          <XStack gap="$8">
            <Label htmlFor="system" width="$2">
              System
            </Label>
            <Select
              id="system"
              value={fieldSystem}
              onValueChange={setFieldSystem}
              defaultValue={systemIDs[0]}
              native
            >
              <Select.Trigger iconAfter={<Icon name="chevron-down" />}>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.ScrollUpButton />
                <Select.Viewport>
                  <Select.Group>
                    {systemIDs.map((system, index) => (
                      <Select.Item key={index} index={index} value={system}>
                        <Select.ItemText>
                          {BUILDBLAZER.systems[system].name}
                        </Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Viewport>
                <Select.ScrollDownButton />
              </Select.Content>
            </Select>
          </XStack>
          <VisuallyHidden
            theme="red"
            background="$background"
            padding="$2"
            borderRadius="$2"
            visible={problems.length > 0}
          >
            <YStack gap="$2">{problems}</YStack>
          </VisuallyHidden>
          <Form.Trigger asChild>
            <Dialog.Close asChild>
              <Button
                disabled={problems.length > 0}
                onPress={() => setSuccess(true)}
              >
                Create New Build
              </Button>
            </Dialog.Close>
          </Form.Trigger>
        </YStack>
      </Form>
    </ModalScreen>
  );
}
