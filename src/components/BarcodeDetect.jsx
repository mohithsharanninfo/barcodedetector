import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { setScannedBarcode } from "../reduxstore/slice";

function BarcodeDetect() {
    const dispatch = useDispatch()
    const [barcode, setBarcode] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            dispatch(setScannedBarcode(barcode));
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
                className="outline-0 border-0 text-[#614119] font-semibold  w-full"
                placeholder="Barcode..."
            />
        </div>
    );
}

export default BarcodeDetect;
