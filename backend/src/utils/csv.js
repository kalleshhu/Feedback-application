import { Parser } from "json2csv";
export const toCSV = (data) => {
  const parser = new Parser();
  return parser.parse(data);
};
