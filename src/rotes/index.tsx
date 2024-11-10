import { Button } from "@mui/material"
import { Navigate, Route, Routes } from "react-router-dom"
import { useAppThemeContext } from "../shared/contexts"


export const AppRoutes = () =>{
    const {toogleTheme} = useAppThemeContext();
    return (
    <Routes>

            <Route path="/pagina-inicial" element={<Button variant="contained" color="primary" onClick={toogleTheme}>Altermar tema</Button>} />
            <Route path="*" element={<Navigate to="/pagina-inicial" />} />
                    
    </Routes>
    )
}