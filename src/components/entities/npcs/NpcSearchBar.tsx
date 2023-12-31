import React, { useState } from "react";
import { useHistory } from "react-router";
import Filter from "../../../data/Filter";
import ReactDOM from "react-dom";
import { createNewWithId, exportFilteredFromTable } from "../../../services/DatabaseService";

import {
  faLink,
  faSearch,
  faRedoAlt,
  faBook,
  faPlusCircle,
  faFileExport,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconButton from "../../form_elements/IconButton";
import Npc from "../../../data/campaign/Npc";
import StringSearchField from "../../form_elements/StringSearchField";
import { FixedBar, SearchBar, CreateButton, ExportButton, LeftTooltip } from "../../SearchbarStyle";

const NpcSearchBar = () => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<Filter[]>([]);
  let history = useHistory();

  const [name, setName] = useState<string>("");
  const [sources, setSources] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [sort, setSort] = useState<{
    name: string;
    label: string;
    sort: number;
  }>({
    name: "",
    label: "",
    sort: 0,
  });

  const search = () => {
    let newFilters: Filter[] = [];
    if (name !== "") {
      newFilters = [...newFilters, new Filter("name", name)];
    }

    if (description !== "") {
      newFilters = [...newFilters, new Filter("description", description)];
    }
    newFilters = newFilters.map((filter: Filter) => {
      if (sort.name === filter.fieldName) {
        return { ...filter, sort: sort.sort };
      }
      return filter;
    });
    setFilters(newFilters);
    setOpen(false);
    history.push(`/npc-overview?filter=${JSON.stringify(newFilters)}`);
  };

  const reset = () => {
    ReactDOM.unstable_batchedUpdates(() => {
      setName("");
      setDescription("");
      setOpen(false);
      setSort({
        name: "",
        label: "",
        sort: 0,
      });
    });
    history.push(`/npc-overview}`);
  };

  const createNewNpc = () => {
    let newNpc = new Npc();
    delete newNpc.id;
    createNewWithId("npcs", newNpc, (id) => {
      history.push(`/npc-detail/id/${id}`);
    });
  };

  const exportFiltered = () => {
    exportFilteredFromTable("npcs", filters, "SavageTome_filtered_npcs.json");
  };

  return (
    <>
      <FixedBar open={open}>
        <StringSearchField
          value={name}
          sort={sort}
          field={"name"}
          label="Name"
          onChange={(name: string, sort: { name: string; label: string; sort: number }) => {
            setName(name);
            setSort(sort);
          }}
        />
        <StringSearchField
          value={description}
          sort={sort}
          field={"text"}
          label="Text"
          icon={faBook}
          onChange={(name: string, sort: { name: string; label: string; sort: number }) => {
            setDescription(name);
            setSort(sort);
          }}
        />
        <StringSearchField
          value={sources}
          sort={sort}
          field={"sources"}
          label="Sources"
          icon={faLink}
          onChange={(name: string, sort: { name: string; label: string; sort: number }) => {
            setSources(name);
            setSort(sort);
          }}
        />
        <IconButton onClick={() => search()} icon={faSearch} />
        <IconButton onClick={() => reset()} icon={faRedoAlt} />

        <SearchBar onClick={() => setOpen(!open)}>
          <FontAwesomeIcon icon={faSearch} />
        </SearchBar>
      </FixedBar>
      <CreateButton onClick={() => createNewNpc()}>
        <FontAwesomeIcon icon={faPlusCircle} />
        <LeftTooltip>Add new</LeftTooltip>
      </CreateButton>
      <ExportButton onClick={() => exportFiltered()}>
        <FontAwesomeIcon icon={faFileExport} />
        <LeftTooltip>Export filtered</LeftTooltip>
      </ExportButton>
    </>
  );
};

export default NpcSearchBar;
