import React, { useEffect, useState } from "react";
import {
  GridSheet,
  generateInitial,
  BaseFunction,
  createTableRef,
  aa2oa,
  RendererMixinType,
  ParserMixinType,
  CheckboxRendererMixin,
  Parser,
} from "@gridsheet/react-core";

const SpreadSheetTable = () => {
  const initialData = [
    ["Country", "Gender", "Age Group", "2019", "2020", "2021", "2022", "2023"],
    ["Country1", "Male", "Age 20-40", 2, 3, 5, 2, 6],
    ["Country1", "Male", "Age 40-60", 2, 3, 5, 2, 6],
    ["Country1", "Male", "Age 60-90", 2, 3, 5, 2, 6],
    ["", "Male Total"],
    ["Country1", "Female", "Age 20-40", 2, 3, 5, 2, 6],
    ["Country1", "Female", "Age 40-60", 3, 5, 2, 1, 2],
    ["Country1", "Female", "Age 60-90", 1, 2, 3, 2, 5],
    [
      "",
      "Female Total",
      "",
      "=SUM(D6:D8)",
      "=SUM(E6:E8)",
      "=SUM(F6:F8)",
      "=SUM(G6:G8)",
      "=SUM(H6:H8)",
    ],
    [
      "",
      "Country1 Total",
      "",
      "=SUM(D5,D9)",
      "=SUM(E5,E9)",
      "=SUM(F5,F9)",
      "=SUM(G5,G9)",
      "=SUM(H5,H9)",
    ],
    ["Country2", "Male", "Age 40-60", 3, 5, 2, 1, 2],
    ["Country2", "Male", "Age 20-40", 2, 3, 5, 2, 6],
    ["Country2", "Male", "Age 60-90", 1, 2, 3, 2, 5],
    [
      "",
      "Male Total",
      "",
      "=SUM(D11:D13)",
      "=SUM(E11:E13)",
      "=SUM(F11:F13)",
      "=SUM(G11:G13)",
      "=SUM(H11:H13)",
    ],
    ["Country2", "Female", "Age 20-40", 2, 3, 5, 2, 6],
    ["Country2", "Female", "Age 40-60", 3, 5, 2, 1, 2],
    ["Country2", "Female", "Age 60-90", 1, 2, 3, 2, 5],
    [
      "",
      "Female Total",
      "",
      "=SUM(D15:D17)",
      "=SUM(E15:E17)",
      "=SUM(F15:F17)",
      "=SUM(G15:G17)",
      "=SUM(H15:H17)",
    ],
    [
      "",
      "Country2 Total",
      "",
      "=SUM(D14,D18)",
      "=SUM(E14,E18)",
      "=SUM(F14,F18)",
      "=SUM(G14,G18)",
      "=SUM(H14,H18)",
    ],
    [
      "",
      "Grand Total",
      "",
      "=SUM(D10,D19)",
      "=SUM(E10,E19)",
      "=SUM(F10,F19)",
      "=SUM(G10,G19)",
      "=SUM(H10,H19)",
    ],
  ];
  const tableRef = createTableRef();
  const [data, setData] = useState(initialData);

  // Function to calculate sums based on country and gender
  const calculateSums = (tabledata) => {
    const sums = [];

    const years = {}; // To keep track of unique years

    tabledata?.forEach((row) => {
      const country = row[0];
      const gender = row[1];
      const value = row.slice(3); // Considering all columns after the third as year values

      // Ensure the row is not a total row and has valid data
      if (country && gender) {
        const existingEntry = sums.find(
          (entry) => entry.country === country && entry.gender === gender
        );

        if (!existingEntry) {
          const newEntry = {
            country,
            gender,
            total: Array(value.length).fill(0), // Initialize totals for each year as an array
          };
          sums.push(newEntry);
        }

        value.forEach((val, index) => {
          if (typeof val == "number") {
            sums.find(
              (entry) => entry.country === country && entry.gender === gender
            ).total[index] += val;

            // Track the unique years
            if (!years[index]) {
              years[index] = true;
            }
          }
        });
      }
    });

    // Add the unique years to the sums objects
    sums.forEach((entry) => {
      entry.years = Object.keys(years).map((yearIndex) => ({
        year: parseInt(yearIndex) + 2019, // Assuming starting from 2019 based on the index
        total: entry.total[yearIndex],
      }));
    });

    return sums;
  };
  const calculateYearlyCountrySums = (tabledata) => {
    const sums = [];

    const years = {}; // To keep track of unique years
    console.log("first");
    if (tabledata)
      for (let i = 1; i < tabledata?.length; i++) {
        const country = tabledata[i][0];
        const value = tabledata[i].slice(3); // Considering all columns after the third as year values
        console.log("length:", country.length);
        // Ensure the row is not a total row and has valid data
        if (country) {
          const existingEntry = sums.find((entry) => entry.country === country);

          if (!existingEntry) {
            const newEntry = {
              country,
              total: Array(value.length).fill(0), // Initialize totals for each year as an array
            };
            sums.push(newEntry);
          }

          value.forEach((val, index) => {
            if (typeof val == "number") {
              sums.find((entry) => entry.country === country).total[index] +=
                val;

              if (!years[index]) {
                years[index] = true;
              }
            }
          });
        }
      }

    // Add the unique years to the sums objects
    sums.forEach((entry) => {
      entry.years = Object.keys(years).map((yearIndex) => ({
        year: parseInt(yearIndex) + 2019, // Assuming starting from 2019 based on the index
        total: entry.total[yearIndex],
      }));
    });

    return sums;
  };

  const calculateSumsAndAppend = (matrix) => {
    const sums = calculateSums(matrix); // Assuming you have a function to calculate sums
    // const yearWiseSum = calculateYearlyCountrySums(matrix);
    // console.log("sumsss", yearWiseSum);
    const updatedData = [...matrix]; // Copy the existing data
    var subTotalIdx = [];
    for (let i = 1; i < sums.length; i++) {
      const { country, gender, years } = sums[i];

      // Find the index of the last male and female in the specified country
      let insertIndex = -1;
      let tempIdx = -1;
      updatedData.forEach((row, index) => {
        if (row[0] === country && row[1] === gender) {
          insertIndex = index;
        }
        if (row[0] === country) 
        {
          tempIdx = index;

        }
      });
      const existingEntry = subTotalIdx.find((entry) => entry === tempIdx);
      if (!existingEntry) subTotalIdx.push(tempIdx);
      if (tableRef.current) {
        const { dispatch, table } = tableRef.current;

        //update year wise sum dynamically
        for (let i = 0; i < years.length; i++) {
          dispatch(
            table.write({
              point: { x: i + 4, y: insertIndex + 2 },
              value: years[i]?.total.toString(),
            })
          );
        }
      }
    }
    // subTotalIdx.forEach(idx=>(

    // ))

    console.log(subTotalIdx);
  };

  const handleTable = (table) => {
    // console.log(table);
    const matrix = table.getMatrixFlatten({});
    // console.log(matrix);
    setData(matrix);
    calculateSumsAndAppend(matrix);
  };
  return (
    <div className="grid-container bg-light">
      <GridSheet
        tableRef={tableRef}
        // style={{ minWidth: "80%" }}
        initial={generateInitial({
          matrices: {
            A1: data,
          },
          cells: {
            1: {
              style: { backgroundColor: "#00b3b3", fontWeight: "bolder" },
            },
            5: { style: { backgroundColor: "#ddd", fontWeight: "bolder" } },
            9: { style: { backgroundColor: "#ddd", fontWeight: "bolder" } },
            14: { style: { backgroundColor: "#ddd", fontWeight: "bolder" } },
            18: { style: { backgroundColor: "#ddd", fontWeight: "bolder" } },
            10: {
              style: { backgroundColor: "#c0bfbf", fontWeight: "bolder" },
            },
            19: {
              style: { backgroundColor: "#c0bfbf", fontWeight: "bolder" },
            },
            20: {
              style: { backgroundColor: "#999999", fontWeight: "bolder" },
            },
            A: { width: 100 },
            B: { width: 120 },
            C: { width: 100 },
            // D: { width: 50 },
            // E: { width: 50 },
            // F: { width: 50 },
            // G: { width: 50 },
            // H: { width: 50 },
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
