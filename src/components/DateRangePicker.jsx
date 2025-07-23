import React, { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useDispatch } from "react-redux";
import { setEndDate, setProducts, setStartDate } from "../reduxstore/slice";
import { BASE_URL } from "../constant";
import axios from "axios";
import toast from "react-hot-toast";

const DateRangePickerPopup = () => {
  const dispatch = useDispatch()

  const [showPicker, setShowPicker] = useState(false);
  const [selectionCount, setSelectionCount] = useState(0);
  const [range, setRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

  const pickerRef = useRef();

  // Close picker when clicking outside
  const handleClickOutside = (e) => {
    if (pickerRef.current && !pickerRef.current.contains(e.target)) {
      setShowPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRangeChange = (item) => {
    const { startDate, endDate } = item.selection;
    setRange([item.selection]);
    if (selectionCount === 0) {
      setSelectionCount(1);  // First click (start date)
    } else {
      // Second click (end date)
      dispatch(setStartDate(format(startDate, "yyyy-MM-dd")));
      dispatch(setEndDate(format(endDate, "yyyy-MM-dd")));
      getProducts(startDate, endDate)
      setShowPicker(false);
      setSelectionCount(0);
    }
  };


  const displayText = range[0].startDate && range[0].endDate
    ? `${format(range[0].startDate, "yyyy-MM-dd")} - ${format(range[0].endDate, "yyyy-MM-dd")}`
    : "----select date----";


  const getProducts = async (startDate, endDate) => {
    try {
      const result = await axios.post(`${BASE_URL}/Getpicklistdetails`, {
        fromdate: startDate,
        todate: endDate
      })
      const response = result?.data
      if (result.status === 200) {
        dispatch(setProducts(response))
        toast(`Products Found ${response?.length} !`, {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
    } catch (err) {
      throw new Error(err)
    }
  }



  return (
    <div className="relative inline-block  w-full " ref={pickerRef}>
      <div
        onClick={() => {
          setSelectionCount(0);
          setShowPicker((prev) => !prev);
        }}
        className="flex items-center gap-2 p-2 border border-[#cd9a50]  rounded cursor-pointer"
      >
        <FaCalendarAlt color="#cd9a50" />
        <span className={` ${range[0].startDate && range[0].endDate ? 'text-[#614119]' : 'text-[#927d64]'} font-semibold`}>
          {displayText}
        </span>
      </div>

      {showPicker && (
        <div className="absolute z-10 mt-2 -left-10  shadow-lg ">
          <DateRange
            editableDateInputs={true}
            onChange={handleRangeChange}
            moveRangeOnFirstSelection={false}
            ranges={range}
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePickerPopup;




// const handleRangeChange = (item) => {
//   const { startDate, endDate } = item.selection;
//   setRange([item.selection]);
//   if (startDate && endDate && startDate.getTime() !== endDate.getTime()) {
//     dispatch(setStartDate(format(startDate, "yyyy-MM-dd")));
//     dispatch(setEndDate(format(endDate, "yyyy-MM-dd")));
//     setShowPicker(false);
//   }
// };