import {BrowserRouter, Route, Routes} from "react-router-dom"

import Layout from "../components/Layout/Layout"
import Home from "../page/Home/Home"

export default function AppRouter() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route path='/' element={<Home/>}/>
        </Route>
      </Routes>
    </BrowserRouter>


  )
}

