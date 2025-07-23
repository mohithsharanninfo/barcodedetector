import getScannedProductsByDate from "./api/fetchDexie";
import AgGridTable from "./components/AgGridTable";
import BarcodeDetect from "./components/BarcodeDetect";
import DateRangePickerComponent from "./components/DateRangePicker"
import SelectedTable from "./components/SelectedTable";
import { useEffect, useState } from "react";
import { LiaBarcodeSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import { setBoxData, setProducts, setScannedProducts } from "./reduxstore/slice";
import db from "./utils/db";
import toast from "react-hot-toast";
import axios from 'axios'
import { BASE_URL } from "./constant";
import picklist from "./utils/staticData";
import SelectInput from "./components/SelectInput";
import InstallButton from "./components/InstallApp";


function App() {
  const dispatch = useDispatch()
  const [view, setView] = useState(false)
  const [loading, setloading] = useState(true)

  const ViewBoxDetails = async () => {
    setView(!view)
    setloading(false)
    // try {
    //   const response = await axios.post(`${BASE_URL}/Getpicklistsummary`, {
    //     fromdate: startDate,
    //     todate: endDate
    //   })
    //   const result = await response?.data

    //   dispatch(setBoxData(result))
    // } catch (err) {
    //   throw new Error(err)
    // } finally {
    //   setloading(false)
    // }

  }

  const fetchTodayScannedData = async () => {
      //db.scanned_products.clear();  
    const today = new Date().toISOString().split('T')[0];
    const scannedToday = await getScannedProductsByDate(today);
    if (scannedToday?.length > 0) {
      scannedToday.map((item) => dispatch(setScannedProducts(item?.data)))
    } else {
      toast.error(`No scanned products found!`);
    }
  
  };

  useEffect(() => {
    dispatch(setProducts(picklist))
  }, [])
  



  return (
    <div className="">
      <div className="text-center font-semibold lg:mb-10 mb-4 text-lg text-white [background:linear-gradient(103.45deg,_rgb(97,65,25)_-11.68%,_rgb(205,154,80)_48.54%,_rgb(97,65,25)_108.76%)] shadow-2xl py-2 ">BARCODE  DETECTOR</div>
      <div className=" grid md:flex md:flex-row lg:flex lg:flex-row lg:justify-start   items-center justify-center  lg:gap-10 gap-4" >
        <div className="w-full">
          <p className="text-[#614119] font-semibold">Search Box No.</p>
          <div><SelectInput /></div>
        </div>
        <div  className="w-full">
          <label className="text-[#614119] font-semibold">
            Search | Scan Barcode
          </label>
          <div className="flex items-center gap-2 py-2 pl-1 border border-[#cd9a50]  rounded cursor-pointer">
            <LiaBarcodeSolid color="#cd9a50" />
            <BarcodeDetect />
          </div>
        </div>
        <div  className="w-full">
          {view ?
            <label onClick={() => setView(false)} className="text-[#614119] font-semibold underline cursor-pointer">
              Close Box Details
            </label> :
            <label onClick={() => ViewBoxDetails()} className={`text-[#614119] font-semibold underline cursor-pointer} `}>
              View Box Details
            </label>
          }

        </div>
      </div>
      {
        view && loading ? <p className="text-center text-[#614119]">Loading....</p> :
          <>
            {
              view && !loading &&
              <div className="flex items-center justify-center lg:my-5 my-4  ">
                <SelectedTable />
              </div>
            }
          </>

      }

      <div className="flex justify-end w-full">
        <p className="underline text-[#614119] text-sm cursor-pointer px-1" onClick={() => fetchTodayScannedData()} >Fetch Scanned Products</p>
      </div>

      <div className="flex items-center justify-center lg:my-5  ">
        <AgGridTable />
      </div>
    </div>
  )
}

export default App
