import { Autocomplete, CircularProgress, TextField } from "@mui/material"
import { useEffect, useMemo, useState } from "react";
import { CidadesService } from "../../../shared/services/api/cidades/CidadesService";
import { useDebounce } from "../../../shared/hooks";
import { useField } from "@unform/core";

type TAutoCompleteOptions = {
    id: string;
    label: string;
}

interface IAutoCompleteCidadeProps {
    isExternalLoading?: boolean;
}

export const AutoCompleteCidade: React.FC<IAutoCompleteCidadeProps> = ({ isExternalLoading = false }) => {
    const { fieldName, registerField, defaultValue, error, clearError } = useField('cidadeId');
    const { debounce } = useDebounce();
    const [opcoes, setOpcoes] = useState<TAutoCompleteOptions[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [busca, setBusca] = useState('')
    const [selectedId, setSelectedId] = useState<string | undefined>(defaultValue)
    const [selectedOption, setSelectedOption] = useState<any>()

    useEffect(() => {
        registerField({
            name: fieldName,
            getValue: () => selectedId,
            setValue: (_, newSelectedId) => setSelectedId(newSelectedId),
        });
    }, [registerField, fieldName, selectedId])

    useEffect(() => {
        setIsLoading(true)
        debounce(() => {
            CidadesService.getAll(1, busca)
                .then((result) => {
                    setIsLoading(false)
                    if (result instanceof Error) {
                        alert(result.message)
                        return
                    } else {
                        setOpcoes(result.data.map(cidade => ({ id: cidade.id, label: cidade.nome })))
                    }
                })
        })
    }, [busca])

    const autoCompleteSelectedOption = useMemo(() => {
        // if (!selectedId) return null;
        // const selectedIdOption = opcoes.find(opcao => opcao.id === selectedId)
        if (!selectedId) return null;
        CidadesService.getById(selectedId)
            .then((result) => {
                setIsLoading(false)
                if (result instanceof Error) {
                    alert(result.message)
                    return
                } else {
                    setSelectedOption(result.nome)
                }
            })
        return selectedOption;
    }, [selectedId, opcoes])

    return (
        <Autocomplete
            openText="Abrir"
            closeText="Fechar"
            noOptionsText="Sem Opções"
            loadingText="Carregando..."
            disablePortal
            loading={isLoading}
            options={opcoes}
            disabled={isExternalLoading}
            value={autoCompleteSelectedOption}
            onInputChange={(_, newValue) => setBusca(newValue)}
            onChange={(_, newValue) => { setSelectedId(newValue?.id); setBusca(''); clearError(); }}
            popupIcon={(isExternalLoading || isLoading) ? <CircularProgress size={28} /> : undefined}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Cidade"
                    error={!!error}
                    helperText={error}
                />
            )}
        />
    )
}