import { useSearchParams } from "react-router-dom"
import { FerramentasDaListagem } from "../../shared/components"
import { LayoutBasePagina } from "../../shared/layouts"
import { useEffect, useMemo, useState } from "react";
import { IlistagemPessoas, PessoasService } from "../../shared/services/api/pessoas/PessoasService";
import { useDebounce } from "../../shared/hooks";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";


export const ListagemDePessoas: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce(2000);

    const [isLoading, setIsLoading] = useState(true);
    const [rows, setRows] = useState<IlistagemPessoas[]>([]);
    const [totalCount, setTotalCount] = useState(0);

    const busca = useMemo(() => {
        return searchParams.get('busca') || '';
    }, [searchParams]);

    useEffect(() => {
        setIsLoading(true)
        debounce(() => {
            PessoasService.getAll(1, busca)
                .then((result) => {
                    setIsLoading(false)
                    if (result instanceof Error) {
                        alert(result.message)
                        return
                    } else {
                        console.log(result)
                        setRows(result.data)
                        setTotalCount(result.totalCount)
                    }
                })
        })
    }, [busca])

    return (
        <LayoutBasePagina
            titulo="Listagem de Pessoas"
            barraDeFerramentas={
                <FerramentasDaListagem
                    mostrarInputBusca
                    textoBotaoNovo="Nova"
                    textoDaBusca={busca}
                    aoMudarTextoDaBusca={texto => setSearchParams({ busca: texto }, { replace: true })}
                />
            }
        >
            <TableContainer component={Paper} variant="outlined" sx={{ margin: 1, width: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Açôes</TableCell>
                            <TableCell>Nome Completo</TableCell>
                            <TableCell>Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(row => (
                            <TableRow key={row.id}>
                                <TableCell>Açôes</TableCell>
                                <TableCell>{row.nomeCompleto}</TableCell>
                                <TableCell>{row.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </LayoutBasePagina>
    )
}
