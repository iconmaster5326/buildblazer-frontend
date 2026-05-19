import { useState } from "react";
import { Button, Dialog, Unspaced, VisuallyHidden } from "tamagui";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export interface ModalScreenProps {
  children?: any;
  onDismiss?: () => void;
  title?: string;
  dismissable?: boolean;
}

export default function ModalScreen(props: ModalScreenProps) {
  const dismissable =
    props.dismissable === undefined ? true : props.dismissable;

  const [open, setOpen] = useState(true);

  return (
    <Dialog
      modal
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
      onAnimationComplete={(ev) => {
        if (!ev.open && props.onDismiss) {
          props.onDismiss();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          background="$background"
          opacity={0.5}
          animateOnly={["transform", "opacity"]}
          transition={[
            "quicker",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          transition={[
            "quicker",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: 20, opacity: 0 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
          onPointerDownOutside={(event) => {
            if (!dismissable) event.preventDefault();
          }}
        >
          <Dialog.Title>{props.title}</Dialog.Title>
          {props.children}
          <VisuallyHidden visible={dismissable} asChild>
            <Unspaced>
              <Dialog.Close asChild>
                <Button
                  position="absolute"
                  right="$3"
                  size="$2"
                  circular
                  icon={<Icon name="close" />}
                />
              </Dialog.Close>
            </Unspaced>
          </VisuallyHidden>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
