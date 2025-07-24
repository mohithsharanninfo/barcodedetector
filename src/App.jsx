import getScannedProductsByDate from "./api/fetchDexie";
import AgGridTable from "./components/AgGridTable";
import BarcodeDetect from "./components/BarcodeDetect";
import DateRangePickerComponent from "./components/DateRangePicker"
import SelectedTable from "./components/SelectedTable";
import { useEffect, useRef, useState } from "react";
import { LiaBarcodeSolid } from "react-icons/lia";
import { useDispatch } from "react-redux";
import { setBoxData, setProducts, setScannedProducts } from "./reduxstore/slice";
import db from "./utils/db";
import toast from "react-hot-toast";
import axios from 'axios'
import { BASE_URL } from "./constant";
import picklist from "./utils/staticData";
import SelectInput from "./components/SelectInput";


function App() {
  const dispatch = useDispatch()
  const [view, setView] = useState(false)
  const [loading, setloading] = useState(true)
  const deferredPromptRef = useRef(null);

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
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      showInstallToast();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const showInstallToast = () => {
    toast.custom((t) => (
      <div
        className={`${t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full mx-2 bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 ">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <img
                className="h-10 w-10 rounded-full"
                src="/android-chrome-512x512.png"
                alt=""
              />
            </div>
            <div className="ml-3 flex-1">
              <p className="mt-1 text-sm text-gray-500">
                For better user experience !
              </p>
              <p className="text-sm font-medium text-gray-900">
                <button onClick={showInstallPrompt}>
                  Install App
                </button>
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 "
          >
            Close
          </button>
        </div>
      </div>
    ))
  };

  function showInstallPrompt() {
    const deferredPrompt = deferredPromptRef.current;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        deferredPromptRef.current = null;
      });
    }
  }

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
        <div className="w-full">
          <label className="text-[#614119] font-semibold">
            Search | Scan Barcode
          </label>
          <div className="flex items-center gap-2 py-2 pl-1 border border-[#cd9a50]  rounded cursor-pointer">
            <LiaBarcodeSolid color="#cd9a50" />
            <BarcodeDetect />
          </div>
        </div>
        <div className="w-full">
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
