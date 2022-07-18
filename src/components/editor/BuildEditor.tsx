import { VStack } from "@chakra-ui/react";
import { useMemo } from "react";
import {
  BuildEditorProvider,
  BuildEditorState,
  createBuildEditorStoreWithInitialState,
  emptyBuildEditorState,
} from "./buildEditorStore";
import HeroPicker from "./HeroPicker";
import NameInput from "./NameInput";

const BuildEditor: React.FC<{ initialValue?: BuildEditorState }> = ({
  initialValue,
}) => {
  const createBuildEditorStore = useMemo(
    () =>
      createBuildEditorStoreWithInitialState(
        initialValue || emptyBuildEditorState
      ),
    [initialValue]
  );
  return (
    <BuildEditorProvider createStore={createBuildEditorStore}>
      <VStack spacing="4" alignItems="start">
        <HeroPicker />
        <NameInput />
      </VStack>
    </BuildEditorProvider>
  );
};

export default BuildEditor;
