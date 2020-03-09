import * as moment from 'moment';

export class Timezonelist {
  // static ZoneList:any[]=
  //       [
  //           {
  //             "Abbreviation": "A",
  //             "Name": "Alpha Time Zone",
  //             "GMT": "GMT+1:00",
  //             "Offset": "1 hours"
  //           },
  //           {
  //             "Abbreviation": "ACDT",
  //             "Name": "Australian Central Daylight Time",
  //             "GMT": "GMT+10:30",
  //             "Offset": "10:30 hours"
  //           },
  //           {
  //             "Abbreviation": "ACST",
  //             "Name": "Australian Central Standard Time",
  //             "GMT": "GMT+9:30",
  //             "Offset": "9:30 hours"
  //           },
  //           {
  //             "Abbreviation": "ADT",
  //             "Name": "Atlantic Daylight Time",
  //             "GMT": "GMT-3",
  //             "Offset": "-3 hours"
  //           },
  //           {
  //             "Abbreviation": "ADT",
  //             "Name": "Atlantic Daylight Time",
  //             "GMT": "GMT-3",
  //             "Offset": "-3 hours"
  //           },
  //           {
  //             "Abbreviation": "AEDT",
  //             "Name": "Australian Eastern Daylight Time",
  //             "GMT": "GMT+11",
  //             "Offset": "11 hours"
  //           },
  //           {
  //             "Abbreviation": "AEST",
  //             "Name": "Australian Eastern Standard Time",
  //             "GMT": "GMT+10",
  //             "Offset": "10 hours"
  //           },
  //           {
  //             "Abbreviation": "AFT",
  //             "Name": "Afghanistan Time",
  //             "GMT": "GMT+4:30",
  //             "Offset": "4:30 hours"
  //           },
  //           {
  //             "Abbreviation": "AKDT",
  //             "Name": "Alaska Daylight Time",
  //             "GMT": "GMT-8",
  //             "Offset": "-8 hours"
  //           },
  //           {
  //             "Abbreviation": "AKST",
  //             "Name": "Alaska Standard Time",
  //             "GMT": "GMT-9",
  //             "Offset": "-9 hours"
  //           },
  //           {
  //             "Abbreviation": "ALMT",
  //             "Name": "Alma-Ata Time",
  //             "GMT": "GMT+6",
  //             "Offset": "6 hours"
  //           },
  //           {
  //             "Abbreviation": "AMST",
  //             "Name": "Armenia Summer Time",
  //             "GMT": "GMT+5",
  //             "Offset": "5 hours"
  //           },
  //           {
  //             "Abbreviation": "AMST",
  //             "Name": "Amazon Summer Time",
  //             "GMT": "GMT-3",
  //             "Offset": "-3 hours"
  //           },
  //           {
  //             "Abbreviation": "AMT",
  //             "Name": "Armenia Time",
  //             "GMT": "GMT+4",
  //             "Offset": "4 hours"
  //           },
  //           {
  //             "Abbreviation": "AMT",
  //             "Name": "Amazon Time",
  //             "GMT": "GMT-4",
  //             "Offset": "-4 hours"
  //           },
  //           {
  //             "Abbreviation": "ANAST",
  //             "Name": "Anadyr Summer Time",
  //             "GMT": "GMT+12",
  //             "Offset": "12 hours"
  //           },
  //           {
  //             "Abbreviation": "ANAT",
  //             "Name": "Anadyr Time",
  //             "GMT": "GMT+12",
  //             "Offset": "12 hours"
  //           },
  //           {
  //             "Abbreviation": "AQTT",
  //             "Name": "Aqtobe Time",
  //             "GMT": "GMT+5",
  //             "Offset": "5 hours"
  //           },
  //           {
  //             "Abbreviation": "ART",
  //             "Name": "Argentina Time",
  //             "GMT": "GMT-3",
  //             "Offset": "-3 hours"
  //           },
  //           {
  //             "Abbreviation": "AST",
  //             "Name": "Arabia Standard Time",
  //             "GMT": "GMT+3",
  //             "Offset": "3 hours"
  //           },
  //           {
  //             "Abbreviation": "AST",
  //             "Name": "Atlantic Standard Time",
  //             "GMT": "GMT-4",
  //             "Offset": "-4 hours"
  //           },
  //           {
  //             "Abbreviation": "AWDT",
  //             "Name": "Australian Western Daylight Time",
  //             "GMT": "GMT+9",
  //             "Offset": "9 hours"
  //           },
  //           {
  //             "Abbreviation": "AWST",
  //             "Name": "Australian Western Standard Time",
  //             "GMT": "GMT+8",
  //             "Offset": "8 hours"
  //           },
  //           {
  //             "Abbreviation": "AZOST",
  //             "Name": "Azores Summer Time",
  //             "GMT": "GMT",
  //             "Offset": "0 hours"
  //           },
  //           {
  //             "Abbreviation": "AZOT",
  //             "Name": "Azores Time",
  //             "GMT": "GMT-1",
  //             "Offset": "-1 hours"
  //           },
  //           {
  //             "Abbreviation": "AZST",
  //             "Name": "Azerbaijan Summer Time",
  //             "GMT": "GMT+5",
  //             "Offset": "5 hours"
  //           },
  //           {
  //             "Abbreviation": "AZT",
  //             "Name": "Azerbaijan Time",
  //             "GMT": "GMT+4",
  //             "Offset": "4 hours"
  //           },
  //           {
  //             "Abbreviation": "B",
  //             "Name": "Bravo Time Zone",
  //             "GMT": "GMT+2",
  //             "Offset": "2 hours"
  //           },
  //           {
  //             "Abbreviation": "BNT",
  //             "Name": "Brunei Darussalam Time",
  //             "GMT": "GMT+8",
  //             "Offset": "8 hours"
  //           },
  //           {
  //             "Abbreviation": "BOT",
  //             "Name": "Bolivia Time",
  //             "GMT": "GMT-4",
  //             "Offset": "-4 hours"
  //           },
  //           {
  //             "Abbreviation": "BRST",
  //             "Name": "Brasilia Summer Time",
  //             "GMT": "GMT-2",
  //             "Offset": "-2 hours"
  //           },
  //           {
  //             "Abbreviation": "BRT",
  //             "Name": "Brasília time",
  //             "GMT": "GMT-3",
  //             "Offset": "-3 hours"
  //           },
  //           {
  //             "Abbreviation": "BST",
  //             "Name": "Bangladesh Standard Time",
  //             "GMT": "GMT+6",
  //             "Offset": "6 hours"
  //           },
  //           {
  //             "Abbreviation": "BST",
  //             "Name": "British Summer Time",
  //             "GMT": "GMT+1",
  //             "Offset": "1 hours"
  //           },
  //           {
  //             "Abbreviation": "BTT",
  //             "Name": "Bhutan Time",
  //             "GMT": "GMT+6",
  //             "Offset": "6 hours"
  //           },
  //           {
  //             "Abbreviation": "C",
  //             "Name": "Charlie Time Zone",
  //             "GMT": "GMT+3",
  //             "Offset": "3 hours"
  //           },
  //           {
  //             "Abbreviation": "CAST",
  //             "Name": "Casey Time",
  //             "GMT": "GMT+8",
  //             "Offset": "8 hours"
  //           },
  //           {
  //             "Abbreviation": "CAT",
  //             "Name": "Central Africa Time",
  //             "GMT": "GMT+2",
  //             "Offset": "2 hours"
  //           },
  //           {
  //             "Abbreviation": "CCT",
  //             "Name": "Cocos Islands Time",
  //             "GMT": "GMT+6:30",
  //             "Offset": "6:30 hours"
  //           },
  //           {
  //             "Abbreviation": "CDT",
  //             "Name": "Cuba Daylight Time",
  //             "GMT": "GMT-4",
  //             "Offset": "-4 hours"
  //           },
  //           {
  //             "Abbreviation": "CDT",
  //             "Name": "Central Daylight Time",
  //             "GMT": "GMT-5",
  //             "Offset": "-5 hours"
  //           },
  //           {
  //             "Abbreviation": "CEST",
  //             "Name": "Central European Summer Time",
  //             "GMT": "GMT+2",
  //             "Offset": "2 hours"
  //           },
  //           {
  //             "Abbreviation": "CET",
  //             "Name": "Central European Time",
  //             "GMT": "GMT+1",
  //             "Offset": "1 hours"
  //           },
  //           {
  //             "Abbreviation": "CHADT",
  //             "Name": "Chatham Island Daylight Time",
  //             "GMT": "GMT+13:45",
  //             "Offset": "13:45 hours"
  //           },
  //           {
  //             "Abbreviation": "CHAST",
  //             "Name": "Chatham Island Standard Time",
  //             "GMT": "GMT+12:45",
  //             "Offset": "12:45 hours"
  //           },
  //           {
  //             "Abbreviation": "CKT",
  //             "Name": "Cook Island Time",
  //             "GMT": "GMT-10",
  //             "Offset": "-10 hours"
  //           },
  //           {
  //             "Abbreviation": "CLST",
  //             "Name": "Chile Summer Time",
  //             "GMT": "GMT-3",
  //             "Offset": "-3 hours"
  //           },
  //           {
  //             "Abbreviation": "CLT",
  //             "Name": "Chile Standard Time",
  //             "GMT": "GMT-4",
  //             "Offset": "-4 hours"
  //           },
  //           {
  //             "Abbreviation": "COT",
  //             "Name": "Colombia Time",
  //             "GMT": "GMT-5",
  //             "Offset": "-5 hours"
  //           },
  //           {
  //             "Abbreviation": "CST",
  //             "Name": "China Standard Time",
  //             "GMT": "GMT+8",
  //             "Offset": "8 hours"
  //           },
  //           {
  //             "Abbreviation": "CST",
  //             "Name": "Central Standard Time",
  //             "GMT": "GMT-6",
  //             "Offset": "-6 hours"
  //           },
  //           {
  //             "Abbreviation": "CST",
  //             "Name": "Cuba Standard Time",
  //             "GMT": "GMT-5",
  //             "Offset": "-5 hours"
  //           },
  //           {
  //             "Abbreviation": "CVT",
  //             "Name": "Cape Verde Time",
  //             "GMT": "GMT-1",
  //             "Offset": "-1 hours"
  //           },
  //           {
  //             "Abbreviation": "CXT",
  //             "Name": "Christmas Island Time",
  //             "GMT": "GMT+7",
  //             "Offset": "7 hours"
  //           },
  //           {
  //             "Abbreviation": "ChST",
  //             "Name": "Chamorro Standard Time",
  //             "GMT": "GMT+10",
  //             "Offset": "10 hours"
  //           },
  //           {
  //             "Abbreviation": "D",
  //             "Name": "Delta Time Zone",
  //             "GMT": "GMT+4",
  //             "Offset": "4 hours"
  //           },
  //           {
  //             "Abbreviation": "DAVT",
  //             "Name": "Davis Time",
  //             "GMT": "GMT+7",
  //             "Offset": "7 hours"
  //           },
  //           {
  //             "Abbreviation": "E",
  //             "Name": "Echo Time Zone",
  //             "GMT": "GMT+5",
  //             "Offset": "5 hours"
  //           },
  //           {
  //             "Abbreviation": "EASST",
  //             "Name": "Easter Island Summer Time",
  //             "GMT": "GMT-5",
  //             "Offset": "-5 hours"
  //           },
  //           {
  //             "Abbreviation": "EAST",
  //             "Name": "Easter Island Standard Time",
  //             "GMT": "GMT-6",
  //             "Offset": "-6 hours"
  //           },
  //           {
  //             "Abbreviation": "EAT",
  //             "Name": "Eastern Africa Time",
  //             "GMT": "GMT+3",
  //             "Offset": "3 hours"
  //           },
  //           {
  //             "Abbreviation": "EAT",
  //             "Name": "East Africa Time",
  //             "GMT": "GMT+3",
  //             "Offset": "3 hours"
  //           },
  //           {
  //             "Abbreviation": "ECT",
  //             "Name": "Ecuador Time",
  //             "GMT": "GMT-5",
  //             "Offset": "-5 hours"
  //           },
  //           {
  //             "Abbreviation": "EDT",
  //             "Name": "Eastern Daylight Time",
  //             "GMT": "GMT-4",
  //             "Offset": "-4 hours"
  //           },
  //           {
  //             "Abbreviation": "EEST",
  //             "Name": "Eastern European Summer Time",
  //             "GMT": "GMT+3",
  //             "Offset": "3 hours"
  //           },
  //           {
  //             "Abbreviation": "EET",
  //             "Name": "Eastern European Time",
  //             "GMT": "GMT+2",
  //             "Offset": "2 hours"
  //           },
  //           {
  //             "Abbreviation": "EGST",
  //             "Name": "Eastern Greenland Summer Time",
  //             "GMT": "GMT",
  //             "Offset": "0 hours"
  //           },
  //           {
  //             "Abbreviation": "EGT",
  //             "Name": "East Greenland Time",
  //             "GMT": "GMT-1",
  //             "Offset": "-1 hours"
  //           },
  //           {
  //             "Abbreviation": "EST",
  //             "Name": "Eastern Standard Time",
  //             "GMT": "GMT-5",
  //             "Offset": "-5 hours"
  //           },
  //           {
  //             "Abbreviation": "ET",
  //             "Name": "Tiempo del Este",
  //             "GMT": "GMT-5",
  //             "Offset": "-5 hours"
  //           },
  //           {
  //             "Abbreviation": "F",
  //             "Name": "Foxtrot Time Zone",
  //             "GMT": "GMT+6",
  //             "Offset": "6 hours"
  //           },
  //           {
  //             "Abbreviation": "FJST",
  //             "Name": "Fiji Summer Time",
  //             "GMT": "GMT+13",
  //             "Offset": "13 hours"
  //           },
  //           {
  //             "Abbreviation": "FJT",
  //             "Name": "Fiji Time",
  //             "GMT": "GMT+12",
  //             "Offset": "12 hours"
  //           },
  //           {
  //             "Abbreviation": "FKST",
  //             "Name": "Falkland Islands Summer Time",
  //             "GMT": "GMT-3",
  //             "Offset": "-3 hours"
  //           },
  //           {
  //             "Abbreviation": "FKT",
  //             "Name": "Falkland Island Time",
  //             "GMT": "GMT-4",
  //             "Offset": "-4 hours"
  //           },
  //           {
  //             "Abbreviation": "FNT",
  //             "Name": "Fernando de Noronha Time",
  //             "GMT": "GMT-2",
  //             "Offset": "-2 hours"
  //           },
  //           {
  //             "Abbreviation": "G",
  //             "Name": "Golf Time Zone",
  //             "GMT": "GMT+7",
  //             "Offset": "7 hours"
  //           },
  //           {
  //             "Abbreviation": "GALT",
  //             "Name": "Galapagos Time",
  //             "GMT": "GMT-6",
  //             "Offset": "-6 hours"
  //           },
  //           {
  //             "Abbreviation": "GAMT",
  //             "Name": "Gambier Time",
  //             "GMT": "GMT-9",
  //             "Offset": "-9 hours"
  //           },
  //           {
  //             "Abbreviation": "GET",
  //             "Name": "Georgia Standard Time",
  //             "GMT": "GMT+4",
  //             "Offset": "4 hours"
  //           },
  //           {
  //             "Abbreviation": "GFT",
  //             "Name": "French Guiana Time",
  //             "GMT": "GMT-3",
  //             "Offset": "-3 hours"
  //           },
  //           {
  //             "Abbreviation": "GILT",
  //             "Name": "Gilbert Island Time",
  //             "GMT": "GMT+12",
  //             "Offset": "12 hours"
  //           },
  //           {
  //             "Abbreviation": "GMT",
  //             "Name": "Greenwich Mean Time",
  //             "GMT": "GMT",
  //             "Offset": "0 hours"
  //           },
  //           {
  //             "Abbreviation": "GST",
  //             "Name": "Gulf Standard Time",
  //             "GMT": "GMT+4",
  //             "Offset": "4 hours"
  //           },
  //           {
  //             "Abbreviation": "GYT",
  //             "Name": "Guyana Time",
  //             "GMT": "GMT-4",
  //             "Offset": "-4 hours"
  //           },
  //           {
  //             "Abbreviation": "H",
  //             "Name": "Hotel Time Zone",
  //             "GMT": "GMT+8",
  //             "Offset": "8 hours"
  //           },
  //           {
  //             "Abbreviation": "HAA",
  //             "Name": "Heure Avancée de l'Atlantique",
  //             "GMT": "GMT-3",
  //             "Offset": "-3 hours"
  //           },
  //           {
  //             "Abbreviation": "HAC",
  //             "Name": "Heure Avancée du Centre",
  //             "GMT": "GMT-5",
  //             "Offset": "-5 hours"
  //           },
  //           {
  //             "Abbreviation": "HADT",
  //             "Name": "Hawaii-Aleutian Daylight Time",
  //             "GMT": "GMT-9",
  //             "Offset": "-9 hours"
  //           },
  //           {
  //             "Abbreviation": "HAE",
  //             "Name": "Heure Avancée de l'Est",
  //             "GMT": "GMT-4",
  //             "Offset": "-4 hours"
  //           },
  //           {
  //             "Abbreviation": "HAP",
  //             "Name": "Heure Avancée du Pacifique",
  //             "GMT": "GMT-7",
  //             "Offset": "-7 hours"
  //           },
  //           {
  //             "Abbreviation": "HAR",
  //             "Name": "Heure Avancée des Rocheuses",
  //             "GMT": "GMT-6",
  //             "Offset": "-6 hours"
  //           },
  //           {
  //             "Abbreviation": "HAST",
  //             "Name": "Hawaii-Aleutian Standard Time",
  //             "GMT": "GMT-10",
  //             "Offset": "-10 hours"
  //           },
  //           {
  //             "Abbreviation": "HAT",
  //             "Name": "Heure Avancée de Terre-Neuve",
  //             "GMT": "GMT-2:30",
  //             "Offset": "-2:30 hours"
  //           },
  //           {
  //             "Abbreviation": "HAY",
  //             "Name": "Heure Avancée du Yukon",
  //             "GMT": "GMT-8",
  //             "Offset": "-8 hours"
  //           },
  //           {
  //             "Abbreviation": "HKT",
  //             "Name": "Hong Kong Time",
  //             "GMT": "GMT+8",
  //             "Offset": "8 hours"
  //           },
  //           {
  //             "Abbreviation": "HLV",
  //             "Name": "Hora Legal de Venezuela",
  //             "GMT": "GMT-4:30",
  //             "Offset": "-4:30 hours"
  //           },
  //           {
  //             "Abbreviation": "HNA",
  //             "Name": "Heure Normale de l'Atlantique",
  //             "GMT": "GMT-4",
  //             "Offset": "-4 hours"
  //           },
  //           {
  //             "Abbreviation": "HNC",
  //             "Name": "Heure Normale du Centre",
  //             "GMT": "GMT-6",
  //             "Offset": "-6 hours"
  //           },
  //           {
  //             "Abbreviation": "HNE",
  //             "Name": "Heure Normale de l'Est",
  //             "GMT": "GMT-5",
  //             "Offset": "-5 hours"
  //           },
  //           {
  //             "Abbreviation": "HNP",
  //             "Name": "Heure Normale du Pacifique",
  //             "GMT": "GMT-8",
  //             "Offset": "-8 hours"
  //           },
  //           {
  //             "Abbreviation": "HNR",
  //             "Name": "Heure Normale des Rocheuses",
  //             "GMT": "GMT-7",
  //             "Offset": "-7 hours"
  //           },
  //           {
  //             "Abbreviation": "HNT",
  //             "Name": "Heure Normale de Terre-Neuve",
  //             "GMT": "GMT-3:30",
  //             "Offset": "-3:30 hours"
  //           },
  //           {
  //             "Abbreviation": "HNY",
  //             "Name": "Heure Normale du Yukon",
  //             "GMT": "GMT-9",
  //             "Offset": "-9 hours"
  //           },
  //           {
  //             "Abbreviation": "HOVT",
  //             "Name": "Hovd Time",
  //             "GMT": "GMT+7",
  //             "Offset": "7 hours"
  //           },
  //           {
  //             "Abbreviation": "I",
  //             "Name": "India Time Zone",
  //             "GMT": "GMT+9",
  //             "Offset": "9 hours"
  //           },
  //           {
  //             "Abbreviation": "ICT",
  //             "Name": "Indochina Time",
  //             "GMT": "GMT+7",
  //             "Offset": "7 hours"
  //           },
  //           {
  //             "Abbreviation": "IDT",
  //             "Name": "Israel Daylight Time",
  //             "GMT": "GMT+3",
  //             "Offset": "3 hours"
  //           },
  //           {
  //             "Abbreviation": "IOT",
  //             "Name": "Indian Chagos Time",
  //             "GMT": "GMT+6",
  //             "Offset": "6 hours"
  //           },
  //           {
  //             "Abbreviation": "IRDT",
  //             "Name": "Iran Daylight Time",
  //             "GMT": "GMT+4:30",
  //             "Offset": "4:30 hours"
  //           },
  //           {
  //             "Abbreviation": "IRKST",
  //             "Name": "Irkutsk Summer Time",
  //             "GMT": "GMT+9",
  //             "Offset": "9 hours"
  //           },
  //           {
  //             "Abbreviation": "IRKT",
  //             "Name": "Irkutsk Time",
  //             "GMT": "GMT+9",
  //             "Offset": "9 hours"
  //           },
  //           {
  //             "Abbreviation": "IRST",
  //             "Name": "Iran Standard Time",
  //             "GMT": "GMT+3:30",
  //             "Offset": "3:30 hours"
  //           },
  //           {
  //             "Abbreviation": "IST",
  //             "Name": "Israel Standard Time",
  //             "GMT": "GMT+2",
  //             "Offset": "2 hours"
  //           },
  //           {
  //             "Abbreviation": "IST",
  //             "Name": "India Standard Time",
  //             "GMT": "GMT+5:30",
  //             "Offset": "5:30 hours"
  //           },
  //           {
  //             "Abbreviation": "IST",
  //             "Name": "Irish Standard Time",
  //             "GMT": "GMT+1",
  //             "Offset": "1 hours"
  //           },
  //           {
  //             "Abbreviation": "JST",
  //             "Name": "Japan Standard Time",
  //             "GMT": "GMT+9",
  //             "Offset": "9 hours"
  //           },
  //           {
  //             "Abbreviation": "K",
  //             "Name": "Kilo Time Zone",
  //             "GMT": "GMT+10",
  //             "Offset": "10 hours"
  //           },
  //           {
  //             "Abbreviation": "KGT",
  //             "Name": "Kyrgyzstan Time",
  //             "GMT": "GMT+6",
  //             "Offset": "6 hours"
  //           },
  //           {
  //             "Abbreviation": "KRAST",
  //             "Name": "Krasnoyarsk Summer Time",
  //             "GMT": "GMT+8",
  //             "Offset": "8 hours"
  //           },
  //           {
  //             "Abbreviation": "KRAT",
  //             "Name": "Krasnoyarsk Time",
  //             "GMT": "GMT+8",
  //             "Offset": "8 hours"
  //           },
  //           {
  //             "Abbreviation": "KST",
  //             "Name": "Korea Standard Time",
  //             "GMT": "GMT+9",
  //             "Offset": "9 hours"
  //           },
  //           {
  //             "Abbreviation": "KUYT",
  //             "Name": "Kuybyshev Time",
  //             "GMT": "GMT+4",
  //             "Offset": "4 hours"
  //           },
  //           {
  //             "Abbreviation": "L",
  //             "Name": "Lima Time Zone",
  //             "GMT": "GMT+11",
  //             "Offset": "11 hours"
  //           },
  //           {
  //             "Abbreviation": "LHDT",
  //             "Name": "Lord Howe Daylight Time",
  //             "GMT": "GMT+11",
  //             "Offset": "11 hours"
  //           },
  //           {
  //             "Abbreviation": "LHST",
  //             "Name": "Lord Howe Standard Time",
  //             "GMT": "GMT+10:30",
  //             "Offset": "10:30 hours"
  //           },
  //           {
  //             "Abbreviation": "LINT",
  //             "Name": "Line Islands Time",
  //             "GMT": "GMT+14",
  //             "Offset": "14 hours"
  //           },
  //           {
  //             "Abbreviation": "M",
  //             "Name": "Mike Time Zone",
  //             "GMT": "GMT+12",
  //             "Offset": "12 hours"
  //           },
  //           {
  //             "Abbreviation": "MAGST",
  //             "Name": "Magadan Summer Time",
  //             "GMT": "GMT+12",
  //             "Offset": "12 hours"
  //           },
  //           {
  //             "Abbreviation": "MAGT",
  //             "Name": "Magadan Time",
  //             "GMT": "GMT+12",
  //             "Offset": "12 hours"
  //           },
  //           {
  //             "Abbreviation": "MART",
  //             "Name": "Marquesas Time",
  //             "GMT": "GMT-9:30",
  //             "Offset": "-9:30 hours"
  //           },
  //           {
  //             "Abbreviation": "MAWT",
  //             "Name": "Mawson Time",
  //             "GMT": "GMT+5",
  //             "Offset": "5 hours"
  //           },
  //           {
  //             "Abbreviation": "MDT",
  //             "Name": "Mountain Daylight Time",
  //             "GMT": "GMT-6",
  //             "Offset": "-6 hours"
  //           },
  //           {
  //             "Abbreviation": "MESZ",
  //             "Name": "Mitteleuropäische Sommerzeit",
  //             "GMT": "GMT+2",
  //             "Offset": "2 hours"
  //           },
  //           {
  //             "Abbreviation": "MEZ",
  //             "Name": "Mitteleuropäische Zeit",
  //             "GMT": "GMT+1",
  //             "Offset": "1 hours"
  //           },
  //           {
  //             "Abbreviation": "MHT",
  //             "Name": "Marshall Islands Time",
  //             "GMT": "GMT+12",
  //             "Offset": "12 hours"
  //           },
  //           {
  //             "Abbreviation": "MMT",
  //             "Name": "Myanmar Time",
  //             "GMT": "GMT+6:30",
  //             "Offset": "6:30 hours"
  //           },
  //           {
  //             "Abbreviation": "MSD",
  //             "Name": "Moscow Daylight Time",
  //             "GMT": "GMT+4",
  //             "Offset": "4 hours"
  //           },
  //           {
  //             "Abbreviation": "MSK",
  //             "Name": "Moscow Standard Time",
  //             "GMT": "GMT+4",
  //             "Offset": "4 hours"
  //           },
  //           {
  //             "Abbreviation": "MST",
  //             "Name": "Mountain Standard Time",
  //             "GMT": "GMT-7",
  //             "Offset": "-7 hours"
  //           },
  //           {
  //             "Abbreviation": "MUT",
  //             "Name": "Mauritius Time",
  //             "GMT": "GMT+4",
  //             "Offset": "4 hours"
  //           },
  //           {
  //             "Abbreviation": "MVT",
  //             "Name": "Maldives Time",
  //             "GMT": "GMT+5",
  //             "Offset": "5 hours"
  //           },
  //           {
  //             "Abbreviation": "MYT",
  //             "Name": "Malaysia Time",
  //             "GMT": "GMT+8",
  //             "Offset": "8 hours"
  //           },
  //           {
  //             "Abbreviation": "N",
  //             "Name": "November Time Zone",
  //             "GMT": "GMT-1",
  //             "Offset": "-1 hours"
  //           },
  //           {
  //             "Abbreviation": "NCT",
  //             "Name": "New Caledonia Time",
  //             "GMT": "GMT+11",
  //             "Offset": "11 hours"
  //           },
  //           {
  //             "Abbreviation": "NDT",
  //             "Name": "Newfoundland Daylight Time",
  //             "GMT": "GMT-2:30",
  //             "Offset": "-2:30 hours"
  //           },
  //           {
  //             "Abbreviation": "NFT",
  //             "Name": "Norfolk Time",
  //             "GMT": "GMT+11:30",
  //             "Offset": "11:30 hours"
  //           },
  //           {
  //             "Abbreviation": "NOVST",
  //             "Name": "Novosibirsk Summer Time",
  //             "GMT": "GMT+7",
  //             "Offset": "7 hours"
  //           },
  //           {
  //             "Abbreviation": "NOVT",
  //             "Name": "Novosibirsk Time",
  //             "GMT": "GMT+6",
  //             "Offset": "6 hours"
  //           },
  //           {
  //             "Abbreviation": "NPT",
  //             "Name": "Nepal Time",
  //             "GMT": "GMT+5:45",
  //             "Offset": "5:45 hours"
  //           },
  //           {
  //             "Abbreviation": "NST",
  //             "Name": "Newfoundland Standard Time",
  //             "GMT": "GMT-3:30",
  //             "Offset": "-3:30 hours"
  //           },
  //           {
  //             "Abbreviation": "NUT",
  //             "Name": "Niue Time",
  //             "GMT": "GMT-11",
  //             "Offset": "-11 hours"
  //           },
  //           {
  //             "Abbreviation": "NZDT",
  //             "Name": "New Zealand Daylight Time",
  //             "GMT": "GMT+13",
  //             "Offset": "13 hours"
  //           },
  //           {
  //             "Abbreviation": "NZST",
  //             "Name": "New Zealand Standard Time",
  //             "GMT": "GMT+12",
  //             "Offset": "12 hours"
  //           },
  //           {
  //             "Abbreviation": "O",
  //             "Name": "Oscar Time Zone",
  //             "GMT": "GMT-2",
  //             "Offset": "-2 hours"
  //           },
  //           {
  //             "Abbreviation": "OMSST",
  //             "Name": "Omsk Summer Time",
  //             "GMT": "GMT+7",
  //             "Offset": "7 hours"
  //           },
  //           {
  //             "Abbreviation": "OMST",
  //             "Name": "Omsk Standard Time",
  //             "GMT": "GMT+7",
  //             "Offset": "7 hours"
  //           },
  //           {
  //             "Abbreviation": "P",
  //             "Name": "Papa Time Zone",
  //             "GMT": "GMT-3",
  //             "Offset": "-3 hours"
  //           },
  //           {
  //             "Abbreviation": "PDT",
  //             "Name": "Pacific Daylight Time",
  //             "GMT": "GMT-7",
  //             "Offset": "-7 hours"
  //           },
  //           {
  //             "Abbreviation": "PET",
  //             "Name": "Peru Time",
  //             "GMT": "GMT-5",
  //             "Offset": "-5 hours"
  //           },
  //           {
  //             "Abbreviation": "PETST",
  //             "Name": "Kamchatka Summer Time",
  //             "GMT": "GMT+12",
  //             "Offset": "12 hours"
  //           },
  //           {
  //             "Abbreviation": "PETT",
  //             "Name": "Kamchatka Time",
  //             "GMT": "GMT+12",
  //             "Offset": "12 hours"
  //           },
  //           {
  //             "Abbreviation": "PGT",
  //             "Name": "Papua New Guinea Time",
  //             "GMT": "GMT+10",
  //             "Offset": "10 hours"
  //           },
  //           {
  //             "Abbreviation": "PHOT",
  //             "Name": "Phoenix Island Time",
  //             "GMT": "GMT+13",
  //             "Offset": "13 hours"
  //           },
  //           {
  //             "Abbreviation": "PHT",
  //             "Name": "Philippine Time",
  //             "GMT": "GMT+8",
  //             "Offset": "8 hours"
  //           },
  //           {
  //             "Abbreviation": "PKT",
  //             "Name": "Pakistan Standard Time",
  //             "GMT": "GMT+5",
  //             "Offset": "5 hours"
  //           },
  //           {
  //             "Abbreviation": "PMDT",
  //             "Name": "Pierre & Miquelon Daylight Time",
  //             "GMT": "GMT-2",
  //             "Offset": "-2 hours"
  //           },
  //           {
  //             "Abbreviation": "PMST",
  //             "Name": "Pierre & Miquelon Standard Time",
  //             "GMT": "GMT-3",
  //             "Offset": "-3 hours"
  //           },
  //           {
  //             "Abbreviation": "PONT",
  //             "Name": "Pohnpei Standard Time",
  //             "GMT": "GMT+11",
  //             "Offset": "11 hours"
  //           },
  //           {
  //             "Abbreviation": "PST",
  //             "Name": "Pacific Standard Time",
  //             "GMT": "GMT-8",
  //             "Offset": "-8 hours"
  //           },
  //           {
  //             "Abbreviation": "PST",
  //             "Name": "Pitcairn Standard Time",
  //             "GMT": "GMT-8",
  //             "Offset": "-8 hours"
  //           },
  //           {
  //             "Abbreviation": "PT",
  //             "Name": "Tiempo del Pacífico",
  //             "GMT": "GMT-8",
  //             "Offset": "-8 hours"
  //           },
  //           {
  //             "Abbreviation": "PWT",
  //             "Name": "Palau Time",
  //             "GMT": "GMT+9",
  //             "Offset": "9 hours"
  //           },
  //           {
  //             "Abbreviation": "PYST",
  //             "Name": "Paraguay Summer Time",
  //             "GMT": "GMT-3",
  //             "Offset": "-3 hours"
  //           },
  //           {
  //             "Abbreviation": "PYT",
  //             "Name": "Paraguay Time",
  //             "GMT": "GMT-4",
  //             "Offset": "-4 hours"
  //           },
  //           {
  //             "Abbreviation": "Q",
  //             "Name": "Quebec Time Zone",
  //             "GMT": "GMT-4",
  //             "Offset": "-4 hours"
  //           },
  //           {
  //             "Abbreviation": "R",
  //             "Name": "Romeo Time Zone",
  //             "GMT": "GMT-5",
  //             "Offset": "-5 hours"
  //           },
  //           {
  //             "Abbreviation": "RET",
  //             "Name": "Reunion Time",
  //             "GMT": "GMT+4",
  //             "Offset": "4 hours"
  //           },
  //           {
  //             "Abbreviation": "S",
  //             "Name": "Sierra Time Zone",
  //             "GMT": "GMT-6",
  //             "Offset": "-6 hours"
  //           },
  //           {
  //             "Abbreviation": "SAMT",
  //             "Name": "Samara Time",
  //             "GMT": "GMT+4",
  //             "Offset": "4 hours"
  //           },
  //           {
  //             "Abbreviation": "SAST",
  //             "Name": "South Africa Standard Time",
  //             "GMT": "GMT+2",
  //             "Offset": "2 hours"
  //           },
  //           {
  //             "Abbreviation": "SBT",
  //             "Name": "Solomon IslandsTime",
  //             "GMT": "GMT+11",
  //             "Offset": "11 hours"
  //           },
  //           {
  //             "Abbreviation": "SCT",
  //             "Name": "Seychelles Time",
  //             "GMT": "GMT+4",
  //             "Offset": "4 hours"
  //           },
  //           {
  //             "Abbreviation": "SGT",
  //             "Name": "Singapore Time",
  //             "GMT": "GMT+8",
  //             "Offset": "8 hours"
  //           },
  //           {
  //             "Abbreviation": "SRT",
  //             "Name": "Suriname Time",
  //             "GMT": "GMT-3",
  //             "Offset": "-3 hours"
  //           },
  //           {
  //             "Abbreviation": "SST",
  //             "Name": "Samoa Standard Time",
  //             "GMT": "GMT-11",
  //             "Offset": "-11 hours"
  //           },
  //           {
  //             "Abbreviation": "T",
  //             "Name": "Tango Time Zone",
  //             "GMT": "GMT-7",
  //             "Offset": "-7 hours"
  //           },
  //           {
  //             "Abbreviation": "TAHT",
  //             "Name": "Tahiti Time",
  //             "GMT": "GMT-10",
  //             "Offset": "-10 hours"
  //           },
  //           {
  //             "Abbreviation": "TFT",
  //             "Name": "French Southern and Antarctic Time",
  //             "GMT": "GMT+5",
  //             "Offset": "5 hours"
  //           },
  //           {
  //             "Abbreviation": "TJT",
  //             "Name": "Tajikistan Time",
  //             "GMT": "GMT+5",
  //             "Offset": "5 hours"
  //           },
  //           {
  //             "Abbreviation": "TKT",
  //             "Name": "Tokelau Time",
  //             "GMT": "GMT+13",
  //             "Offset": "13 hours"
  //           },
  //           {
  //             "Abbreviation": "TLT",
  //             "Name": "East Timor Time",
  //             "GMT": "GMT+9",
  //             "Offset": "9 hours"
  //           },
  //           {
  //             "Abbreviation": "TMT",
  //             "Name": "Turkmenistan Time",
  //             "GMT": "GMT+5",
  //             "Offset": "5 hours"
  //           },
  //           {
  //             "Abbreviation": "TVT",
  //             "Name": "Tuvalu Time",
  //             "GMT": "GMT+12",
  //             "Offset": "12 hours"
  //           },
  //           {
  //             "Abbreviation": "U",
  //             "Name": "Uniform Time Zone",
  //             "GMT": "GMT-8",
  //             "Offset": "-8 hours"
  //           },
  //           {
  //             "Abbreviation": "ULAT",
  //             "Name": "Ulaanbaatar Time",
  //             "GMT": "GMT+8",
  //             "Offset": "8 hours"
  //           },
  //           {
  //             "Abbreviation": "GMT",
  //             "Name": "Coordinated Universal Time",
  //             "GMT": "GMT",
  //             "Offset": "0 hours"
  //           },
  //           {
  //             "Abbreviation": "UYST",
  //             "Name": "Uruguay Summer Time",
  //             "GMT": "GMT-2",
  //             "Offset": "-2 hours"
  //           },
  //           {
  //             "Abbreviation": "UYT",
  //             "Name": "Uruguay Time",
  //             "GMT": "GMT-3",
  //             "Offset": "-3 hours"
  //           },
  //           {
  //             "Abbreviation": "UZT",
  //             "Name": "Uzbekistan Time",
  //             "GMT": "GMT+5",
  //             "Offset": "5 hours"
  //           },
  //           {
  //             "Abbreviation": "V",
  //             "Name": "Victor Time Zone",
  //             "GMT": "GMT-9",
  //             "Offset": "-9 hours"
  //           },
  //           {
  //             "Abbreviation": "VET",
  //             "Name": "Venezuelan Standard Time",
  //             "GMT": "GMT-4:30",
  //             "Offset": "-4:30 hours"
  //           },
  //           {
  //             "Abbreviation": "VLAST",
  //             "Name": "Vladivostok Summer Time",
  //             "GMT": "GMT+11",
  //             "Offset": "11 hours"
  //           },
  //           {
  //             "Abbreviation": "VLAT",
  //             "Name": "Vladivostok Time",
  //             "GMT": "GMT+11",
  //             "Offset": "11 hours"
  //           },
  //           {
  //             "Abbreviation": "VUT",
  //             "Name": "Vanuatu Time",
  //             "GMT": "GMT+11",
  //             "Offset": "11 hours"
  //           },
  //           {
  //             "Abbreviation": "W",
  //             "Name": "Whiskey Time Zone",
  //             "GMT": "GMT-10",
  //             "Offset": "-10 hours"
  //           },
  //           {
  //             "Abbreviation": "WAST",
  //             "Name": "West Africa Summer Time",
  //             "GMT": "GMT+2",
  //             "Offset": "2 hours"
  //           },
  //           {
  //             "Abbreviation": "WAT",
  //             "Name": "West Africa Time",
  //             "GMT": "GMT+1",
  //             "Offset": "1 hours"
  //           },
  //           {
  //             "Abbreviation": "WEST",
  //             "Name": "Western European Summer Time",
  //             "GMT": "GMT+1",
  //             "Offset": "1 hours"
  //           },
  //           {
  //             "Abbreviation": "WESZ",
  //             "Name": "Westeuropäische Sommerzeit",
  //             "GMT": "GMT+1",
  //             "Offset": "1 hours"
  //           },
  //           {
  //             "Abbreviation": "WET",
  //             "Name": "Western European Time",
  //             "GMT": "GMT",
  //             "Offset": "0 hours"
  //           },
  //           {
  //             "Abbreviation": "WEZ",
  //             "Name": "Westeuropäische Zeit",
  //             "GMT": "GMT",
  //             "Offset": "0 hours"
  //           },
  //           {
  //             "Abbreviation": "WFT",
  //             "Name": "Wallis and Futuna Time",
  //             "GMT": "GMT+12",
  //             "Offset": "12 hours"
  //           },
  //           {
  //             "Abbreviation": "WGST",
  //             "Name": "Western Greenland Summer Time",
  //             "GMT": "GMT-2",
  //             "Offset": "-2 hours"
  //           },
  //           {
  //             "Abbreviation": "WGT",
  //             "Name": "West Greenland Time",
  //             "GMT": "GMT-3",
  //             "Offset": "-3 hours"
  //           },
  //           {
  //             "Abbreviation": "WIB",
  //             "Name": "Western Indonesian Time",
  //             "GMT": "GMT+7",
  //             "Offset": "7 hours"
  //           },
  //           {
  //             "Abbreviation": "WIT",
  //             "Name": "Eastern Indonesian Time",
  //             "GMT": "GMT+9",
  //             "Offset": "9 hours"
  //           },
  //           {
  //             "Abbreviation": "WITA",
  //             "Name": "Central Indonesian Time",
  //             "GMT": "GMT+8",
  //             "Offset": "8 hours"
  //           },
  //           {
  //             "Abbreviation": "WST",
  //             "Name": "Western Sahara Summer Time",
  //             "GMT": "GMT+1",
  //             "Offset": "1 hours"
  //           },
  //           {
  //             "Abbreviation": "WST",
  //             "Name": "West Samoa Time",
  //             "GMT": "GMT+13",
  //             "Offset": "13 hours"
  //           },
  //           {
  //             "Abbreviation": "WT",
  //             "Name": "Western Sahara Standard Time",
  //             "GMT": "GMT",
  //             "Offset": "0 hours"
  //           },
  //           {
  //             "Abbreviation": "X",
  //             "Name": "X-ray Time Zone",
  //             "GMT": "GMT-11",
  //             "Offset": "-11 hours"
  //           },
  //           {
  //             "Abbreviation": "Y",
  //             "Name": "Yankee Time Zone",
  //             "GMT": "GMT-12",
  //             "Offset": "-12 hours"
  //           },
  //           {
  //             "Abbreviation": "YAKST",
  //             "Name": "Yakutsk Summer Time",
  //             "GMT": "GMT+10",
  //             "Offset": "10 hours"
  //           },
  //           {
  //             "Abbreviation": "YAKT",
  //             "Name": "Yakutsk Time",
  //             "GMT": "GMT+10",
  //             "Offset": "10 hours"
  //           },
  //           {
  //             "Abbreviation": "YAPT",
  //             "Name": "Yap Time",
  //             "GMT": "GMT+10",
  //             "Offset": "10 hours"
  //           },
  //           {
  //             "Abbreviation": "YEKST",
  //             "Name": "Yekaterinburg Summer Time",
  //             "GMT": "GMT+6",
  //             "Offset": "6 hours"
  //           },
  //           {
  //             "Abbreviation": "YEKT",
  //             "Name": " Yekaterinburg Time",
  //             "GMT": " GMT+6",
  //             "Offset": "6 hours"
  //           },
  //           {
  //             "Abbreviation": "Z",
  //             "Name": "Zulu Time Zone",
  //             "GMT": "GMT",
  //             "Offset": "0 hours"
  //           }
  //         ]
  // static ZoneList: any[] =
  //   [
  //     {
  //       "Abbreviation": "ACST",
  //       "Name": "AUS Central Standard Time",
  //       "GMT": "GMT+9:30",
  //       "Offset": "9:30 hours"
  //     },
  //     {
  //       "Abbreviation": "AEST",
  //       "Name": "AUS Eastern Standard Time",
  //       "GMT": "GMT+10",
  //       "Offset": "10 hours"
  //     },
  //     {
  //       "Abbreviation": "AFT",
  //       "Name": "Afghanistan Standard Time",
  //       "GMT": "GMT+4:30",
  //       "Offset": "4:30 hours"
  //     },
  //     {
  //       "Abbreviation": "AKST",
  //       "Name": "Alaskan Standard Time",
  //       "GMT": "GMT-9",
  //       "Offset": "-9 hours"
  //     },
  //     {
  //       "Abbreviation": "ART",
  //       "Name": "Argentina Standard Time",
  //       "GMT": "GMT-3",
  //       "Offset": "-3 hours"
  //     },
  //     {
  //       "Abbreviation": "AST",
  //       "Name": "Arabian Standard Time",
  //       "GMT": "GMT+3",
  //       "Offset": "3 hours"
  //     },
  //     {
  //       "Abbreviation": "AST",
  //       "Name": "Atlantic Standard Time",
  //       "GMT": "GMT-4",
  //       "Offset": "-4 hours"
  //     },
  //     {
  //       "Abbreviation": "AWST",
  //       "Name": "W. Australia Standard Time",
  //       "GMT": "GMT+8",
  //       "Offset": "8 hours"
  //     },
  //     {
  //       "Abbreviation": "AZOT",
  //       "Name": "Azores Standard Time",
  //       "GMT": "GMT-1",
  //       "Offset": "-1 hours"
  //     },
  //     {
  //       "Abbreviation": "AZT",
  //       "Name": "Azerbaijan Standard Time",
  //       "GMT": "GMT+4",
  //       "Offset": "4 hours"
  //     },
  //     {
  //       "Abbreviation": "BRT",
  //       "Name": "E. South America Standard Time",
  //       "GMT": "GMT-3",
  //       "Offset": "-3 hours"
  //     },
  //     {
  //       "Abbreviation": "BST",
  //       "Name": "Bangladesh Standard Time",
  //       "GMT": "GMT+6",
  //       "Offset": "6 hours"
  //     },
  //     {
  //       "Abbreviation": "CET",
  //       "Name": "Central Europe Standard Time",
  //       "GMT": "GMT+1",
  //       "Offset": "1 hours"
  //     },
  //     {
  //       "Abbreviation": "CST",
  //       "Name": "China Standard Time",
  //       "GMT": "GMT+8",
  //       "Offset": "8 hours"
  //     },
  //     {
  //       "Abbreviation": "CST",
  //       "Name": "Central Standard Time",
  //       "GMT": "GMT-6",
  //       "Offset": "-6 hours"
  //     },
  //     {
  //       "Abbreviation": "CST",
  //       "Name": "Cuba Standard Time",
  //       "GMT": "GMT-5",
  //       "Offset": "-5 hours"
  //     },
  //     {
  //       "Abbreviation": "CVT",
  //       "Name": "Cape Verde Standard Time",
  //       "GMT": "GMT-1",
  //       "Offset": "-1 hours"
  //     },
  //     {
  //       "Abbreviation": "EAST",
  //       "Name": "Easter Island Standard Time",
  //       "GMT": "GMT-6",
  //       "Offset": "-6 hours"
  //     },
  //     {
  //       "Abbreviation": "EAT",
  //       "Name": "E. Africa Standard Time",
  //       "GMT": "GMT+3",
  //       "Offset": "3 hours"
  //     },
  //     {
  //       "Abbreviation": "EET",
  //       "Name": "E. Europe Standard Time",
  //       "GMT": "GMT+2",
  //       "Offset": "2 hours"
  //     },
  //     {
  //       "Abbreviation": "EST",
  //       "Name": "Eastern Standard Time",
  //       "GMT": "GMT-5",
  //       "Offset": "-5 hours"
  //     },
  //     {
  //       "Abbreviation": "GET",
  //       "Name": "Georgian Standard Time",
  //       "GMT": "GMT+4",
  //       "Offset": "4 hours"
  //     },
  //     {
  //       "Abbreviation": "GMT",
  //       "Name": "Greenwich Standard Time",
  //       "GMT": "GMT",
  //       "Offset": "0 hours"
  //     },
  //     {
  //       "Abbreviation": "IRST",
  //       "Name": "Iran Standard Time",
  //       "GMT": "GMT+3:30",
  //       "Offset": "3:30 hours"
  //     },
  //     {
  //       "Abbreviation": "TRT",
  //       "Name": "Turkey Standard Time",
  //       "GMT": "GMT+3",
  //       "Offset": "3 hours"
  //     },
  //     {
  //       "Abbreviation": "IST",
  //       "Name": "India Standard Time",
  //       "GMT": "GMT+5:30",
  //       "Offset": "5:30 hours"
  //     },
  //     {
  //       "Abbreviation": "IST",
  //       "Name": "Israel Standard Time",
  //       "GMT": "GMT+2",
  //       "Offset": "2 hours"
  //     },
  //   ]

