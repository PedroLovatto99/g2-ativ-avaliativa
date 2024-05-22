"use client";

import { useRouter } from "next/navigation";
import { useAuthContext } from "../../context/AuthContext";

function Page() {
  const { userAuth, logout } = useAuthContext();
  const router = useRouter();

  console.log(userAuth);

  if (userAuth == null) {
    router.push("/signin");
    return null;
  }

  return (
    <>
      {userAuth && (
        <section className="min-h-screen bg-gray-800 flex flex-col justify-center items-center">
          <h1 className="text-white text-3xl mb-8">
            Only logged in users can view this page
          </h1>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => logout()}
          >
            Sign Out
          </button>
        </section>
      )}
    </>
  );
}

export default Page;