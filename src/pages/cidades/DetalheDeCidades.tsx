import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { LayoutBasePagina } from "../../shared/layouts";
import { FerramentaDeDetalhes } from "../../shared/components";
import { CidadesService } from "../../shared/services/api/cidades/CidadesService";
import { VTextField, VForm, IVFormErrors } from "../../shared/forms";
import { Box, Grid2, LinearProgress, Paper, Typography } from "@mui/material";
import { useVForm } from "../../shared/forms/useVForm";
import * as yup from 'yup'

interface IFormData {
    nome: string;
}

const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    nome: yup.string().required().min(3),
});

export const DetalheDeCidades: React.FC = () => {
    const { _id = 'nova' } = useParams<'_id'>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState('');
    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
    
    console.log('id detalhe inicio...', _id)
    
    useEffect(() => {
        console.log('detalhe efect id...', _id)
        if (_id !== 'nova') {
            setIsLoading(true);
            CidadesService.getById(_id)
                .then((result) => {
                    console.log('result detalhe...', result)
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                        navigate('/cities')
                    } else {
                        console.log('result.nome...', result.nome)
                        setNome(result.nome)
                        formRef.current?.setData(result)
                    }
                })
        } else {
            formRef.current?.setData({
                nome: '',
            })
        }

    }, [_id])

    const handleSave = (dados: IFormData) => {

        formValidationSchema.
            validate(dados, { abortEarly: false })
            .then((dadosValidados) => {

                setIsLoading(true)
                if (_id === 'nova') {
                    CidadesService
                        .create(dadosValidados)
                        .then((result) => {
                            console.log('handle...', result)
                            setIsLoading(false)
                            if (result instanceof Error) {
                                alert(result.message)
                            } else {
                                if (isSaveAndClose()) {
                                    navigate('/cities')
                                } else {
                                    navigate(`/cities/detalhe/${result}`)
                                }
                            }

                        })

                } else {
                    CidadesService
                        .updateById(_id, { _id, ...dadosValidados })
                        .then((result) => {
                            console.log('handle edit...', result)
                            setIsLoading(false)
                            if (result instanceof Error) {
                                alert(result.message)
                            } else {
                                if (isSaveAndClose()) {
                                    navigate('/cities')
                                }
                            }
                        })
                }
                console.log('dados...', dados)
            })
            .catch((errors: yup.ValidationError) => {
                const validationErrors: IVFormErrors = {};

                errors.inner.forEach(error => {
                    if (!error.path) return;

                    validationErrors[error.path] = error.message;
                })
                formRef.current?.setErrors(validationErrors)

            })

    }

    const handleDelete = (_id: string) => {
        // eslint-disable-next-line
        if (confirm('Deseja realmente excluir este registro?')) {
            CidadesService.deleteById(_id)
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message)
                    } else {
                        alert('Registro deletado com sucesso !')
                        navigate('/cities')
                    }
                })
        }
    }

    return (
        <LayoutBasePagina
            titulo={_id === 'nova' ? 'Nova Cidade' : nome}
            barraDeFerramentas={
                <FerramentaDeDetalhes
                    textoBotaoNovo="Nova"
                    mostrarBotaoSalvarEFechar
                    mostrarBotaoNovo={_id !== 'nova'}
                    mostrarBotaoApagar={_id !== 'nova'}

                    aoClicarEmSalvar={save}
                    aoClicarEmSalvarEFechar={saveAndClose}
                    aoClicarEmApagar={() => handleDelete(_id)}
                    aoClicarEmNovo={() => navigate('/cities/detalhe/nova')}
                    aoClicarEmVoltar={() => navigate('/cities')}
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
                                    label="Cidade"
                                    name="nome" />
                            </Grid2>
                        </Grid2>

                    </Grid2>

                </Box>
            </VForm>

        </LayoutBasePagina>
    )
}