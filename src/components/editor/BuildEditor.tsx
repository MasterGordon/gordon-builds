import { Grid, VStack } from "@chakra-ui/react";
import { useMemo } from "react";
import AbilitiesPicker from "./AbilitiesPicker";
import {
  BuildEditorProvider,
  BuildEditorState,
  createBuildEditorStoreWithInitialState,
  emptyBuildEditorState,
} from "./buildEditorStore";
import HeroPicker from "./HeroPicker";
import NameInput from "./NameInput";
import VersionPicker from "./VersionPicker";
import TalentPicker from "./TalentPicker";

const BuildEditor: React.FC<{ initialValue?: BuildEditorState }> = ({
  initialValue,
}) => {
  const buildEditorStore = useMemo(
    () =>
      createBuildEditorStoreWithInitialState(
        initialValue || emptyBuildEditorState
      )(),
    [initialValue]
  );
  return (
    <BuildEditorProvider store={buildEditorStore}>
      <VStack spacing="4" alignItems="start">
        <Grid gap="4" width="100%" templateColumns="1fr 2fr">
          <HeroPicker />
          <VersionPicker />
        </Grid>
        <NameInput />
        <AbilitiesPicker />
        <TalentPicker />
      </VStack>
    </BuildEditorProvider>
  );
};

export default BuildEditor;
