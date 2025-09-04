import { useEffect, useState } from "react";

function UpdateNotifier() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const handler = () => setUpdateAvailable(true);
    window.addEventListener("newUpdateAvailable", handler);
    return () => window.removeEventListener("newUpdateAvailable", handler);
  }, []);

  if (!updateAvailable) return null;

  return (
    <div className=" bg-yellow-500 w-fit text-white px-2 py-1 rounded shadow-lg z-50 flex items-center">
      New updates available!
      <button
        className="ml-2 bg-white text-yellow-600 px-2  rounded cursor-pointer"
        onClick={() => window.location.reload()}
      >
        Update
      </button>
    </div>
  );
}

export default UpdateNotifier;