import React, { useState } from 'react'
import Select from 'react-select'
import boxData from '../utils/staticData'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../reduxstore/slice';

const SelectInput = () => {
    const [selectedOption, setSelectedOption] = useState(null);

    const productData = useSelector((state) => state?.product?.products);
    const dispatch = useDispatch()

    const options = boxData?.map((item) => ({
        value: item?.box_no,
        label: item?.box_no
    }));

    const colourStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: 'transparent',
            borderColor: '#cd9a50',
            boxShadow: 'none',
            width: '100%',
            '&:hover': {
                borderColor: '#cd9a50'
            }
        }),
        menu: (styles) => ({
            ...styles,
            zIndex: 9999
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999
        })
    };

    const handleChange = (option) => {
        setSelectedOption(option);
        if (!option) {
            //dispatch(setProducts(picklist));
            return;
        }

        const searchByBox = productData?.filter((item) => item?.box_no === option?.value);
        dispatch(setProducts(searchByBox));

        if (searchByBox?.length > 0) {
            toast.success(`Products Fetched`);
        } else {
            toast.error(`Products Not Found!`);
        }
    };

    const handleMenuOpen = () => {
        setSelectedOption(null);
        //dispatch(setProducts(picklist));// Clear the selection when user clicks the box
    };

    return (
        <div>
            <Select
                options={options}
                styles={colourStyles}
                value={selectedOption}
                onChange={handleChange}
                onFocus={handleMenuOpen}  // This clears selection when clicking select
                placeholder="Box No."
                isClearable
            />
        </div>
    );
}

export default SelectInput;
