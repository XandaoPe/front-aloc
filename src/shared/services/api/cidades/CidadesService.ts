import { Environments } from "../../../environments";
import { Api } from "../axios-config";

export interface IlistagemCidades {
    _id: string;
    nome: string;
}

export interface IDetalheCidades {
    _id: string;
    nome: string;
}

type TCidadesComTotalCount = {
    data: IlistagemCidades[];
    totalCount: number;
}

const getAll = async (page = 0, filter = ''): Promise<TCidadesComTotalCount | Error> => {
    const urlTotal = `/cities`;
    const dataAll = await Api.get(urlTotal)
    let countAllCities = 0
    if(dataAll){
        countAllCities = dataAll.data.length
    }
    try {
        // const urlRelativa = `/cities?_page=${page}&_limit=${Environments.LIMITE_DE_LINHAS}&keywork=${filter}`;
        const urlRelativa = `/cities?page=${page}&limit=${Environments.LIMITE_DE_LINHAS}&keywork=${filter}`;

        const { data, headers } = await Api.get(urlRelativa);
        if (data) {
            return {
                data,
                // totalCount: Number(headers['x-total-count']) || Environments.LIMITE_DE_LINHAS,
                totalCount: countAllCities,
            }
        }
        return new Error('Erro ao listar os registros.')

    } catch (error) {
        console.log(error);
        return new Error((error as { message: string }).message || 'Erro ao listar os registros.')
    }
}
const getById = async (_id: string): Promise<Error | IDetalheCidades> => {
    try {
        const { data } = await Api.get(`/cities/${_id}`);
        if (data) {
            return data;
        }
        return new Error('Erro ao consultar o registro.')

    } catch (error) {
        return new Error((error as { message: string }).message || 'Erro ao consultar o registro.')
    }
};

const create = async (dados: Omit<IDetalheCidades, '_id'>): Promise<string | Error> => {
    try {
        const { data } = await Api.post<IDetalheCidades>('/cities', dados);
        if (data) {
            return data._id;
        }
        return new Error('Erro ao criar o registro.')

    } catch (error) {
        console.log(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.')
    }
};

const updateById = async (_id: string, dados: IDetalheCidades): Promise<void | Error> => {
    try {
        await Api.put(`/cities/${_id}`, dados);
    } catch (error) {
        console.log(error);
        return new Error((error as { message: string }).message || 'Erro ao alterar o registro.')
    }
};

const deleteById = async (_id: string): Promise<void | Error> => {
    try {
        await Api.delete(`/cities/${_id}`);
    } catch (error) {
        console.log(error);
        return new Error((error as { message: string }).message || 'Erro ao deletar o registro.')
    }
};

export const CidadesService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
}