  static ZoneList: any[] =
    [
      { "ZoneName": "Africa/Bangui", "Timezonename": "W. Central Africa Standard Time" },
      { "ZoneName": "Africa/Cairo", "Timezonename": "Egypt Standard Time" },
      { "ZoneName": "Africa/Casablanca", "Timezonename": "Morocco Standard Time" },
      { "ZoneName": "Africa/Harare", "Timezonename": "South Africa Standard Time" },
      { "ZoneName": "Africa/Johannesburg", "Timezonename": "South Africa Standard Time" },
      { "ZoneName": "Africa/Lagos", "Timezonename": "W. Central Africa Standard Time" },
      { "ZoneName": "Africa/Monrovia", "Timezonename": "Greenwich Standard Time" },
      { "ZoneName": "Africa/Nairobi", "Timezonename": "E. Africa Standard Time" },
      { "ZoneName": "Africa/Windhoek", "Timezonename": "Namibia Standard Time" },
      { "ZoneName": "America/Anchorage", "Timezonename": "Alaskan Standard Time" },
      { "ZoneName": "America/Argentina/San_Juan", "Timezonename": "Argentina Standard Time" },
      { "ZoneName": "America/Asuncion", "Timezonename": "Paraguay Standard Time" },
      { "ZoneName": "America/Bahia", "Timezonename": "Bahia Standard Time" },
      { "ZoneName": "America/Bogota", "Timezonename": "SA Pacific Standard Time" },
      { "ZoneName": "America/Buenos_Aires", "Timezonename": "Argentina Standard Time" },
      { "ZoneName": "America/Caracas", "Timezonename": "Venezuela Standard Time" },
      { "ZoneName": "America/Cayenne", "Timezonename": "SA Eastern Standard Time" },
      { "ZoneName": "America/Chicago", "Timezonename": "Central Standard Time" },
      { "ZoneName": "America/Chihuahua", "Timezonename": "Mountain Standard Time (Mexico)" },
      { "ZoneName": "America/Cuiaba", "Timezonename": "Central Brazilian Standard Time" },
      { "ZoneName": "America/Denver", "Timezonename": "Mountain Standard Time" },
      { "ZoneName": "America/Fortaleza", "Timezonename": "SA Eastern Standard Time" },
      { "ZoneName": "America/Godthab", "Timezonename": "Greenland Standard Time" },
      { "ZoneName": "America/Guatemala", "Timezonename": "Central America Standard Time" },
      { "ZoneName": "America/Halifax", "Timezonename": "Atlantic Standard Time" },
      { "ZoneName": "America/Indianapolis", "Timezonename": "US Eastern Standard Time" },
      { "ZoneName": "America/Indiana/Indianapolis", "Timezonename": "US Eastern Standard Time" },
      { "ZoneName": "America/La_Paz", "Timezonename": "SA Western Standard Time" },
      { "ZoneName": "America/Los_Angeles", "Timezonename": "Pacific Standard Time" },
      { "ZoneName": "America/Mexico_City", "Timezonename": "Mexico Standard Time" },
      { "ZoneName": "America/Montevideo", "Timezonename": "Montevideo Standard Time" },
      { "ZoneName": "America/New_York", "Timezonename": "Eastern Standard Time" },
      { "ZoneName": "America/Noronha", "Timezonename": "UTC-02" },
      { "ZoneName": "America/Phoenix", "Timezonename": "US Mountain Standard Time" },
      { "ZoneName": "America/Regina", "Timezonename": "Canada Central Standard Time" },
      { "ZoneName": "America/Santa_Isabel", "Timezonename": "Pacific Standard Time (Mexico)" },
      { "ZoneName": "America/Santiago", "Timezonename": "Pacific SA Standard Time" },
      { "ZoneName": "America/Sao_Paulo", "Timezonename": "E. South America Standard Time" },
      { "ZoneName": "America/St_Johns", "Timezonename": "Newfoundland Standard Time" },
      { "ZoneName": "America/Tijuana", "Timezonename": "Pacific Standard Time" },
      { "ZoneName": "Antarctica/McMurdo", "Timezonename": "New Zealand Standard Time" },
      { "ZoneName": "Atlantic/South_Georgia", "Timezonename": "UTC-02" },
      { "ZoneName": "Asia/Almaty", "Timezonename": "Central Asia Standard Time" },
      { "ZoneName": "Asia/Amman", "Timezonename": "Jordan Standard Time" },
      { "ZoneName": "Asia/Baghdad", "Timezonename": "Arabic Standard Time" },
      { "ZoneName": "Asia/Baku", "Timezonename": "Azerbaijan Standard Time" },
      { "ZoneName": "Asia/Bangkok", "Timezonename": "SE Asia Standard Time" },
      { "ZoneName": "Asia/Beirut", "Timezonename": "Middle East Standard Time" },
      { "ZoneName": "Asia/Calcutta", "Timezonename": "India Standard Time" },
      { "ZoneName": "Asia/Colombo", "Timezonename": "Sri Lanka Standard Time" },
      { "ZoneName": "Asia/Damascus", "Timezonename": "Syria Standard Time" },
      { "ZoneName": "Asia/Dhaka", "Timezonename": "Bangladesh Standard Time" },
      { "ZoneName": "Asia/Dubai", "Timezonename": "Arabian Standard Time" },
      { "ZoneName": "Asia/Irkutsk", "Timezonename": "North Asia East Standard Time" },
      { "ZoneName": "Asia/Jerusalem", "Timezonename": "Israel Standard Time" },
      { "ZoneName": "Asia/Kabul", "Timezonename": "Afghanistan Standard Time" },
      { "ZoneName": "Asia/Kamchatka", "Timezonename": "Kamchatka Standard Time" },
      { "ZoneName": "Asia/Karachi", "Timezonename": "Pakistan Standard Time" },
      { "ZoneName": "Asia/Katmandu", "Timezonename": "Nepal Standard Time" },
      { "ZoneName": "Asia/Kolkata", "Timezonename": "India Standard Time" },
      { "ZoneName": "Asia/Krasnoyarsk", "Timezonename": "North Asia Standard Time" },
      { "ZoneName": "Asia/Kuala_Lumpur", "Timezonename": "Singapore Standard Time" },
      { "ZoneName": "Asia/Kuwait", "Timezonename": "Arab Standard Time" },
      { "ZoneName": "Asia/Magadan", "Timezonename": "Magadan Standard Time" },
      { "ZoneName": "Asia/Muscat", "Timezonename": "Arabian Standard Time" },
      { "ZoneName": "Asia/Novosibirsk", "Timezonename": "N. Central Asia Standard Time" },
      { "ZoneName": "Asia/Oral", "Timezonename": "West Asia Standard Time" },
      { "ZoneName": "Asia/Rangoon", "Timezonename": "Myanmar Standard Time" },
      { "ZoneName": "Asia/Riyadh", "Timezonename": "Arab Standard Time" },
      { "ZoneName": "Asia/Seoul", "Timezonename": "Korea Standard Time" },
      { "ZoneName": "Asia/Shanghai", "Timezonename": "China Standard Time" },
      { "ZoneName": "Asia/Singapore", "Timezonename": "Singapore Standard Time" },
      { "ZoneName": "Asia/Taipei", "Timezonename": "Taipei Standard Time" },
      { "ZoneName": "Asia/Tashkent", "Timezonename": "West Asia Standard Time" },
      { "ZoneName": "Asia/Tbilisi", "Timezonename": "Georgian Standard Time" },
      { "ZoneName": "Asia/Tehran", "Timezonename": "Iran Standard Time" },
      { "ZoneName": "Asia/Tokyo", "Timezonename": "Tokyo Standard Time" },
      { "ZoneName": "Asia/Ulaanbaatar", "Timezonename": "Ulaanbaatar Standard Time" },
      { "ZoneName": "Asia/Vladivostok", "Timezonename": "Vladivostok Standard Time" },
      { "ZoneName": "Asia/Yakutsk", "Timezonename": "Yakutsk Standard Time" },
      { "ZoneName": "Asia/Yekaterinburg", "Timezonename": "Ekaterinburg Standard Time" },
      { "ZoneName": "Asia/Yerevan", "Timezonename": "Armenian Standard Time" },
      { "ZoneName": "Atlantic/Azores", "Timezonename": "Azores Standard Time" },
      { "ZoneName": "Atlantic/Cape_Verde", "Timezonename": "Cape Verde Standard Time" },
      { "ZoneName": "Atlantic/Reykjavik", "Timezonename": "Greenwich Standard Time" },
      { "ZoneName": "Australia/Adelaide", "Timezonename": "Cen. Australia Standard Time" },
      { "ZoneName": "Australia/Brisbane", "Timezonename": "E. Australia Standard Time" },
      { "ZoneName": "Australia/Darwin", "Timezonename": "AUS Central Standard Time" },
      { "ZoneName": "Australia/Hobart", "Timezonename": "Tasmania Standard Time" },
      { "ZoneName": "Australia/Perth", "Timezonename": "W. Australia Standard Time" },
      { "ZoneName": "Australia/Sydney", "Timezonename": "AUS Eastern Standard Time" },
      { "ZoneName": "Etc/GMT", "Timezonename": "UTC" },
      { "ZoneName": "Etc/GMT+11", "Timezonename": "UTC-11" },
      { "ZoneName": "Etc/GMT+12", "Timezonename": "Dateline Standard Time" },
      { "ZoneName": "Etc/GMT+2", "Timezonename": "UTC-02" },
      { "ZoneName": "Etc/GMT-12", "Timezonename": "UTC+12" },
      { "ZoneName": "Europe/Amsterdam", "Timezonename": "W. Europe Standard Time" },
      { "ZoneName": "Europe/Athens", "Timezonename": "GTB Standard Time" },
      { "ZoneName": "Europe/Belgrade", "Timezonename": "Central Europe Standard Time" },
      { "ZoneName": "Europe/Berlin", "Timezonename": "W. Europe Standard Time" },
      { "ZoneName": "Europe/Brussels", "Timezonename": "Romance Standard Time" },
      { "ZoneName": "Europe/Budapest", "Timezonename": "Central Europe Standard Time" },
      { "ZoneName": "Europe/Dublin", "Timezonename": "GMT Standard Time" },
      { "ZoneName": "Europe/Helsinki", "Timezonename": "FLE Standard Time" },
      { "ZoneName": "Europe/Istanbul", "Timezonename": "GTB Standard Time" },
      { "ZoneName": "Europe/Kiev", "Timezonename": "FLE Standard Time" },
      { "ZoneName": "Europe/London", "Timezonename": "GMT Standard Time" },
      { "ZoneName": "Europe/Minsk", "Timezonename": "E. Europe Standard Time" },
      { "ZoneName": "Europe/Moscow", "Timezonename": "Russian Standard Time" },
      { "ZoneName": "Europe/Paris", "Timezonename": "Romance Standard Time" },
      { "ZoneName": "Europe/Sarajevo", "Timezonename": "Central European Standard Time" },
      { "ZoneName": "Europe/Warsaw", "Timezonename": "Central European Standard Time" },
      { "ZoneName": "Indian/Mauritius", "Timezonename": "Mauritius Standard Time" },
      { "ZoneName": "Pacific/Apia", "Timezonename": "Samoa Standard Time" },
      { "ZoneName": "Pacific/Auckland", "Timezonename": "New Zealand Standard Time" },
      { "ZoneName": "Pacific/Fiji", "Timezonename": "Fiji Standard Time" },
      { "ZoneName": "Pacific/Guadalcanal", "Timezonename": "Central Pacific Standard Time" },
      { "ZoneName": "Pacific/Guam", "Timezonename": "West Pacific Standard Time" },
      { "ZoneName": "Pacific/Honolulu", "Timezonename": "Hawaiian Standard Time" },
      { "ZoneName": "Pacific/Pago_Pago", "Timezonename": "UTC-11" },
      { "ZoneName": "Pacific/Port_Moresby", "Timezonename": "West Pacific Standard Time" },
      { "ZoneName": "Pacific/Tongatapu", "Timezonename": "Tonga Standard Time" }
    ]
}