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
import { Button } from "react-bootstrap";
import { IoIosSave } from "react-icons/io";
import { FaCloudDownloadAlt } from "react-icons/fa";
const XLSX = require("xlsx");

const SpreadSheetTable = () => {
  const initialData = [
    ["Country", "Gender", "Age Group", "2019", "2020", "2021", "2022", "2023"],
    ["Country1", "Male", "Age 20-40", 0, 0, 0, 0, 0],
    ["Country1", "Male", "Age 40-60", 0, 0, 0, 0, 0],
    ["Country1", "Male", "Age 60-90", 0, 0, 0, 0, 0],
    ["", "Total"],
    ["Country1", "Female", "Age 20-40", 0, 0, 0, 0, 0],
    ["Country1", "Female", "Age 40-60", 0, 0, 0, 0, 0],
    ["Country1", "Female", "Age 60-90", 0, 0, 0, 0, 0],
    ["", "Total", ""],
    ["", "Sub Total", ""],
    ["Country2", "Male", "Age 40-60", 0, 0, 0, 0, 0],
    ["Country2", "Male", "Age 20-40", 0, 0, 0, 0, 0],
    ["Country2", "Male", "Age 60-90", 0, 0, 0, 0, 0],
    ["", "Total", ""],
    ["Country2", "Female", "Age 20-40", 0, 0, 0, 0, 0],
    ["Country2", "Female", "Age 40-60", 0, 0, 0, 0, 0],
    ["Country2", "Female", "Age 60-90", 0, 0, 0, 0, 0],
    ["", "Total", ""],
    ["", "Sub Total", ""],
    ["", "Grand Total", ""],
  ];
  const tableRef = createTableRef();
  const [data, setData] = useState(initialData);
  const [tsv, setTsv] = useState("");
  const calculateSums = (tabledata) => {
    const sums = [];

    const years = {}; // To keep track of unique years

    tabledata?.forEach((row) => {
      const country = row[0];
      const gender = row[1];
      const value = row.slice(3);

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

    const years = {};
    // console.log("first");

    for (let i = 1; i < tabledata?.length; i++) {
      const country = tabledata[i][0];
      const value = tabledata[i].slice(3);

      if (country) {
        const existingEntry = sums.find((entry) => entry.country === country);

        if (!existingEntry) {
          const newEntry = {
            country,
            total: Array(value.length).fill(0),
          };
          sums.push(newEntry);
        }

        value.forEach((val, index) => {
          if (typeof val == "number") {
            sums.find((entry) => entry.country === country).total[index] += val;

            if (!years[index]) {
              years[index] = true;
            }
          }
        });
      }
    }

    sums.forEach((entry) => {
      entry.years = Object.keys(years).map((yearIndex) => ({
        year: parseInt(yearIndex) + 2019, // Assuming starting from 2019 based on the index
        total: entry.total[yearIndex],
      }));
    });

    return sums;
  };
  const calculateTotalYearWise = (data) => {
    const yearWiseTotal = {};

    data.forEach((countryData) => {
      countryData.years.forEach((yearData) => {
        const { year, total } = yearData;
        if (!yearWiseTotal[year]) {
          yearWiseTotal[year] = 0;
        }
        yearWiseTotal[year] += total;
      });
    });

    return Object.keys(yearWiseTotal).map((year) => ({
      year: parseInt(year),
      total: yearWiseTotal[year],
    }));
  };

  const calculateSumsAndAppend = (matrix) => {
    const sums = calculateSums(matrix);
    const yearWiseSum = calculateYearlyCountrySums(matrix);
    const grandTotal = calculateTotalYearWise(yearWiseSum);
    // console.log("sumsss", yearWiseSum);
    // console.log("yearsdata", grandTotal);
    const updatedData = [...matrix];
    var subTotalIdx = [];
    for (let i = 1; i < sums.length; i++) {
      const { country, gender, years } = sums[i];
      let insertIndex = -1;
      let tempIdx = -1;
      updatedData.forEach((row, index) => {
        if (row[0] === country && row[1] === gender) {
          insertIndex = index;
        }
        if (row[0] === country) {
          tempIdx = index;
        }
      });
      const existingEntry = subTotalIdx.find((entry) => entry === tempIdx);
      if (!existingEntry) subTotalIdx.push(tempIdx);
      if (tableRef.current) {
        const { dispatch, table } = tableRef.current;
        //Appending category wise total sum
        for (let i = 0; i < years.length; i++) {
          dispatch(
            table.write({
              point: { x: i + 4, y: insertIndex + 2 },
              value: years[i]?.total.toString(),
            })
          );
        }
        //Appending country wise total sum
        for (let i = 0; i < subTotalIdx.length; i++) {
          let totals = yearWiseSum[i]?.total;
          totals.forEach((total, idx) => {
            dispatch(
              table.write({
                point: { x: idx + 4, y: subTotalIdx[i] + 3 },
                value: total.toString(),
              })
            );
          });
        }
        //Appending Grand Total
        for (let i = 0; i < grandTotal.length; i++) {
          dispatch(
            table.write({
              point: { x: i + 4, y: updatedData.length },
              value: grandTotal[i]?.total.toString(),
            })
          );
        }
      }
    }
  };

  const handleTable = (table) => {
    const matrix = table.getMatrixFlatten({});
    setData(matrix);
    calculateSumsAndAppend(matrix);
  };

  const handleDownloadData = (table) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(table);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "output.xlsx");
  };
  return (
    <div className="grid-container bg-light">
      <div className="icons">
        <Button
          disabled
          variant="danger"
          size="sm"
          className=" m-2 text-capitalize text-white"
        >
          <IoIosSave color="white" size={25} /> save
        </Button>
        <Button
          onClick={() => handleDownloadData(data)}
          variant="secondary"
          size="sm"
          className="m-2 text-capitalize text-white"
        >
          <FaCloudDownloadAlt color="white" size={25} /> download
        </Button>
      </div>
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
          },
        })}
        options={{
          onSave: (table) => {
            const matrix = table.getMatrixFlatten({});
            setTsv(matrix.map((cols) => cols.join("\t")).join("\n"));
            handleDownloadData(matrix);
          },
          onChange: (table) => handleTable(table),
        }}
      />{" "}
    </div>
  );
};

export default SpreadSheetTable;
