import React, { useMemo, useRef, useState } from 'react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from '../reduxstore/slice';
import toast from 'react-hot-toast';
import axios from 'axios';
import { BASE_URL } from '../constant';

ModuleRegistry.registerModules([AllCommunityModule]);

const Boxdetails = ({ setOpen }) => {
    const dispatch = useDispatch();
    const gridRef = useRef(null);

    const boxData = useSelector((state) => state?.product?.boxData);
    const payload = useSelector((state) => state?.product);

    const tableData = useMemo(() => {
        return boxData?.map(item => ({
            box_no: item?.box_no,
            barcode_count: item?.barcode_count,
            gs_code: item?.gs_code
        }));
    }, [boxData]);


    // const handleViewClick = async () => {
    //     try {
    //         const response = await axios.post(`${BASE_URL}/Getpicklistdetails`, {
    //             branchcode: payload?.branchcode,
    //             picklistno: payload?.picklistNo
    //         })
    //         const result = await response?.data
    //         if (response.status == 200 && result?.length > 0) {
    //             dispatch(setProducts(result))
    //             toast.success('Products Found !')
    //         } else {
    //             toast.error('Products Not Found !')
    //         }
    //     } catch (err) {
    //         throw new Error(err)
    //     }
    // };

    const colDefs = useMemo(() => [
        { field: "box_no", headerName: 'Box', flex: 1, minWidth: 100 },
        { field: "barcode_count", headerName: 'Sku Count', flex: 1, minWidth: 100 },
         { field: "gs_code", headerName: 'Gs Code', flex: 1, minWidth: 100 },
        // {
        //     field: "action",
        //     headerName: 'Action',
        //     flex: 1,
        //     minWidth: 130,
        //     cellRenderer: (params) => (
        //         <button
        //          disabled={true}
        //             //onClick={() => handleViewClick()}
        //             className="bg-[#cd9a50] opacity-50 text-black px-2 text-sm py-1 rounded cursor-not-allowed"              
        //         >
        //            View
        //         </button>
        //     )
        // }
    ], [payload?.branchcode, payload?.picklistNo]);

    return (
        <>
            <div className="ag-theme-alpine w-full overflow-x-auto">
                <div className='flex justify-between items-center'>
                    <p className='text-start text-[#614119] font-semibold px-1 my-3'>Picklist No:</p>
                    <input readOnly placeholder='Picklist' className='text-center border font-bold cursor-not-allowed  border-[#614119] py-1 bg-gray-300 outline-none' value={payload?.picklistNo} />
                </div>

                <div className='flex justify-between items-center my-2'>
                    <p className='text-start text-[#614119] font-semibold px-1'>Box Count:&nbsp;{boxData?.length}</p>
                    <p onClick={() => {
                        setOpen(true)
                        dispatch(setProducts([]))
                    }} className='text-start text-[#614119] cursor-pointer underline font-semibold px-1'>Enter Picklist No.</p>
                </div>

                <div className='w-full'>
                    <AgGridReact
                        ref={gridRef}
                        rowHeight={50}
                        rowData={tableData}
                        columnDefs={colDefs}
                        pagination={true}
                        paginationPageSize={5}
                        paginationPageSizeSelector={[5, 10, 20, 50, 100]}
                        rowSelection="single"
                        defaultColDef={{
                            resizable: false,
                            sortable: false,
                            filter: false,
                            suppressMovable: true,
                            cellStyle: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }
                        }}
                        domLayout="autoHeight"
                    />
                </div>
            </div>
        </>
    );
};

export default Boxdetails;
