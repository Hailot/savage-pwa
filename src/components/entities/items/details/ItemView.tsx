import React, { useCallback, useState, useEffect } from "react";
import Item from "../../../../data/Item";
import Gear from "../../../../data/Gear";
import { reciveAllFiltered } from "../../../../services/DatabaseService";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import FormatedText from "../../../general_elements/FormatedText";
import TextButton from "../../../form_elements/TextButton";
import P2PSender from "../../../p2p/P2PSender";
import { useWebhook } from "../../../../hooks/webhookHook";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { formatDiscordText, sendEmbedMessage } from "../../../../services/DiscordService";

interface $Props {
  item: Item;
}

const ItemView = ({ item }: $Props) => {
  let webhook = useWebhook();
  const [json, setJson] = useState<string>("");
  const [send, setSend] = useState<boolean>(false);
  const [itemBase, setItemBase] = useState<Gear>();

  useEffect(() => {
    if (webhook !== undefined) {
      let newText = formatDiscordText(item.description);
      if (newText.length >= 1024) {
        newText = newText.substring(0, 1021) + "...";
      }
      let newJson = {
        username: webhook.name + " (SavageTome)",
        embeds: [
          {
            author: {
              name: item.name,
              icon_url: item.pic,
            },
            fields: [
              {
                name: "Bonus",
                value: item.magicBonus ? item.magicBonus : "-",
                inline: true,
              },
              {
                name: "Rarity",
                value: item.rarity ? item.rarity : "-",
                inline: true,
              },
              {
                name: "Type",
                value: item.type ? item.type : "-",
                inline: true,
              },
              {
                name: "Base",
                value: item.base ? item.base : "-",
                inline: true,
              },
              {
                name: "Damage",
                value: itemBase && itemBase.damage ? itemBase.damage : "-",
                inline: true,
              },
              {
                name: "Properties",
                value: itemBase && itemBase.properties ? itemBase.properties : "-",
                inline: true,
              },
              {
                name: "Text",
                value: newText,
              },
            ],
          },
        ],
      };

      setJson(JSON.stringify(newJson));
    }
  }, [item, webhook, itemBase]);

  useEffect(() => {
    let [name, sources] = item.base.split("|");
    reciveAllFiltered(
      "gears",
      [
        { fieldName: "name", value: name, sort: 0 },
        { fieldName: "sources", value: sources, sort: 0 },
      ],
      (results: any[]) => {
        setItemBase(results[0]);
      }
    );
  }, [item]);

  const hasAttunment = useCallback(() => {
    if (item !== undefined) {
      if (!!item.attunment) {
        return <div className="icon">A</div>;
      }
    }
    return "";
  }, [item]);

  const getPicture = useCallback(() => {
    if (item !== undefined) {
      if (item.picBase64 !== "" && item.picBase64 !== null && item.picBase64 !== undefined) {
        return item.picBase64;
      } else if (item.pic !== "" && item.pic !== null && item.pic !== undefined) {
        return item.pic;
      }
    }
    return "";
  }, [item]);

  return (
    <CenterWrapper>
      <View>
        <Rarity rarity={item.rarity}>{item.rarity}</Rarity>

        <Flag>
          <b>{hasAttunment()}</b>
        </Flag>

        {getPicture() !== "" ? (
          <ImageName>
            <Image pic={getPicture()}></Image>
            <b>{item.name}</b>
          </ImageName>
        ) : (
          <Name>
            <b>{item.name}</b>
          </Name>
        )}

        <PropWrapper>
          <Prop>{item.type}</Prop>
          <Prop>+{item.magicBonus}</Prop>
          <Prop>
            <Icon icon={faLink} />
            {item.sources}
          </Prop>
          {item.base && itemBase && (
            <>
              <Prop>{item.base}</Prop>
              <Prop>{itemBase.damage}</Prop>
              <Prop>{itemBase.properties}</Prop>
            </>
          )}
          <Text>
            <FormatedText text={item.description} />
          </Text>
        </PropWrapper>
        {webhook !== undefined && (
          <PropWrapper>
            <TextButton
              style={{
                backgroundColor: "#7289da",
              }}
              text={`Show ${item.name}`}
              icon={faDiscord}
              onClick={() => sendEmbedMessage(webhook, json)}
            />
          </PropWrapper>
        )}
        <PropWrapper>
          {!send && (
            <TextButton
              text={`Send ${item.name}`}
              icon={faPaperPlane}
              onClick={() => setSend(true)}
            />
          )}
          {!!send && <P2PSender data={item} mode={"THIS"} />}
        </PropWrapper>
      </View>
    </CenterWrapper>
  );
};

