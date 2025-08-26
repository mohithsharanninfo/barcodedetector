import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { setBracodeRender, setScannedBarcode } from "../reduxstore/slice";

function BarcodeDetect() {
    const dispatch = useDispatch()
    const [barcode, setBarcode] = useState("");
    const inputRef = useRef(null);
    const [isFocused, setIsFocused] = useState(true);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            dispatch(setScannedBarcode(barcode));
            dispatch(setBracodeRender(barcode + "_" + Date.now()));
            setBarcode("");
            inputRef.current.focus();
        }
    };

    return (
        <div className="w-full">
            <input
                ref={inputRef}
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`outline-0 border-0 w-full font-semibold text-[#614119] 
              ${isFocused ? "placeholder-gray-400" : "placeholder-red-500"}`}
                placeholder={isFocused ? "Barcode..." : "*Click to focus before scanning"}
            />
        </div>
    );
}

export default BarcodeDetect;
