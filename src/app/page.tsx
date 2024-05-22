"use client";

import { ref, onValue, push, remove } from "firebase/database";
import { db } from "../services/firebase/firebaseConfiguration";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../context/AuthContext";
import Link from "next/link";

interface ITask {
  [key: string]: {
    titulo: string;
    descricao: string;
    status: string;
    dataFim: Date;
    dataInicio: Date;
    idUsuario: number
  };
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [metas, setMetas] = useState<ITask>({});
  const {userAuth, logout} = useAuthContext();
  const router = useRouter();

  console.log(userAuth);

  if (userAuth == null) {
    router.push("/signin");
    return null;
  }

  useEffect(() => {
    const fetchData = () => {
      const unsubscribe = onValue(ref(db, "/metas"), (querySnapShot) => {
        const metaDados: ITask= querySnapShot.val() || {};
        console.log(metaDados);
        setMetas(metaDados);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchData();
  }, []);

  function deletarMeta(metaKey: string) {
    const userRef = ref(db, `/metas/${metaKey}`);
    remove(userRef);
  }

  return (
    <div className="min-h-screen bg-gray-800 py-6 text-center flex flex-col justify-center sm:py-12">
      <div>
          <Link href={`/novasmetas/`}>
              <button className="bg-green-500 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
                    Criar nova meta
              </button>
            </Link>
            <button
                onClick={() => logout()}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                Sair
              </button>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 m-12">
        {!loading &&
          Object.keys(metas)
          .map((metaId) => (
           // if(metaId.idUsuario == userAuth.uid) {
              <div key={metaId} className="relative py-3">
                <div className="max-w-md mx-auto">
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                  <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">

                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                      {loading
                        ? "Carregando..."
                        : `${metas[metaId].titulo}`.toUpperCase()}
                    </h2>
                    <div className="my-4">
                      <p className="text-gray-700">{`Descrição: ${metas[metaId].descricao}`}</p>
                      <p className="text-gray-700">{`Status: ${metas[metaId].status}`}</p>
                      <p className="text-gray-700">{`Data de início: ${metas[metaId].dataInicio}`}</p>
                      <p className="text-gray-700">{`Data de fim: ${metas[metaId].dataFim}`}</p>

                      <div className="flex justify-center space-x-4 mt-4">
                        <button
                          onClick={() => deletarMeta(metaId)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
      </div>
    </div>
  );
}