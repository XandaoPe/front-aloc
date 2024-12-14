import { Navigate, Route, Routes } from "react-router-dom"
import { useDrawerContext } from "../shared/contexts"
import { useEffect } from "react";
import { Dashboard, DetalheDeCidades, DetalheDePessoas, ListagemDeCidades, ListagemDePessoas } from "../pages";

export const AppRoutes = () => {
    const { setDrawerOptions } = useDrawerContext();

    useEffect(() => {
        setDrawerOptions([
            {
                icon: 'home',
                path: '/pagina-inicial',
                label: 'Página inicial'
            },
            {
                icon: 'location_city',
                path: '/cities',
                label: 'Cidades'
            },
            {
                icon: 'people',
                path: '/users',
                label: 'Users'
            }
        ])
    }, [])

    return (
        <Routes>
            <Route path="/pagina-inicial" element={<Dashboard/>} />

            <Route path="/users" element={<ListagemDePessoas/>} />
            <Route path="/users/detalhe/:_id" element={<DetalheDePessoas/>} />

            <Route path="/cities" element={<ListagemDeCidades/>} />
            <Route path="/cities/detalhe/:_id" element={<DetalheDeCidades/>} />

            <Route path="*" element={<Navigate to="/pagina-inicial" />} />
        </Routes>
    )
}