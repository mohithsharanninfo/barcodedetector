import getScannedProductsByDate from "./api/fetchDexie";
import AgGridTable from "./components/AgGridTable";
import BarcodeDetect from "./components/BarcodeDetect";
import Boxdetails from "./components/Boxdetails";
import { useEffect, useRef, useState } from "react";
import { LiaBarcodeSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import { setBoxData, setBranchCode, setPicklistNo, setScannedProducts } from "./reduxstore/slice";
import db from "./utils/db";
import toast from "react-hot-toast";
import axios from 'axios'
import { BASE_URL } from "./constant";
import ReactModal from "./components/ReactModal";
import { useForm } from 'react-hook-form';


function App() {
  const dispatch = useDispatch()
  const productData = useSelector((state) => state?.product?.products);
  const scannedProducts = useSelector((state) => state?.product?.scannedProducts);
  const deferredPromptRef = useRef(null);
  const [open, setOpen] = useState(true)
  const [isloading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function closeModal() {
    setOpen(false);
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
  
    dispatch(setPicklistNo(data?.picklistno))
    dispatch(setBranchCode(data?.branchcode))

    try {
      const response = await axios.post(`${BASE_URL}/Getpicklistsummary`, {
        branchcode: data?.branchcode,
        picklistno: data?.picklistno
      })
      const result = await response?.data
      if (response?.status == 200) {
        dispatch(setBoxData(result))
        if (result?.length > 0) {
          toast.success('Picklist Found !')
        } else {
          toast.error('Picklist Not Found !')
        }
      }
    } catch (err) {
      throw new Error(err)
    }
    finally {
      setOpen(false)
      setIsLoading(false)
    }
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

  return (
    <div className="">
      <div className="text-center font-semibold lg:mb-10 mb-4 text-lg text-white [background:linear-gradient(103.45deg,_rgb(97,65,25)_-11.68%,_rgb(205,154,80)_48.54%,_rgb(97,65,25)_108.76%)] shadow-2xl py-2 ">BARCODE  DETECTOR</div>

      <div className="flex items-center justify-center lg:my-5 my-8  ">
        <Boxdetails setOpen={setOpen} />
      </div>

      {
        productData?.length > 0 &&
        <>
          <div className=" flex my-3" >
            <div className="w-full">

              <div className="flex justify-between items-center w-full">
                <label className="text-[#614119] font-semibold">
                  Search | Scan Barcode
                </label>
                {/* <p className="underline text-[#614119] text-sm font-semibold cursor-pointer" onClick={() => fetchTodayScannedData()} >Previous Scanned</p> */}
              </div>
              <div className="flex items-center gap-2 py-2 pl-1 border border-[#cd9a50]  rounded cursor-pointer">
                <LiaBarcodeSolid color="#cd9a50" />
                <BarcodeDetect />
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-x-2 text-[#614119]">
            <p className="font-bold">Total:&nbsp;{productData?.length}</p>{'|'}
            <p className="font-bold">Pending:&nbsp;{productData?.length - scannedProducts?.length}</p>{'|'}
            <p className="font-bold">Picked:&nbsp;{scannedProducts?.length}</p>
          </div>

          <div className="flex items-center justify-center lg:my-5">
            <AgGridTable />
          </div>
        </>
      }

      <ReactModal modalIsOpen={open} closeModal={closeModal} >
        <form
          className="grid gap-y-5"
          onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full">
            <p className="text-[#614119] font-semibold">Enter Branch Code.</p>
            <div className="w-full grid gap-y-1">
              <input
                id="branchcode"
                type="text"
                placeholder="Branch Code"
                className={`outline-none border ${errors?.branchcode ? 'border-red-500' : 'border-[#cd9a50]'
                  }  p-2 rounded-sm `}
                {...register('branchcode', {
                  required: 'Branch Code is required',
                })}
              />
              {errors?.branchcode && (
                <p className="text-red-500 text-sm">{errors?.branchcode?.message}</p>
              )}
            </div>
          </div>
          <div className="w-full">
            <p className="text-[#614119] font-semibold">Enter Picklist No.</p>
            <div className="w-full grid gap-y-1">
              <input
                id="picklistno"
                type="text"
                placeholder="Picklist No."
                className={`outline-none border ${errors?.picklistno ? 'border-red-500' : 'border-[#cd9a50]'
                  } p-2 rounded-sm`}
                {...register('picklistno', {
                  required: 'Picklist No is required',
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: 'Picklist no. must be 6 digits',
                  },
                })}
              />
              {errors?.picklistno && (
                <p className="text-red-500 text-sm">{errors?.picklistno?.message}</p>
              )}
            </div>
          </div>
          <div className="w-full">
            <button type="submit" className={`px-3 py-2 [background:linear-gradient(103.45deg,_rgb(97,65,25)_-11.68%,_rgb(205,154,80)_48.54%,_rgb(97,65,25)_108.76%)] text-amber-50 rounded-sm cursor-pointer `}>{isloading?'Loading...':'Get Picklist Details'}</button>
          </div>
        </form>

      </ReactModal>
    </div>
  )
}

export default App