import {BrowserRouter, Route, Routes} from "react-router-dom"

import Layout from "../components/Layout/Layout"
import Home from "../page/Home/Home"
import UserQuestionsPage from "../page/UserQuestionsPage/UserQuestionsPage"
import SurveyPage from "../page/SurveyPage/SurveyPage"

export default function AppRouter() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route path='/' element={<Home/>}/>
          <Route path='/users/:userWallet/surveys' element={<UserQuestionsPage/>}/>
          <Route path='/users/:userWallet/surveys/:surveyId' element={<SurveyPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>


  )
}

