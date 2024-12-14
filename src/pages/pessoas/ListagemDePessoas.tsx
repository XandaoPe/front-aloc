import { useNavigate, useSearchParams } from "react-router-dom"
import { FerramentasDaListagem } from "../../shared/components"
import { LayoutBasePagina } from "../../shared/layouts"
import { useEffect, useMemo, useState } from "react";
import { IlistagemPessoas, PessoasService } from "../../shared/services/api/pessoas/PessoasService";
import { useDebounce } from "../../shared/hooks";
import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { Environments } from "../../shared/environments";


export const ListagemDePessoas: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce(300);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [rows, setRows] = useState<IlistagemPessoas[]>([]);
    const [totalCount, setTotalCount] = useState(0);

    const busca = useMemo(() => {
        return searchParams.get('busca') || '';
    }, [searchParams]);

    const pagina = useMemo(() => {
        return Number(searchParams.get('page') || '1');
    }, [searchParams]);

    useEffect(() => {
        setIsLoading(true)
        debounce(() => {
            PessoasService.getAll(pagina, busca)
                .then((result) => {
                    setIsLoading(false)
                    if (result instanceof Error) {
                        alert(result.message)
                        return
                    } else {
                        setRows(result.data)
                        setTotalCount(result.totalCount)
                    }
                })
        })
    }, [busca, pagina])

    const handleDelete = (_id :string) =>{
        // eslint-disable-next-line
        if(confirm('Deseja realmente excluir este registro?')){
            PessoasService.deleteById(_id )
            .then(result =>{
                if(result instanceof Error){
                    alert(result.message)
                } else {
                    setRows(oldRows => [
                            ...oldRows.filter(oldRow => oldRow._id  !== _id ),
                        ]);
                    alert('Registro deletado com sucesso !')
                }
            })
        }
    }

    return (
        <LayoutBasePagina
            titulo="Listagem de Pessoas"
            barraDeFerramentas={
                <FerramentasDaListagem
                    mostrarInputBusca
                    textoBotaoNovo="Nova"
                    textoDaBusca={busca}
                    aoClicarEmNovo={()=> navigate('/users/detalhe/nova')}
                    aoMudarTextoDaBusca={texto => setSearchParams({ busca: texto, pagina: '1' }, { replace: true })}
                />
            }
        >
            <TableContainer component={Paper} variant="outlined" sx={{ margin: 1, width: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width={100}>Açôes</TableCell>
                            <TableCell>Nome Completo</TableCell>
                            <TableCell>Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(row => (
                            <TableRow key={row._id }>
                                <TableCell>
                                    <IconButton size="small" onClick={()=> handleDelete(row._id )}>
                                        <Icon>delete</Icon>
                                    </IconButton>
                                    <IconButton size="small" onClick={()=> navigate(`/users/detalhe/${row._id }`)}>
                                        <Icon>edit</Icon>
                                    </IconButton>
                                </TableCell>
                                <TableCell>{row.nomeCompleto}</TableCell>
                                <TableCell>{row.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                    {totalCount === 0 && !isLoading && (
                        <caption>{Environments.LISTAGEM_VAZIA}</caption>
                    )}

                    <TableFooter>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <LinearProgress variant="indeterminate" />
                                </TableCell>
                            </TableRow>
                        )}

                        {(totalCount > 0 && totalCount > Environments.LIMITE_DE_LINHAS) && (
                            <TableRow>
                                <TableCell colSpan={3

                                }>
                                    <Pagination
                                        page={pagina}
                                        count={Math.ceil(totalCount / Environments.LIMITE_DE_LINHAS)}
                                        onChange={(_, newPage) => setSearchParams({ busca, page: newPage.toString() }, { replace: true })}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableFooter>
                </Table>
            </TableContainer>
        </LayoutBasePagina>
    )
}
