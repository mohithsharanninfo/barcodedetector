import React, {  useRef, useState } from 'react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useSelector } from 'react-redux';


ModuleRegistry.registerModules([AllCommunityModule]);

const ProductDetails = () => {
    const gridRef = useRef(null);
    const ProductsDetails = useSelector((state) => state?.product?.selectedProducts);

    const [colDefs] = useState([
          { field: "barcode_no", headerName: 'Sku', flex: 1, minWidth: 100 },
        { field: "gs_code", headerName: 'GS Code', flex: 1, minWidth: 100 },
        { field: "item_name", headerName: 'Item', flex: 1, minWidth: 80 },
        { field: "Box_No", headerName: 'Box', flex: 1, minWidth: 80 },
    ]);

    return (
        <>
            <p className='my-2 text-[#614119] font-semibold'>Product Details For Box : {ProductsDetails.box_no}</p>
            <div className="ag-theme-alpine w-full overflow-x-auto">
                <div className='w-full'>
                    <AgGridReact
                        ref={gridRef}
                        rowHeight={50}
                        rowData={ProductsDetails}
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
                                justifyContent: 'center',
                            }
                        }}
                        domLayout="autoHeight"
                    />
                </div>
            </div>

        </>
    );
};

export default ProductDetails;
