import {Navigate, Route, Routes} from "react-router-dom";
import LayoutManager from "./pages/layout/LayoutManager.jsx";
import UserList from "./pages/users/UserList.jsx";
import TvDashboardDisplay from "./pages/tv/TvDashboardDisplay.jsx";
import Login from "./pages/auth/Login.jsx";
import PersistLogin from "./pages/auth/PersistLogin.jsx";
import Prefetch from "./pages/auth/Prefetch.jsx";
import RequireAuth from "./pages/auth/RequireAuth.jsx";
import {ROLES} from "./config/roles.js";
import Unauthorize from "./pages/error/Unauthorize.jsx";
import NotFound from "./pages/error/NotFound.jsx";
import {Suspense} from "react";
import LayoutAdmin from "./pages/layout/LayoutAdmin.jsx";
import LayoutTvOperator from "./pages/layout/LayoutTvOperator.jsx";
import MenuTv from "./pages/menu/MenuTv.jsx";
import TVLineInput from "./pages/tv/TVLineInput.jsx";
import MenuManager from "./pages/menu/MenuManager.jsx";
import MenuAdmin from "./pages/menu/MenuAdmin.jsx";
import DepartmentList from "./pages/department/DepartmentList.jsx";
import MenuTvFetched from "./pages/menu/MenuTvFetched.jsx";
import ProductionLineList from "./pages/productionLine/ProductionLineList.jsx";
import MenuTesting from "./pages/menu/MenuTesing.jsx";
import ProductList from "./pages/product/ProductList.jsx";
import Profile from "./pages/profile/Profile.jsx";

function App() {
  return (
    <Suspense fallback={<p>Loading</p>}>
        <Routes>
          {/* Testing routes */}
          <Route path="/admin-menu-testing" element={<MenuTesting/>}/>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" replace />}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/unauthorize" element={<Unauthorize/>}/>
          <Route path="*" element={<NotFound/>}/>

          {/* Protected routes */}
          <Route element={<PersistLogin/>}>
              <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]}/>}>
                  <Route element={<Prefetch/>}>

                      {/* Start dash manager */}
                      <Route element={<RequireAuth allowedRoles={[ROLES.ROLE_PRODUCTION_MANAGER]}/>}>
                          <Route path="/manager" element={<LayoutManager/>}>
                              <Route index element={<MenuManager/>}/>
                              <Route path="users" element={<UserList/>}/>
                              <Route path="tv-menu">
                                  <Route index element={<MenuTv/>}/>
                                  <Route path=":name" element={<TVLineInput/>}/>
                              </Route>
                              <Route path="products" element={<ProductList/>}/>
                              <Route path="profile" element={<Profile/>}/>
                          </Route>
                      </Route>

                      <Route element={<RequireAuth allowedRoles={[ROLES.ROLE_ADMIN]}/>}>
                          <Route path="/admin" element={<LayoutAdmin/>}>
                              <Route index element={<MenuAdmin/>}/>
                              <Route path="departments" element={<DepartmentList/>}/>
                              <Route path="production-lines" element={<ProductionLineList/>}/>
                              <Route path="tv">
                                  <Route index element={<MenuTvFetched/>}/>
                                  <Route path=":name" element={<TvDashboardDisplay/>}/>
                              </Route>
                              <Route path="products" element={<ProductList/>}/>
                              <Route path="profile" element={<Profile/>}/>
                          </Route>
                      </Route>

                      <Route element={<RequireAuth allowedRoles={[ROLES.ROLE_TV_OPERATOR]}/>}>
                          <Route path="/tv">
                              <Route index element={<LayoutTvOperator/>}/>
                              <Route path=":name" element={<TvDashboardDisplay/>}/>
                              <Route path="profile" element={<Profile/>}/>
                          </Route>
                      </Route>

                  </Route>
              </Route>
          </Route>
        </Routes>
    </Suspense>
  )
}

export default App
