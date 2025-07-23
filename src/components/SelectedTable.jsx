import React, { useMemo, useRef, useState } from 'react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch, useSelector } from "react-redux";
import { setSelectedProducts } from '../reduxstore/slice';
import toast from 'react-hot-toast';
import ProductDetails from './ProductDetails';
import ReactModal from './ReactModal';

ModuleRegistry.registerModules([AllCommunityModule]);

const SelectedTable = () => {
    const dispatch = useDispatch();
    const gridRef = useRef(null);
    const [open, setOpen] = useState(false)

    const boxData = useSelector((state) => state?.product?.boxData);

    const tableData = useMemo(() => {
        return boxData?.map(item => ({
            box: item?.box_no,
            count: item?.barcode_count
        }));
    }, [boxData]);

    let subtitle;


    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    function closeModal() {
        setOpen(false);
    }


    const handleViewClick = (box_no) => {
        const productsDetails = boxData.find(item => item.Box_No === box_no);
        if (productsDetails) {
            dispatch(setSelectedProducts(productsDetails));
            toast.success(`Products for ${box_no} fetched.`);
            setOpen(!open)
        } else {
            toast.error(`Products Not Found!`);
        }
    };

    const [colDefs] = useState([
        { field: "box", headerName: 'Box', flex: 1, minWidth: 100 },
        { field: "count", headerName: 'Product Count', flex: 1, minWidth: 120 },
        {
            field: "action",
            headerName: 'Action',
            flex: 1,
            minWidth: 120,
            cellRenderer: (params) => (
                <button
                    onClick={() => handleViewClick(params?.data?.box)}
                    className="bg-[#cd9a50] text-black px-3 py-1 rounded"
                >
                    View
                </button>
            )
        }
    ]);

    return (
        <>
       
            <div className="ag-theme-alpine w-full overflow-x-auto">
                 <p className='text-end text-[#614119] px-1'>Box count:{boxData?.length}</p>
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


            {
                open &&
                <ReactModal modalIsOpen={open} afterOpenModal={afterOpenModal} closeModal={closeModal} >

                    <ProductDetails />

                </ReactModal>

            }
        </>
    );
};

export default SelectedTable;
