import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Layout from "./components/Layout";
import ListCourse from "./components/Course/ListCourse";
import AddCourse from "./components/Course/AddCourse";
import EditICourse from "./components/Course/EditICourse";
import ListUser from "./components/User/ListUser";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";

function MainRouter() {
    return (
        <div>
            <Layout />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users/signin" element={<Signin />} />
                <Route path="/users/signup" element={<Signup />} />
                <Route path="/users/list" element={<ListUser />} />
                <Route path="/course/list" element={<ListCourse />} />
                <Route path="/course/add" element={<AddCourse />} />
                <Route path="/course/edit/:id" element={<EditICourse />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    )
}

//If i want to use nodemon i have to change the pakage.json   "scripts": {"start": "vite",} 

export default MainRouter;