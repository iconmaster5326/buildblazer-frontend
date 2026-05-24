import { NavigationProps } from "@/app";
import EntityTypeBadge from "@/components/EntityTypeBadge";
import ModalScreen from "@/components/ModalScreen";
import { ENTITY_TYPE_INFO } from "@/entityTypes";
import { REDUX_DISPATCH, REDUX_STORE } from "@/redux";
import { BUILDBLAZER } from "@/storage";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ListItem, Text, YGroup } from "tamagui";

export default function ScreenNewEntity({
  route,
}: {
  route: RouteProp<NavigationProps, "NewEntity">;
}) {
  const entityTypes = Object.keys(BUILDBLAZER.entityTypes).toSorted();

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
              title={<EntityTypeBadge entityType={etype} />}
              subTitle={
                <Text fontSize="$2" color="$color10">
                  {ENTITY_TYPE_INFO[etype].desc}
                </Text>
              }
              onPress={async () => {
                nav.goBack();
                const newEntity = BUILDBLAZER.entityFromJSON({ type: etype });
                await REDUX_STORE.dispatch(
                  REDUX_DISPATCH.addChild({
                    parentID: route.params.parent,
                    newEntity: newEntity,
                  }),
                );
                nav.push("EditEntity", { entity: newEntity.id });
              }}
            />
          </YGroup.Item>
        ))}
      </YGroup>
    </ModalScreen>
  );
}
