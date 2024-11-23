import { FerramentaDeDetalhes } from "../../shared/components"
import { LayoutBasePagina } from "../../shared/layouts"

export const Dashboard = () => {

    return (
        <LayoutBasePagina
            titulo='Página Inicial'
            barraDeFerramentas=
            {
                <FerramentaDeDetalhes
                    mostrarBotaoSalvarEFechar
                />
            }
            >
            Testando
        </LayoutBasePagina>
    )
}