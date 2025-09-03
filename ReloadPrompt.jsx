import { useRegisterSW } from "virtual:pwa-register/react";

export default function ReloadPrompt() {
  const {
    needRefresh,      // true if a new version is available
    updateServiceWorker,
  } = useRegisterSW();

  console.log("needRefresh", needRefresh);

    console.log("updateServiceWorker", updateServiceWorker);

  return (
    needRefresh && (
      <div className=" bottom-4 right-4 bg-yellow-400 text-black p-1 rounded-lg shadow-lg">
        🔄 New update available! Do ctrl+f5  OR
        <button
          className="ml-2 px-2 py-1 bg-black text-white rounded cursor-pointer"
          onClick={() => updateServiceWorker(true)}
        >
          Refresh
        </button>
      </div>
    )
  );
}
