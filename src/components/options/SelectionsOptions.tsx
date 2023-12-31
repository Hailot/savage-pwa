import React, { useState } from "react";
import styled from "styled-components";

import {
  faFileExport,
  faPaperPlane,
  faTrashAlt,
  faUserCog,
} from "@fortawesome/free-solid-svg-icons";
import { exportAllFromTable } from "../../services/OptionService";
import IconButton from "../form_elements/IconButton";
import P2PSender from "../p2p/P2PSender";
import TextButton from "../form_elements/TextButton";
import Selection from "../../data/Selection";
import { deleteAll, reciveAllPromise, resaveFromList } from "../../services/DatabaseService";

interface $Props {
  amount: number;
  isReload: (val: boolean) => void;
  triggerDeleteAll: (tableName: string) => void;
}

const SelectionsOptions = ({ amount, isReload, triggerDeleteAll }: $Props) => {
  const [send, setSend] = useState<boolean>(false);

  const triggerRegroupAll = async () => {
    let newSelections: Selection[] = [];
    let selections: Selection[] = await reciveAllPromise("selections");
    selections.forEach((selection) => {
      let sels = newSelections.filter((ns) => ns.name === selection.name);
      if (sels.length > 0) {
        sels[0].selectionOptions = [...sels[0].selectionOptions, ...selection.selectionOptions];
      } else {
        newSelections.push(selection);
      }
    });
    deleteAll("selections");
    resaveFromList("selections", newSelections);
    isReload(true);
  };

  return (
    <OptionTab>
      <OptionSection>
        <SelectionTitle>Export</SelectionTitle>
        <SectionRow>
          <SectionText>Export all Selections?</SectionText>
          <IconButton
            icon={faFileExport}
            onClick={() => exportAllFromTable("selections", "SavageTome_selections.json")}
          />
        </SectionRow>
      </OptionSection>
      <OptionSection>
        <SelectionTitle>Delete</SelectionTitle>
        <SectionRow>
          <SectionText>Delete all {amount} Selections?</SectionText>
          <IconButton icon={faTrashAlt} onClick={() => triggerDeleteAll("selections")} />
        </SectionRow>
      </OptionSection>
      <OptionSection>
        <SelectionTitle>Regroup</SelectionTitle>
        <SectionRow>
          <SectionText>Regroup all {amount} Selections?</SectionText>
          <IconButton icon={faUserCog} onClick={() => triggerRegroupAll()} />
        </SectionRow>
      </OptionSection>
      <OptionSection>
        {!send && (
          <TextButton
            text={`Send all selections`}
            icon={faPaperPlane}
            onClick={() => setSend(true)}
          />
        )}
        {!!send && <P2PSender data={"selections"} mode={"ALL"} />}
      </OptionSection>
    </OptionTab>
  );
};

export default SelectionsOptions;

const General = styled.div`
  flex: 1 1 auto;

  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
`;

const OptionTab = styled(General)`
  flex: 1 1 auto;
`;

const OptionSection = styled(General)`
  flex: 1 1 auto;
  color: ${({ theme }) => theme.tile.color};
  background-color: ${({ theme }) => theme.tile.backgroundColor};
  margin: 0.5em;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.tile.boxShadow};
  overflow: hidden;

  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
`;

const SelectionTitle = styled.div`
  flex: 1 1 auto;
  padding: 5px;
  margin: 5px;
  min-width: calc(100% - 20px);
  font-weight: bold;
  text-algin: center;
  border-radius: 5px;
  color: ${({ theme }) => theme.input.color};
  background-color: ${({ theme }) => theme.input.backgroundColor};
`;

const SectionRow = styled.div`
  flex: 1 1 auto;
  margin: 5px;
  min-width: calc(100% - 10px);

  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: flex-start;
`;

const SectionText = styled.div`
  flex: 1 1 auto;
`;
