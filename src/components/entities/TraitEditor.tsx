import { REDUX_DISPATCH, useReduxDispatch, useReduxSelector } from "@/redux";
import { H5, Input, Label, TextArea, XStack, YStack } from "tamagui";
import { BBTabIcon } from "../BBTabs";
import { Trait } from "@buildblazer/system-generic";

export default function TraitEditor({ entityID }: { entityID: string }) {
  const description = useReduxSelector(
    (state) => (state.entity?.descendantOrSelf(entityID) as Trait)?.description,
  );
  const dispatch = useReduxDispatch();

  return (
    <YStack gap="$4">
      <XStack gap="$4">
        <Label width={150} htmlFor="description">
          <XStack alignItems="center" gap="$2">
            <H5>Description</H5>
          </XStack>
        </Label>
        <TextArea
          flex={1}
          id="description"
          value={description}
          onChangeText={async (v) => {
            await dispatch(
              REDUX_DISPATCH.traitDesc({ entity: entityID, value: v }),
            );
          }}
        />
      </XStack>
    </YStack>
  );
}
