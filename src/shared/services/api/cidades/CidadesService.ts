import { Environments } from "../../../environments";
import { Api } from "../axios-config";

export interface IlistagemCidades {
    id: string;
    nome: string;
}

export interface IDetalheCidades {
    id: string;
    nome: string;
}

type TCidadesComTotalCount = {
    data: IlistagemCidades[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TCidadesComTotalCount | Error> => {
    try {
        const urlRelativa = `/cidades?_page=${page}&_limit=${Environments.LIMITE_DE_LINHAS}&nome_like=${filter}`;
        const { data, headers } = await Api.get(urlRelativa);
        if (data) {
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
const getById = async (id: string): Promise<Error | IDetalheCidades> => {
    try {
        const { data } = await Api.get(`/cidades/${id}`);
        if (data) {
            return data;
        }
        return new Error('Erro ao consultar o registro.')

    } catch (error) {
        console.log(error);
        return new Error((error as { message: string }).message || 'Erro ao consultar o registro.')
    }
};

const create = async (dados: Omit<IDetalheCidades, 'id'>): Promise<string | Error> => {
    try {
        const { data } = await Api.post<IDetalheCidades>('/cidades', dados);
        if (data) {
            return data.id;
        }
        return new Error('Erro ao criar o registro.')

    } catch (error) {
        console.log(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.')
    }
};

const updateById = async (id: string, dados: IDetalheCidades): Promise<void | Error> => {
    try {
        await Api.put(`/cidades/${id}`, dados);
    } catch (error) {
        console.log(error);
        return new Error((error as { message: string }).message || 'Erro ao alterar o registro.')
    }
};

const deleteById = async (id: string): Promise<void | Error> => {
    try {
        await Api.delete(`/cidades/${id}`);
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