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
  WrapItem,
} from "@chakra-ui/react";
import { Item } from "../../provider/ItemData";
import { isTouchDevice } from "../../utils/isTouch";
import ItemDescription from "./ItemDescription";

interface Props {
  item: {
    key: string;
    description?: string;
  };
  itemData: { [key: string]: Item };
}

const BuildItem: React.FC<Props> = (props) => {
  const { item, itemData } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Tooltip
        padding="0"
        backgroundColor="rgba(0, 0, 0, 1)"
        borderRadius="md"
        label={
          <ItemDescription
            item={itemData[item.key]}
            description={item.description}
          />
        }
        boxShadow="2px 2px 8px 8px rgba(0,0,0,0.75)"
      >
        <WrapItem
          as={Img}
          src={`https://cdn.dota2.com/apps/dota2/images/items/${item.key.replace(
            "item_",
            ""
          )}_lg.png`}
          alt={item.key}
          height={["2em", "2.5em", "3em"]}
          onClick={() => isTouchDevice() && onOpen()}
        />
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent padding="0">
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ItemDescription
              item={itemData[item.key]}
              description={item.description}
            />
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
};

export default BuildItem;
