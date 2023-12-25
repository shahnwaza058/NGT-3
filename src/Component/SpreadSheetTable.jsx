import React, { useEffect } from "react";
import {
  GridSheet,
  generateInitial,
  BaseFunction,
  createTableRef,
} from "@gridsheet/react-core";
// Hello
const SpreadSheetTable = () => {
  const tableRef = createTableRef();
  useEffect(() => {
    console.log(tableRef?.table?.idMatrix);
  }, []);

  const handleTable = (table) => {
    console.log(tableRef);
    console.log(
      "written",
      table.getObjectFlatten({
        filter: (cell) =>
          cell && cell.changedAt && cell.changedAt > table.lastChangedAt,
      })
    );
  };
  return (
    <div className="container">
      <GridSheet
        tableRef={tableRef}
        style={{ minWidth: "100%" }}
        initial={generateInitial({
          matrices: {
            A1: [
              [
                "Country",
                "Gender",
                "Age Group",
                "2019",
                "2020",
                "2021",
                "2022",
                "2023",
              ],
              ["Country1", "Male", "Age 20-40", 2, 3, 5, 2, 6],
              ["Country1", "Male", "Age 40-60", 3, 5, 2, 1, 2],
              ["Country1", "Male", "Age 60-90", 1, 2, 3, 2, 5],
            ],
            B5: [["Male Total"]],
            D5: [
              [
                "=SUM(D2:D4)",
                "=SUM(E2:E4)",
                "=SUM(F2:F4)",
                "=SUM(G2:G4)",
                "=SUM(H2:H4)",
              ],
            ],
            A10: [["Country1 Total"]],
            A20: [["Grand Total"]],
          },
          cells: {
            1: { style: { backgroundColor: "#ddd", fontWeight: "bolder" } },
            5: { style: { backgroundColor: "#ddd", fontWeight: "bolder" } },
            10: { style: { backgroundColor: "#ddd", fontWeight: "bolder" } },
            20: { style: { backgroundColor: "#ddd", fontWeight: "bolder" } },
            A: { width: 120 },
            B: { width: 100 },
            C: { width: 100 },
            D: { width: 50 },
            E: { width: 50 },
            F: { width: 50 },
            G: { width: 50 },
            H: { width: 50 },
          },
        })}
        options={{
          onChange: (table) => handleTable(table),
        }}
      />{" "}
    </div>
  );
};

export default SpreadSheetTable;
