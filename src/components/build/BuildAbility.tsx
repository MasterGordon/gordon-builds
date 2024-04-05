import {
  Img,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { isTouchDevice } from "../../utils/isTouch";
import AbilityDescription from "./AbilityDescription";
import { Ability } from "../../server/routers/dota";

interface Props {
  ability: string;
  abilityData: Ability["ability"];
}

const BuildAbility: React.FC<Props> = (props) => {
  const { ability, abilityData } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Tooltip
        padding="0"
        backgroundColor="rgba(0, 0, 0, 1)"
        borderRadius="md"
        maxWidth="370px"
        label={<AbilityDescription ability={abilityData} />}
        boxShadow="2px 2px 8px 8px rgba(0,0,0,0.75)"
        hasArrow
        placement="right"
      >
        <Img
          onClick={() => isTouchDevice() && onOpen()}
          width={["10", "16"]}
          alt={ability}
          src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${ability}.png`}
        />
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent padding="0">
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody>
            <AbilityDescription ability={abilityData} />{" "}
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
};

export default BuildAbility;
