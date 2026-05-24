import { REDUX_DISPATCH, useReduxDispatch, useReduxSelector } from "@/redux";
import { Statistic } from "@buildblazer/core";
import { H5, Input, Label, XStack, YStack } from "tamagui";
import { BBTabIcon } from "../BBTabs";

export default function StatEditor({ entityID }: { entityID: string }) {
  const base = useReduxSelector(
    (state) => (state.entity?.descendantOrSelf(entityID) as Statistic)?.base,
  );
  const dispatch = useReduxDispatch();

  return (
    <YStack gap="$4">
      <XStack gap="$4">
        <Label width={150} htmlFor="base">
          <XStack alignItems="center" gap="$2">
            <BBTabIcon name="alpha-e-circle-outline" />
            <H5>Base Value</H5>
          </XStack>
        </Label>
        <Input
          flex={1}
          id="base"
          value={base}
          onChangeText={async (v) => {
            await dispatch(
              REDUX_DISPATCH.statBase({ entity: entityID, value: v }),
            );
          }}
        />
      </XStack>
    </YStack>
  );
}
