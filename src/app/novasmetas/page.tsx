"use client";

import { ref, onValue, push } from "firebase/database";
import { db } from "../../services/firebase/firebaseConfiguration";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../context/AuthContext";
import * as yup from 'yup'; // aqui tem que importar a biblioteca, qualquer coisa usem o comando npm install yup

const today = new Date().toISOString().split('T')[0];

const createMetasSchema = yup.object().shape({
  titulo: yup.string()
    .required("O título é obrigatório")
    .min(3, "O título deve ter pelo menos 3 caracteres"),
  descricao: yup.string()
    .required("A descrição é obrigatória")
    .min(3, "A descrição deve ter pelo menos 20 caracteres"),
  dataInicio: yup.date()
    .required('A data de início é obrigatória')
    .min(today, 'A data de início não pode ser menor que a data atual'),
  dataFim: yup.date()
    .required('A data de conclusão é obrigatória')
    .when('dataInicio', (dataInicio, data) => dataInicio ? data.min(dataInicio,
      'A data de conclusão não pode ser menor que a data de início') : data),
  status: yup.string()
    .required("O status é obrigatório"),
});

interface IMetas {
  [key: string]: {
    titulo: "",
    descricao: "",
    dataInicio: Date;
    dataFim: Date,
    status: "",
    idUsuario: "",
  };
}

export default function Home() {
  const router = useRouter();
  const { userAuth, logout } = useAuthContext();
  const [novaMeta, setNovaMeta] = useState({
    titulo: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
    status: "",
    idUsuario: "",
  });

  const validaCampos = async () => {
    try {
      await createMetasSchema.validate(novaMeta, { abortEarly: false });
      return true;

    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const erroMsg = error.inner.map(err => err.message).join('\n');
        alert(erroMsg);
      }
      return false;
    }
  }


  const addNovaMeta = async () => {
    const Validou = await validaCampos();
    if (!Validou) {
      return;
    }
    novaMeta.idUsuario = userAuth!.uid
    push(ref(db, "/metas"), novaMeta);
    setNovaMeta({ titulo: "", descricao: "", dataInicio: "", dataFim: "", status: "", idUsuario: userAuth!.uid });
    console.log("uid:", userAuth!.uid)
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-800 py-6 flex flex-col justify-center sm:py-12">
      <div className="max-w-md mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addNovaMeta();
          }}
        >
          <div className="mb-4">
            <h2 className="text-center text-3xl mb-8 font-extrabold text-white">
              Cadastrar meta
            </h2>
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="titulo"
            >
              Título:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="titulo"
              type="text"
              placeholder="Titulo"
              value={novaMeta.titulo}
              onChange={(e) =>
                setNovaMeta({ ...novaMeta, titulo: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="descricao"
            >
              Descricao:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="descricao"
              type="text"
              placeholder="Descricao"
              value={novaMeta.descricao}
              onChange={(e) =>
                setNovaMeta({ ...novaMeta, descricao: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="dataInicio"
            >
              Data de Inicio:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="dataInicio"
              type="Date"
              placeholder="DataInicio"
              value={novaMeta.dataInicio.toString()}
              onChange={(e) =>
                setNovaMeta({ ...novaMeta, dataInicio: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="dataFim"
            >
              Data de conclusão:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="dataFim"
              type="Date"
              placeholder="DataFim"
              value={novaMeta.dataFim.toString()}
              onChange={(e) =>
                setNovaMeta({ ...novaMeta, dataFim: e.target.value })
              }
            />
          </div>
          <div className="mb-8">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="status"
            >
              Status:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="status"
              type="boolean"
              placeholder="Status"
              value={novaMeta.status}
              onChange={(e) =>
                setNovaMeta({ ...novaMeta, status: e.target.value })
              }
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Adicionar meta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}