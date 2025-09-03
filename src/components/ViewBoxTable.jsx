import { AgGridReact } from 'ag-grid-react';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';

const ViewBoxTable = () => {
    const barcode = useSelector((state) => state?.product?.scannedBarcode);
    const scannedProducts = useSelector((state) => state?.product?.scannedProducts);
    const viewboxdetails = useSelector((state) => state?.product?.viewBoxData);

    const [colDefs] = useState([
        { field: "barcode_no", headerName: 'Sku', flex: 1, minWidth: 100 },
        { field: "gs_code", headerName: 'GS Code', flex: 1, minWidth: 100 },
        { field: "item_name", headerName: 'Item', flex: 1, minWidth: 100 },
        { field: "box_no", headerName: 'Box', flex: 1, minWidth: 100 },
    ]);
    return (
        <div className="ag-theme-alpine w-full overflow-x-auto">
            <div className='w-full '>
                <AgGridReact
                    rowHeight={35}
                    rowData={viewboxdetails}
                    columnDefs={colDefs}
                    getRowId={(params) => params.data.barcode_no}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={[5, 10, 20, 50, 100]}
                    getRowClass={(params) => {
                        const rowBarcode = params?.data?.barcode_no;
                        if (!rowBarcode) return ''; // <-- don't highlight if barcode is missing
                        if (rowBarcode === barcode) return 'highlight-row';
                        if (scannedProducts?.some(p => p.barcode_no === rowBarcode)) return 'highlight-row';
                        return '';
                    }}
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
        </div>
    )
}

export default ViewBoxTable