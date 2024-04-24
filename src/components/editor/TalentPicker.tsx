import TalentTree from "../build/TalentTree";
import { useBuildEditorStore } from "./buildEditorStore";
import { trpc } from "../../utils/trpc";

const TalentPicker: React.FC = () => {
  const { heroKey, leftTalents, rightTalents } = useBuildEditorStore(
    (store) => store.build
  );
  const skillTalent = useBuildEditorStore((store) => store.skillTalent);
  const { data: heroData } = trpc.dota.getHero.useQuery(
    { name: heroKey },
    { enabled: !!heroKey }
  );
  const requestedTalents = heroData?.talents.sort((a, b) => b.slot - a.slot);
  console.log("r", requestedTalents);
  const { data: talents } = trpc.dota.getTalents.useQuery(
    {
      ids:
        heroData?.talents
          .sort((a, b) => b.slot - a.slot)
          .map((t) => t.abilityId) || [],
    },
    { enabled: !!heroData }
  );

  const talentNames = requestedTalents
    ?.map(
      (t) => talents?.find((x) => x.id === t.abilityId)?.language.displayName
    )
    .filter((t): t is string => !!t);

  return (
    <TalentTree
      talents={[leftTalents, rightTalents]}
      talentNames={talentNames || []}
      onChange={(index, side) => {
        skillTalent(index, side);
      }}
    />
  );
};

export default TalentPicker;
