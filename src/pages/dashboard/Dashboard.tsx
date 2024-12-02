import { Box, Card, CardContent, Grid2, Paper, Typography } from "@mui/material"
import { FerramentasDaListagem } from "../../shared/components"
import { LayoutBasePagina } from "../../shared/layouts"
import { useEffect, useState } from "react";
import { CidadesService } from "../../shared/services/api/cidades/CidadesService";
import { PessoasService } from "../../shared/services/api/pessoas/PessoasService";

export const Dashboard = () => {
    const [isLoadingCidades, setIsLoadingCidades] = useState(true);
    const [totalCountCidades, setTotalCountCidades] = useState(0);
    const [isLoadingPessoas, setIsLoadingPessoas] = useState(true);
    const [totalCountPessoas, setTotalCountPessoas] = useState(0);

    useEffect(() => {
        setIsLoadingCidades(true)
        setIsLoadingPessoas(true)

        CidadesService.getAll(1)
            .then((result) => {
                setIsLoadingCidades(false)
                if (result instanceof Error) {
                    alert(result.message)
                } else {
                    setTotalCountCidades(result.totalCount)
                }
            })

        PessoasService.getAll(1)
            .then((result) => {
                setIsLoadingPessoas(false)
                if (result instanceof Error) {
                    alert(result.message)
                } else {
                    setTotalCountPessoas(result.totalCount)
                }
            })

    }, [])

    return (
        <LayoutBasePagina
            titulo='Página Inicial'
            barraDeFerramentas={<FerramentasDaListagem mostrarBotaoNovo={false} />}
        >
            <Box margin={1} display="flex" flexDirection='column' component={Paper} variant="outlined">
                <Grid2 container direction="column" padding={2} spacing={2}>
                    <Grid2 container direction='row'>
                        <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 3 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant='h5' align="center">
                                        Total de Pessoas
                                    </Typography>
                                    <Box padding='6' display='flex' justifyContent='center' alignItems='center'>
                                        {!isLoadingPessoas && (
                                            <Typography variant='h1'>
                                                {totalCountPessoas}
                                            </Typography>
                                        )}
                                        {isLoadingPessoas && (
                                            <Typography variant='h6'>
                                                Carregando...
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 3 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant='h5' align="center">
                                        Total de Cidades
                                    </Typography>
                                    <Box padding='6' display='flex' justifyContent='center' alignItems='center'>
                                        {!isLoadingCidades && (
                                            <Typography variant='h1'>
                                                {totalCountCidades}
                                            </Typography>
                                        )}
                                        {isLoadingCidades && (
                                            <Typography variant='h6'>
                                                Carregando...
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid2>
                    </Grid2>
                </Grid2>
            </Box>
        </LayoutBasePagina>
    )
}