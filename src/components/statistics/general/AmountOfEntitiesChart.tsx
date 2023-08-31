import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Doughnut } from "@iftek/react-chartjs-3";
import { reciveCountPromise } from "../../../services/DatabaseService";
import { LocalLoadingSpinner } from "../../Loading";

const AmountOfEntitiesChart = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [generalCounts, setGeneralCounts] = useState<{
    labels: string[];
    datasets: { data: number[]; backgroundColor: string[] }[];
  }>();

  useEffect(() => {
    makeGeneralCountsData();
  }, []);

  const makeGeneralCountsData = async () => {
    let promList: { name: string; count: number }[] = [];
    promList.push({
      name: "spells",
      count: await reciveCountPromise("spells"),
    });
    promList.push({ name: "gears", count: await reciveCountPromise("gears") });
    promList.push({ name: "items", count: await reciveCountPromise("items") });
    promList.push({
      name: "monsters",
      count: await reciveCountPromise("monsters"),
    });
    promList.push({ name: "races", count: await reciveCountPromise("races") });
    promList.push({
      name: "subraces",
      count: await reciveCountPromise("subraces"),
    });
    promList.push({
      name: "classes",
      count: await reciveCountPromise("classes"),
    });
    promList.push({
      name: "subclasses",
      count: await reciveCountPromise("subclasses"),
    });

    let names: string[] = [];
    let counts: number[] = [];
    let colors: string[] = [];
    promList.forEach((count) => {
      names.push(count.name);
      counts.push(count.count);
      colors.push("#" + Math.floor(Math.random() * 16777215).toString(16));
    });
    setGeneralCounts({
      labels: names,
      datasets: [
        {
          data: counts,
          backgroundColor: colors,
        },
      ],
    });
    setLoading(false);
  };

  return (
    <OptionSection>
      <SelectionTitle>Amount of Entities</SelectionTitle>
      {!loading && generalCounts !== undefined && (
        <div style={{ width: "100%", paddingBottom: "10px" }}>
          <Doughnut data={generalCounts} />
        </div>
      )}
      {loading && <LocalLoadingSpinner />}
    </OptionSection>
  );
};

export default AmountOfEntitiesChart;

const OptionSection = styled.div`
  flex: 1 1 20em;
  width: calc(100% - 1em);
  max-width: 400px;
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
