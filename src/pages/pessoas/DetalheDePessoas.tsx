import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { LayoutBasePagina } from "../../shared/layouts";
import { FerramentaDeDetalhes } from "../../shared/components";
import { PessoasService } from "../../shared/services/api/pessoas/PessoasService";
import { VTextField, VForm, IVFormErrors } from "../../shared/forms";
import { Box, Grid2, LinearProgress, Paper, Typography } from "@mui/material";
import { useVForm } from "../../shared/forms/useVForm";
import * as yup from 'yup'

interface IFormData {
    email: string;
    cidadeId: string;
    nomeCompleto: string;
}

const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    nomeCompleto: yup.string().required().min(3),
    email: yup.string().required().email(),
    cidadeId: yup.string().required(),
});

export const DetalheDePessoas: React.FC = () => {
    const { id = 'nova' } = useParams<'id'>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState('');
    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

    useEffect(() => {
        if (id !== 'nova') {
            setIsLoading(true);
            PessoasService.getById(id)
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                        navigate('/pessoas')
                    } else {
                        setNome(result.nomeCompleto)
                        formRef.current?.setData(result)
                    }
                })
        } else {
            formRef.current?.setData({
                nomeCompleto: '',
                email: '',
                cidadeId: '',
            })
        }

    }, [id])

    const handleSave = (dados: IFormData) => {

        formValidationSchema.
            validate(dados, { abortEarly: false })
            .then((dadosValidados) => {

                setIsLoading(true)
                if (id === 'nova') {
                    PessoasService
                        .create(dadosValidados)
                        .then((result) => {
                            setIsLoading(false)
                            if (result instanceof Error) {
                                alert(result.message)
                            } else {
                                if (isSaveAndClose()) {
                                    navigate('/pessoas')
                                } else {
                                    navigate(`/pessoas/detalhe/${result}`)
                                }
                            }
        
                        })
        
                } else {
                    PessoasService
                        .updateById(id, { id, ...dadosValidados })
                        .then((result) => {
                            setIsLoading(false)
                            if (result instanceof Error) {
                                alert(result.message)
                            } else {
                                if (isSaveAndClose()) {
                                    navigate('/pessoas')
                                }
                            }
                        })
                }
                console.log(dados)
            })
            .catch((errors: yup.ValidationError) => {
                const validationErrors: IVFormErrors={};

                errors.inner.forEach(error =>{
                    if(!error.path) return;

                    validationErrors[error.path] = error.message;
                })
                formRef.current?.setErrors(validationErrors)

            })

    }

    const handleDelete = (id: string) => {
        // eslint-disable-next-line
        if (confirm('Deseja realmente excluir este registro?')) {
            PessoasService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message)
                    } else {
                        alert('Registro deletado com sucesso !')
                        navigate('/pessoas')
                    }
                })
        }
    }

    return (
        <LayoutBasePagina
            titulo={id === 'nova' ? 'Nova Pessoa' : nome}
            barraDeFerramentas={
                <FerramentaDeDetalhes
                    textoBotaoNovo="Nova"
                    mostrarBotaoSalvarEFechar
                    mostrarBotaoNovo={id !== 'nova'}
                    mostrarBotaoApagar={id !== 'nova'}

                    aoClicarEmSalvar={save}
                    aoClicarEmSalvarEFechar={saveAndClose}
                    aoClicarEmApagar={() => handleDelete(id)}
                    aoClicarEmNovo={() => navigate('/pessoas/detalhe/nova')}
                    aoClicarEmVoltar={() => navigate('/pessoas')}
                />
            }
        >
            <VForm ref={formRef} onSubmit={handleSave} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <Box margin={1} display="flex" flexDirection='column' component={Paper} variant="outlined">


                    <Grid2 container direction="column" padding={2} spacing={2}>

                        {isLoading && (
                            <Grid2 >
                                <LinearProgress variant="indeterminate" />
                            </Grid2>
                        )}

                        <Grid2 >
                            <Typography variant="h6">Geral</Typography>
                        </Grid2>

                        <Grid2 container direction="row" spacing={2}>
                            <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 2 }}>
                                <VTextField
                                    fullWidth
                                    disabled={isLoading}
                                    onChange={e => setNome(e.target.value)}
                                    label="Nome Completo"
                                    name="nomeCompleto" />
                            </Grid2>
                        </Grid2>

                        <Grid2 container direction="row" spacing={2}>
                            <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 2 }}>
                                <VTextField
                                    fullWidth
                                    disabled={isLoading}
                                    label="Email"
                                    name="email" />
                            </Grid2>
                        </Grid2>

                        <Grid2 container direction="row" spacing={2}>
                            <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 2 }}>
                                <VTextField
                                    fullWidth
                                    disabled={isLoading}
                                    label="Cidade"
                                    name="cidadeId" />
                            </Grid2>
                        </Grid2>
                    </Grid2>


                </Box>
            </VForm>

        </LayoutBasePagina>
    )
}