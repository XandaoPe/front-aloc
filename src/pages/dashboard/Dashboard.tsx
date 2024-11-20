import { FerramentasDaListagem } from "../../shared/components"
import { LayoutBasePagina } from "../../shared/layouts"

export const Dashboard = () => {

    return (
        <LayoutBasePagina
            titulo='Página Inicial'
            barraDeFerramentas={
                <FerramentasDaListagem
                    mostrarInputBusca
                    textoBotaoNovo="NewVa"
                />
            }
        >

            Testando
        </LayoutBasePagina>
    )
}