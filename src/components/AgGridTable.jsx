import React, { useState, useRef, useEffect } from 'react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import ExportToPdf from './ExportToPdf';
import { setScannedProducts } from '../reduxstore/slice';
import db from '../utils/db';

ModuleRegistry.registerModules([AllCommunityModule]);

const AgGridTable = () => {

    const gridRef = useRef();
    const dispatch = useDispatch()
    const barcode = useSelector((state) => state?.product?.scannedBarcode);
    const rerender = useSelector((state) => state?.product?.barcodeRender);
    const scannedProducts = useSelector((state) => state?.product?.scannedProducts);
    const productData = useSelector((state) => state?.product?.products);
    const picklistNo = useSelector((state) => state?.product?.picklistNo);

    const [colDefs] = useState([
        { field: "barcode_no", headerName: 'Sku', flex: 1, minWidth: 100 },
        { field: "gs_code", headerName: 'GS Code', flex: 1, minWidth: 100 },
        { field: "item_name", headerName: 'Item', flex: 1, minWidth: 80 },
        { field: "box_no", headerName: 'Box', flex: 1, minWidth: 80 },
    ]);

    useEffect(() => {
        if (!barcode || !gridRef.current?.api) return;
        let rows = productData?.find((item) => item?.barcode_no === barcode)

        if (rows) {
            dispatch(setScannedProducts({ ...rows, picklistNo }));
        }
        const api = gridRef.current.api;

        // 1️⃣ Find the index of the target row
        const targetIndex = productData?.findIndex(row => row?.barcode_no === barcode);

        if (targetIndex !== -1) {
            const pageSize = api.paginationGetPageSize();
            const targetPage = Math.floor(targetIndex / pageSize);

            // 2️⃣ Go to the page containing the scanned item
            api.paginationGoToPage(targetPage);

            // 3️⃣ After small delay, highlight the row
            setTimeout(async () => {
                const rowNode = api.getRowNode(barcode);

                if (rowNode) {
                    const exists = await scannedProducts?.some(p => p.barcode_no === rowNode.id);

                    if (!exists) {
                        const currentTime = new Date().toISOString().split('T')[0];

                        db.scanned_products?.add({
                            data: { ...rows, picklistNo },
                            dateTime: currentTime
                        });

                        toast.success(`${rowNode.id} Product Found!`);
                    } else {
                        toast.success(`${rowNode.id} Product Already Selected!`);
                    }

                    rowNode.setSelected(true);
                    api.ensureNodeVisible(rowNode);
                }
            }, 100);
        } else {
            new Audio('/error.mp3').play();
            toast.error(`${barcode} Product Not Found!`);
        }
    }, [barcode, rerender]);



    return (
        <>

            <div className="ag-theme-alpine w-full overflow-x-auto">
                <div className='w-full '>
                    <AgGridReact
                        ref={gridRef}
                        rowHeight={50}
                        rowData={productData}
                        columnDefs={colDefs}
                        rowSelection={{ type: 'single' }}
                        getRowId={(params) => params.data.barcode_no}
                        pagination={true}
                        paginationPageSize={5}
                        paginationPageSizeSelector={[5, 10, 20, 50, 100]}
                        getRowClass={(params) => {
                            const rowBarcode = params?.data?.barcode_no;
                            if (!rowBarcode) return ''; // <-- don't highlight if barcode is missing
                            if (rowBarcode === barcode) return 'highlight-row';
                            if (scannedProducts?.some(p => p.barcode_no === rowBarcode)) return 'highlight-row';
                            return '';
                        }}
                        // getRowClass={(params) => {
                        //     return params.data.barcode_no === barcode ? 'highlight-row' : scannedProducts?.some(p => p.barcode_no === params?.data?.barcode_no) ? 'highlight-row' : '';
                        // }}
                        defaultColDef={{
                            resizable: false,
                            sortable: false,
                            filter: false,
                            suppressMovable: true,
                            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
                        }}
                        domLayout="autoHeight"
                    />
                </div>
                <div className=" mt-2">
                    <ExportToPdf />

                </div>
            </div>


        </>
    );
};

export default AgGridTable;

