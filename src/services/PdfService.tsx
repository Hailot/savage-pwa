import { PDFDocument } from "pdf-lib";
import Char from "../data/chars/Char";
import ClassSet from "../data/chars/ClassSet";
import Feature from "../data/classes/Feature";
import FeatureSet from "../data/classes/FeatureSet";
import Spell from "../data/Spell";
import { buildCharacter } from "./CharacterService";

const formatScore = (score: number) => {
  let mod = Math.floor((score - 10) / 2);
  if (score > 9) {
    return "+" + mod;
  }
  return "" + mod;
};

const calcSkill = (skillProf: number, prof: number, stat: number) => {
  return "" + (skillProf * prof + Math.floor((stat - 10) / 2));
};

const fillTemplate = async (template: string | ArrayBuffer, char: Char) => {
  let completeChar = await buildCharacter(char);

  // Load a PDF with form fields
  const pdfDoc = await PDFDocument.load(template);

  // Get the form containing all the fields
  const form = pdfDoc.getForm();

  form.getTextField("CharacterName").setText(char.name);
  form.getTextField("PlayerName").setText(char.player);
  form.getTextField("Alignment").setText(char.alignment);
  form.getTextField("AC").setText("" + char.ac);
  form.getTextField("Initiative").setText("" + char.init);
  form.getTextField("Speed").setText(char.speed);
  form.getTextField("HPMax").setText("" + char.hp);
  form.getTextField("HPCurrent").setText("" + char.currentHp);
  form.getTextField("HD");
  form.getTextField("HDTotal");
  form.getTextField("Background").setText(char.background);
  form.getTextField("XP").setText("Milestone");

  form.getTextField("Race").setText(char.race.race + " (" + char.race.subrace + ")");
  let classes = "";
  char.classes.forEach((classSet: ClassSet) => {
    classes += `${classSet.classe} ${classSet.level} (${classSet.subclasse}), `;
  });
  form.getTextField("ClassLevel").setText(classes);

  form.getTextField("CP").setText("" + char.money.copper);
  form.getTextField("SP").setText("" + char.money.silver);
  form.getTextField("EP").setText("" + char.money.electrum);
  form.getTextField("GP").setText("" + char.money.gold);
  form.getTextField("PP").setText("" + char.money.platinum);

  form.getTextField("STR").setText("" + char.str);
  form.getTextField("STRmod").setText(formatScore(char.str));
  form.getTextField("DEX").setText("" + char.dex);
  form.getTextField("DEXmod").setText(formatScore(char.dex));
  form.getTextField("CON").setText("" + char.con);
  form.getTextField("CONmod").setText(formatScore(char.con));
  form.getTextField("INT").setText("" + char.int);
  form.getTextField("INTmod").setText(formatScore(char.int));
  form.getTextField("WIS").setText("" + char.wis);
  form.getTextField("WISmod").setText(formatScore(char.wis));
  form.getTextField("CHA").setText("" + char.cha);
  form.getTextField("CHAmod").setText(formatScore(char.cha));

  form
    .getTextField("ST Strength")
    .setText(calcSkill(char.saves.strSaveProf, completeChar.prof, char.str));
  if (char.saves.strSaveProf === 1) form.getCheckBox("Check Box 11").check();
  form
    .getTextField("ST Dexterity")
    .setText(calcSkill(char.saves.dexSaveProf, completeChar.prof, char.dex));
  if (char.saves.dexSaveProf === 1) form.getCheckBox("Check Box 18").check();
  form
    .getTextField("ST Constitution")
    .setText(calcSkill(char.saves.conSaveProf, completeChar.prof, char.con));
  if (char.saves.conSaveProf === 1) form.getCheckBox("Check Box 19").check();
  form
    .getTextField("ST Intelligence")
    .setText(calcSkill(char.saves.intSaveProf, completeChar.prof, char.int));
  if (char.saves.intSaveProf === 1) form.getCheckBox("Check Box 20").check();
  form
    .getTextField("ST Wisdom")
    .setText(calcSkill(char.saves.wisSaveProf, completeChar.prof, char.wis));
  if (char.saves.wisSaveProf === 1) form.getCheckBox("Check Box 21").check();
  form
    .getTextField("ST Charisma")
    .setText(calcSkill(char.saves.chaSaveProf, completeChar.prof, char.cha));
  if (char.saves.chaSaveProf === 1) form.getCheckBox("Check Box 22").check();

  form
    .getTextField("Acrobatics")
    .setText(calcSkill(char.skills.acrobaticsProf, completeChar.prof, char.dex));
  if (char.skills.acrobaticsProf > 0) form.getCheckBox("Check Box 23").check();
  form
    .getTextField("Animal")
    .setText(calcSkill(char.skills.animalHandlingProf, completeChar.prof, char.wis));
  if (char.skills.animalHandlingProf > 0) form.getCheckBox("Check Box 24").check();
  form
    .getTextField("Arcana")
    .setText(calcSkill(char.skills.arcanaProf, completeChar.prof, char.int));
  if (char.skills.arcanaProf > 0) form.getCheckBox("Check Box 25").check();
  form
    .getTextField("Athletics")
    .setText(calcSkill(char.skills.athleticsProf, completeChar.prof, char.str));
  if (char.skills.athleticsProf > 0) form.getCheckBox("Check Box 26").check();
  form
    .getTextField("Deception")
    .setText(calcSkill(char.skills.deceptionProf, completeChar.prof, char.cha));
  if (char.skills.deceptionProf > 0) form.getCheckBox("Check Box 27").check();
  form
    .getTextField("History")
    .setText(calcSkill(char.skills.historyProf, completeChar.prof, char.int));
  if (char.skills.historyProf > 0) form.getCheckBox("Check Box 28").check();
  form
    .getTextField("Insight")
    .setText(calcSkill(char.skills.insightProf, completeChar.prof, char.wis));
  if (char.skills.insightProf > 0) form.getCheckBox("Check Box 29").check();
  form
    .getTextField("Intimidation")
    .setText(calcSkill(char.skills.intimidationProf, completeChar.prof, char.cha));
  if (char.skills.intimidationProf > 0) form.getCheckBox("Check Box 30").check();
  form
    .getTextField("Investigation")
    .setText(calcSkill(char.skills.investigationProf, completeChar.prof, char.int));
  if (char.skills.investigationProf > 0) form.getCheckBox("Check Box 31").check();
  form
    .getTextField("Medicine")
    .setText(calcSkill(char.skills.medicineProf, completeChar.prof, char.wis));
  if (char.skills.medicineProf > 0) form.getCheckBox("Check Box 32").check();
  form
    .getTextField("Nature")
    .setText(calcSkill(char.skills.natureProf, completeChar.prof, char.int));
  if (char.skills.natureProf > 0) form.getCheckBox("Check Box 33").check();
  form
    .getTextField("Perception")
    .setText(calcSkill(char.skills.perceptionProf, completeChar.prof, char.wis));
  if (char.skills.perceptionProf > 0) form.getCheckBox("Check Box 34").check();
  form
    .getTextField("Performance")
    .setText(calcSkill(char.skills.performanceProf, completeChar.prof, char.cha));
  if (char.skills.performanceProf > 0) form.getCheckBox("Check Box 35").check();
  form
    .getTextField("Persuasion")
    .setText(calcSkill(char.skills.persuasionProf, completeChar.prof, char.cha));
  if (char.skills.persuasionProf > 0) form.getCheckBox("Check Box 36").check();
  form
    .getTextField("Religion")
    .setText(calcSkill(char.skills.religionProf, completeChar.prof, char.int));
  if (char.skills.religionProf > 0) form.getCheckBox("Check Box 37").check();
  form
    .getTextField("SleightofHand")
    .setText(calcSkill(char.skills.sleightOfHandProf, completeChar.prof, char.dex));
  if (char.skills.sleightOfHandProf > 0) form.getCheckBox("Check Box 38").check();
  form
    .getTextField("Stealth")
    .setText(calcSkill(char.skills.stealthProf, completeChar.prof, char.dex));
  if (char.skills.stealthProf > 0) form.getCheckBox("Check Box 39").check();
  form
    .getTextField("Survival")
    .setText(calcSkill(char.skills.survivalProf, completeChar.prof, char.wis));
  if (char.skills.survivalProf > 0) form.getCheckBox("Check Box 40").check();

  form.getTextField("Treasure");

  let equipments: string = "";
  char.items.forEach(
    (item: { origin: string; attuned: boolean; prof: boolean; attribute: string }) => {
      equipments += item.origin + ", ";
    }
  );
  form.getTextField("Equipment").setText(equipments);

  let featureText = "";
  let feature2Text = "";
  completeChar.classFeatures.forEach((features: FeatureSet) => {
    features.features.forEach((featur: Feature) => {
      if (featur.type.toString() !== "normal") {
        feature2Text += featur.type + " - " + featur.name + "\n";
      } else {
        featureText += featur.type + " - " + featur.name + "\n";
      }
    });
  });
  form.getTextField("Feat+Traits").setText(featureText);
  form.getTextField("Features and Traits").setText(feature2Text);

  form.getTextField("SpellSaveDC  2").setText("" + char.castingDC);
  form.getTextField("SpellAtkBonus 2").setText("" + char.castingHit);
  form.getTextField("SpellcastingAbility 2");
  form.getTextField("Spellcasting Class 2");

  let count = 0;
  completeChar.items.forEach((item) => {
    if (count <= 3 && item.base !== undefined) {
      count++;
      const bonus = Math.floor((char[item.attribute] - 10) / 2);
      form.getTextField(`Wpn Name ${count}`).setText(item.item.name);
      form
        .getTextField(`Wpn${count} AtkBonus`)
        .setText(`+ ${bonus + (item.prof ? completeChar.prof : 0) + item.item.magicBonus}`);
      form
        .getTextField(`Wpn${count} Damage`)
        .setText(`${item.base.damage} +${item.item.magicBonus + bonus}`);
    }
  });
  if (count <= 3) {
    completeChar.gears.forEach((gear) => {
      if (count <= 3 && gear.gear.damage !== "") {
        count++;
        const strBonus = Math.floor((char.str - 10) / 2);
        const dexBonus = Math.floor((char.dex - 10) / 2);
        if (gear.gear.properties.toLocaleLowerCase().includes("finesse")) {
          form.getTextField(`Wpn Name ${count}`).setText(gear.gear.name);
          form.getTextField(`Wpn${count} AtkBonus`).setText(
            `${strBonus > dexBonus ? `+${strBonus + completeChar.prof}` : ""}
            ${dexBonus > strBonus ? `+${dexBonus + completeChar.prof}` : ""}`
          );
          form.getTextField(`Wpn${count} Damage`).setText(gear.gear.damage);
        } else {
          form.getTextField(`Wpn Name ${count}`).setText(gear.gear.name);
          form.getTextField(`Wpn${count} AtkBonus`).setText(`+ ${strBonus + completeChar.prof}`);
          form.getTextField(`Wpn${count} Damage`).setText(gear.gear.damage);
        }
      }
    });
  }

  let spellFieldNumbers = [
    [1014, 1016, 1017, 1018, 1019, 1020, 1021, 1022],
    [1015, 1023, 1024, 1025, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033],
    [1046, 1034, 1035, 1036, 1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044, 1045],
    [1048, 1047, 1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059],
    [1061, 1060, 1062, 1063, 1064, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 1072],
    [1074, 1073, 1075, 1076, 1077, 1078, 1079, 1080, 1081],
    [1083, 1082, 1084, 1085, 1086, 1087, 1088, 1089, 1090],
    [1092, 1091, 1093, 1094, 1095, 1096, 1097, 1098, 1099],
    [10101, 10100, 10102, 10103, 10104, 10105, 10106],
    [10108, 10107, 10109, 101010, 101011, 101012, 101013],
  ];
  completeChar.spells.forEach((spell: { origin: Spell; prepared: boolean }) => {
    if (spellFieldNumbers[spell.origin.level].length > 0) {
      form
        .getTextField(`Spells ${spellFieldNumbers[spell.origin.level][0]}`)
        .setText(spell.origin.name);
      spellFieldNumbers[spell.origin.level].slice(1);
    }
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  return pdfDoc.save();
};

const downloadFilledPdf = (pdfBytes: Uint8Array, filename: string) => {
  let contentType = "application/pdf;charset=utf-8;";
  const blob = new Blob([pdfBytes], { type: contentType });

  var pdfURL = window.URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.download = filename;
  a.href = pdfURL;
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const exportPdf = async (char: Char) => {
  const template =

  fillTemplate(template, char).then((filledArray) => {
    downloadFilledPdf(filledArray, char.name + ".pdf");
  });
};