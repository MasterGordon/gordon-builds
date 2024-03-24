import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { configDotenv } from "dotenv";
import path from "path/posix";
import { ConstantQuery } from "../__generated__/graphql";
import fs from "fs";

const env = configDotenv({
  path: path.resolve(__dirname, "../../.env.local"),
}) as { [key: string]: string };

const removeTypenameRecursive = (value: any): any => {
  if (!value || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((v) => removeTypenameRecursive(v));
  }
  const newObj: { [key: string]: any } = {};
  Object.entries(value).forEach(([key, v]) => {
    if (key === "__typename") {
      return;
    }
    newObj[key] = removeTypenameRecursive(v);
  });
  return newObj;
};

const main = async () => {
  const client = new ApolloClient({
    uri: "https://api.stratz.com/graphql",
    headers: {
      Authorization: `Bearer ${
        process.env.STRAZT_API_KEY || env.STRAZT_API_KEY
      }`,
    },
    cache: new InMemoryCache(),
  });
  const res = await client.query({
    query: gql(`
      {
        constants {
          gameVersions {
            id
            name
            asOfDateTime
          }
          items {
            id
            name
            displayName
            shortName
            isSupportFullItem
            language {
              displayName
              description
              lore
              notes
              attributes
            }
            stat {
              behavior
              unitTargetType
              unitTargetTeam
              unitTargetFlags
              fightRecapLevel
              castRange
              castPoint
              manaCost
              channelTime
              sharedCooldown
              cost
              shopTags
              aliases
              quality
              isSellable
              isDroppable
              isPurchasable
              isSideShop
              isStackable
              isPermanent
              isHideCharges
              isRequiresCharges
              isDisplayCharges
              isSupport
              isAlertable
              isTempestDoubleClonable
              stockMax
              initialCharges
              initialStock
              stockTime
              initialStockTime
              isRecipe
              needsComponents
              upgradeItem
              upgradeRecipe
              itemResult
              neutralItemDropTime
              neutralItemTier
            }
            attributes {
              name
              value
            }
            components {
              index
              componentId
            }
            image
          }
          heroes {
            id
            name
            displayName
            shortName
            aliases
            gameVersionId
            abilities {
              slot
              gameVersionId
              abilityId
              ability {
                id
                name
                uri
                language {
                  displayName
                  description
                  attributes
                  lore
                  aghanimDescription
                  shardDescription
                  notes
                }
                stat {
                  abilityId
                  type
                  behavior
                  unitTargetType
                  unitTargetTeam
                  unitTargetFlags
                  unitDamageType
                  spellImmunity
                  modifierSupportValue
                  modifierSupportBonus
                  isOnCastbar
                  isOnLearnbar
                  fightRecapLevel
                  isGrantedByScepter
                  hasScepterUpgrade
                  maxLevel
                  levelsBetweenUpgrades
                  requiredLevel
                  hotKeyOverride
                  displayAdditionalHeroes
                  castRange
                  castPoint
                  channelTime
                  cooldown
                  damage
                  manaCost
                  isUltimate
                  duration
                  charges
                  chargeRestoreTime
                  hasShardUpgrade
                  isGrantedByShard
                  dispellable
                  linkedAbilityId
                }
                attributes {
                  name
                  value
                  linkedSpecialBonusAbilityId
                  requiresScepter
                }
                isTalent
              }
            }
            roles {
              roleId
              level
            }
            language {
              displayName
              lore
              hype
            }
            talents {
              abilityId
              slot
            }
            stats {
              enabled
              heroUnlockOrder
              team
              cMEnabled
              newPlayerEnabled
              attackType
              startingArmor
              startingMagicArmor
              startingDamageMin
              startingDamageMax
              attackRate
              attackAnimationPoint
              attackAcquisitionRange
              attackRange
              primaryAttribute
              strengthBase
              strengthGain
              intelligenceBase
              intelligenceGain
              agilityBase
              agilityGain
              hpRegen
              mpRegen
              moveSpeed
              moveTurnRate
              hpBarOffset
              visionDaytimeRange
              visionNighttimeRange
              complexity
              primaryAttributeEnum
            }
          }
        }
      }

`),
  });
  const constants = res.data as ConstantQuery;
  const pureConstants = removeTypenameRecursive(constants);
  fs.mkdirSync(path.resolve(__dirname, "../__generated__/data"), {
    recursive: true,
  });
  fs.writeFileSync(
    path.resolve(__dirname, "../__generated__/data/constants.json"),
    JSON.stringify(pureConstants, null, 2)
  );
};

main();
