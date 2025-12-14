import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import LayoutMain from "./components/LayoutMain";
import ListCourse from "./components/Course/ListCourse";
import AddCourse from "./components/Course/AddCourse";
import EditICourse from "./components/Course/EditICourse";
import ListUser from "./components/User/ListUser";
import EditUser from "./components/User/EditUser";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import Dashboard from "./components/Dashboard";
import ListProject from "./components/Project/ListProject";
import AddProject from "./components/Project/AddProject";
import EditProject from "./components/Project/EditProject";
import ProjectDetail from "./components/ProjectDetail";
import Profile from "./components/Profile";
import AccountSettings from "./components/AccountSettings";

function MainRouter() {
    return (
        <div>
            <LayoutMain />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users/signin" element={<Signin />} />
                <Route path="/users/signup" element={<Signup />} />
                <Route path="/users/list" element={<ListUser />} />
                <Route path="/users/edit/:uid" element={<EditUser />} />
                <Route path="/course/list" element={<ListCourse />} />
                <Route path="/course/add" element={<AddCourse />} />
                <Route path="/course/edit/:id" element={<EditICourse />} />
                <Route path="/project/list" element={<ListProject />} />
                <Route path="/project/add" element={<AddProject />} />
                <Route path="/project/edit/:id" element={<EditProject />} />
                <Route path="/project/:id" element={<ProjectDetail />} />
                <Route path="/users/profile" element={<Profile />} />
                <Route path="/users/account-settings" element={<AccountSettings />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    )
}

//If i want to use nodemon i have to change the pakage.json   "scripts": {"start": "vite",} 

export default MainRouter;