export default ItemView;

const CenterWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
`;

const View = styled.div`
  color: ${({ theme }) => theme.tile.color};
  font-size: 16px;
  max-width: 800px;
  padding: 5px;
  margin-left: auto;
  margin-right: auto;
`;

type RarityType = {
  rarity?: string;
};

const Rarity = styled.div<RarityType>`
  height: auto;
  float: left;
  padding: 5px 10px 7px 10px;
  line-height: 30px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.tile.backgroundColor};
  color: ${(props) => {
    const rarity = props.rarity?.toLowerCase().trim();
    if (rarity === "artifact") {
      return "#f74646";
    } else if (rarity === "legendary") {
      return "#f7ce46";
    } else if (rarity === "very rare") {
      return "#8000ff";
    } else if (rarity === "rare") {
      return "#4675f7";
    } else if (rarity === "uncommon") {
      return "#4dbd56";
    } else {
      return "inherit";
    }
  }};
`;

const Name = styled.div`
  height: auto;
  float: left;
  padding: 10px;
  margin: 5px 5px 10px 5px;
  width: calc(100% - 30px);
  color: var(--card-title-color);
  text-align: center;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.tile.backgroundColor};
`;

const ImageName = styled.div`
  height: 30px;
  float: left;
  padding: 10px;
  margin: 5px 5px 10px 5px;
  width: calc(100% - 30px);
  color: var(--card-title-color);
  text-align: center;
  border-radius: 50px 5px 5px 50px;
  background-color: ${({ theme }) => theme.tile.backgroundColor};
`;

const PropWrapper = styled.div`
  height: auto;
  width: calc(100% - 6px);
  float: left;
  padding: 3px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const Prop = styled.div`
  flex: 1 1 auto;
  max-width: 100%;
  height: auto;
  margin: 2px;
  float: left;
  padding: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.tile.backgroundColor};
`;

const Text = styled.div`
  height: auto;
  width: calc(100% - 30px);
  margin: 10px 5px 5px 5px;
  float: left;
  line-height: 18px;
  padding: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.tile.backgroundColor};
`;

const Flag = styled.div`
  height: auto;
  float: left;
  padding: 5px 10px 7px 10px;
  margin-left: 5px;
  font-size: 12px;
  line-height: 30px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.tile.backgroundColor};
`;

const Icon = styled(FontAwesomeIcon)`
  margin-right: 5px;
  width: 20px;
  height: auto;
  border-radius: 150px;
  transition: color 0.2s;
  color: ${({ theme }) => theme.main.highlight};
`;

interface $ImageProps {
  pic: string;
}

const Image = ({ pic }: $ImageProps) => {
  const style = {
    backgroundImage: `url('${pic}')`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  if (pic !== "") {
    return <ImageElm style={style}></ImageElm>;
  } else {
    return <Empty />;
  }
};

const ImageElm = styled.div`
  margin: -10px 5px -10px -10px;
  height: 47px;
  width: 47px;
  float: left;
  border-radius: 100px;
  border: 3px solid ${({ theme }) => theme.main.highlight};
  background-color: white;
  overflow: hidden;
`;
const Empty = styled.div``;
