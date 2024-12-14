import { Environments } from "../../../environments";
import { Api } from "../axios-config";

export interface IlistagemPessoas {
    _id : string;
    email: string;
    cidadeId: string;
    nomeCompleto: string;
}

export interface IDetalhePessoas {
    _id : string;
    email: string;
    cidadeId: string;
    nomeCompleto: string;
}

type TPessoasComTotalCount = {
    data: IlistagemPessoas[];
    totalCount: number;
}

const getAll = async (page = 0, filter = ''): Promise<TPessoasComTotalCount | Error> => {
    const urlTotal = `/users`;
    const dataAll = await Api.get(urlTotal)
    let countAllCities = 0
    if (dataAll) {
        countAllCities = dataAll.data.length
    }
    try {
        // const urlRelativa = `/pessoas?_page=${page}&_limit=${Environments.LIMITE_DE_LINHAS}&nomeCompleto_like=${filter}`;
        const urlRelativa = `/users?page=${page}&limit=${Environments.LIMITE_DE_LINHAS}&keywork=${filter}`;
        const { data, headers } = await Api.get(urlRelativa);
        if (data) {
            return {
                data,
                totalCount: countAllCities,
                // totalCount: Number(headers['x-total-count'] || Environments.LIMITE_DE_LINHAS),
            }
        }
        return new Error('Erro ao listar os registros.')

    } catch (error) {
        console.log(error);
        return new Error((error as { message: string }).message || 'Erro ao listar os registros.')
    }
}
const getById = async (_id : string): Promise<Error | IDetalhePessoas> => {
    try {
        const { data } = await Api.get(`/users/${_id}`);
        if (data) {
            return data;
        }
        return new Error('Erro ao consultar o registro.')

    } catch (error) {
        return new Error((error as { message: string }).message || 'Erro ao consultar o registro.')
    }
};

const create = async (dados: Omit<IDetalhePessoas, '_id'>): Promise<string | Error> => {
    try {
        const { data } = await Api.post<IDetalhePessoas>('/users', dados);
        if (data) {
            return data._id ;
        }
        return new Error('Erro ao criar o registro.')

    } catch (error) {
        console.log(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.')
    }
};

const updateById = async (_id : string, dados: IDetalhePessoas): Promise<void | Error> => {
    try {
        await Api.put(`/users/${_id }`, dados);
    } catch (error) {
        console.log(error);
        return new Error((error as { message: string }).message || 'Erro ao alterar o registro.')
    }
};

const deleteById = async (_id : string): Promise<void | Error> => {
    try {
        await Api.delete(`/users/${_id }`);
    } catch (error) {
        console.log(error);
        return new Error((error as { message: string }).message || 'Erro ao deletar o registro.')
    }
};

export const PessoasService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
}