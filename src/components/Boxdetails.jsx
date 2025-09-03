import React, { useMemo, useRef, useState } from 'react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch, useSelector } from "react-redux";
import { setProducts, setViewBoxData } from '../reduxstore/slice';
import toast from 'react-hot-toast';
import axios from 'axios';
import { BASE_URL } from '../constant';
import ReactModal from './ReactModal';
import ViewBoxTable from './ViewBoxTable';

ModuleRegistry.registerModules([AllCommunityModule]);

const Boxdetails = ({ setOpen }) => {
    const dispatch = useDispatch();
    const gridRef = useRef(null);
    const [modelOpen, setModelOpen] = useState(false)

    const boxData = useSelector((state) => state?.product?.boxData);
    const payload = useSelector((state) => state?.product);

    const tableData = useMemo(() => {
        return boxData?.map(item => ({
            box_no: item?.box_no,
            barcode_count: item?.barcode_count,
            gs_code: item?.gs_code
        }));
    }, [boxData]);

    const handleViewClick = async (params) => {
        try {
            const response = await axios.post(`${BASE_URL}/Getpicklistdetails`, {
                branchcode: payload?.branchcode,
                picklistno: payload?.picklistNo
            })
            const result = await response?.data
            if (response.status == 200 && result?.length > 0) {
                const filteredResult = result?.filter(item => item?.box_no === params?.data?.box_no);
                dispatch(setViewBoxData(filteredResult))
            } else {
                toast.error('Items Not Found !')
            }
        } catch (err) {
            throw new Error(err)
        }
        setModelOpen(true)
    }

    const colDefs = useMemo(() => [
        { field: "box_no", headerName: 'Box', flex: 1, minWidth: 100 },
        { field: "barcode_count", headerName: 'Sku Count', flex: 1, minWidth: 100 },
        {
            field: "action",
            headerName: 'Action',
            flex: 1,
            minWidth: 130,
            cellRenderer: (params) => (
               <p  onClick={() => handleViewClick(params)} className='cursor-pointer underline'>View Box</p> 
            )
        }
    ], [payload?.branchcode, payload?.picklistNo]);

    function closeModal() {
        setModelOpen(false);
    }

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
                        rowHeight={35}
                        rowData={tableData}
                        columnDefs={colDefs}
                        pagination={true}
                        paginationPageSize={10}
                        paginationPageSizeSelector={[10, 20, 50, 100]}
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

            <ReactModal modalIsOpen={modelOpen} closeModal={closeModal} >
                <div className='py-4'>
                    <ViewBoxTable />
                </div>
            </ReactModal>
        </>
    );
};

export default Boxdetails;
