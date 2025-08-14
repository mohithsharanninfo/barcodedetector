import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { GoArrowRight } from "react-icons/go";
const ExportToPdf = () => {
    const scannedProducts = useSelector((state) => state?.product?.scannedProducts);
    const exportDataPdf = async () => {
        try {
            const doc = new jsPDF();
            doc.text("Product List", 14, 10);
            const tableColumn = ["SKU", "GS Code", "Item", "Box","Picklist No"];
            const tableRows = scannedProducts?.map((item) => [
                item?.barcode_no,
                item?.gs_code,
                item?.item_name,
                item?.box_no,
                item?.picklistNo,
            ]);
            autoTable(doc, {
                body: [
                    [{ content: 'Text', colSpan: 2, rowSpan: 2, styles: { halign: 'center' } }],
                ],
                head: [tableColumn],
                body: tableRows,
                startY: 20,
            });
            const pdfBlob = doc.output('blob');
            const pdfURL = URL.createObjectURL(pdfBlob);
            doc.save("Product-data.pdf");
            toast.success("Exported Successfully");
        } catch (err) {
            toast.error("Something went wrong");
            throw new Error(err)
        }
    }
    return (
        <div>
            <div className='flex justify-between items-center'>
                <p className='text-[#614119] font-semibold'>Export Scanned Products List<GoArrowRight/></p>
                  <button disabled={scannedProducts?.length <= 0 ? true : false} onClick={() => exportDataPdf()} className={`px-3 py-2 [background:linear-gradient(103.45deg,_rgb(97,65,25)_-11.68%,_rgb(205,154,80)_48.54%,_rgb(97,65,25)_108.76%)] text-amber-50 rounded-sm  ${scannedProducts?.length <= 0 ? "cursor-not-allowed opacity-50" : 'cursor-pointer'}`}>Export PDF</button>
            </div>
        </div>
    )
}

export default ExportToPdf
