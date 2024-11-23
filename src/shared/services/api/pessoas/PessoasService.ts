import { Environments } from "../../../environments";
import { Api } from "../axios-config";

export interface IlistagemPessoas {
    id: string;
    email: string;
    cidadeId: string;
    nomeCompleto: string;
}

export interface IDetalhePessoas {
    id: string;
    email: string;
    cidadeId: string;
    nomeCompleto: string;
}

type TPessoasComTotalCount = {
    data: IlistagemPessoas[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TPessoasComTotalCount | Error> => {
    try {
        const urlRelativa = `/pessoas?_page=${page}&_limit=${Environments.LIMITE_DE_LINHAS}&nomeCompleto_like=${filter}`;
        const { data, headers } = await Api.get(urlRelativa);
        if (data) {
            console.log('data...', data)
            return {
                data,
                totalCount: Number(headers['x-total-count'] || Environments.LIMITE_DE_LINHAS),
            }
        }
        return new Error('Erro ao listar os registros.')

    } catch (error) {
        console.log(error);
        return new Error((error as { message: string }).message || 'Erro ao listar os registros.')
    }
}
const getById = async (id: string): Promise<TPessoasComTotalCount | Error> => {
    try {
        const { data } = await Api.get(`/pessoas/${id}`);
        if (data) {
            return data;
        }
        return new Error('Erro ao consultar o registro.')

    } catch (error) {
        console.log(error);
        return new Error((error as { message: string }).message || 'Erro ao consultar o registro.')
    }
};

const create = async (dados: Omit<IDetalhePessoas, 'id'>): Promise<string | Error> => {
    try {
        const { data } = await Api.post<IDetalhePessoas>('/pessoas', dados);
        if (data) {
            return data.id;
        }
        return new Error('Erro ao criar o registro.')

    } catch (error) {
        console.log(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.')
    }
};

const updateById = async (id: string, dados: IDetalhePessoas): Promise<void | Error> => {
    try {
        await Api.put(`/pessoas/${id}`, dados);
    } catch (error) {
        console.log(error);
        return new Error((error as { message: string }).message || 'Erro ao alterar o registro.')
    }
};

const deleteById = async (id: string): Promise<void | Error> => {
    try {
        await Api.delete(`/pessoas/${id}`);
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