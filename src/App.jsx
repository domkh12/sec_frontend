import {lazy, Suspense} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import PersistLogin from "./pages/auth/PersistLogin.jsx";
import Prefetch from "./pages/auth/Prefetch.jsx";
import RequireAuth from "./pages/auth/RequireAuth.jsx";
import {ROLES} from "./config/roles.js";
import Unauthorize from "./pages/error/Unauthorize.jsx";
import NotFound from "./pages/error/NotFound.jsx";
import LoadingComponent from "./components/ui/LoadingComponent.jsx";
import MenuTvViewer from "./pages/menu/MenuTvViewer.jsx";
import QrScan from "./pages/qrScan/QrScan.jsx";
import QrGenerator from "./pages/qrGenerator/QrGenerator.jsx";


// Lazy load everything else
const WorkOrderList = lazy(() => import("./pages/workOrder/WorkOrderList.jsx"));
const DefectTypeList = lazy(() => import("./pages/defectType/DefectTypeList.jsx"));
const ProcessingTimeList = lazy(() => import("./pages/processingTime/ProcessingTimeList.jsx"));
const MaterialList = lazy(() => import("./pages/material/MaterialList.jsx"));
const WipSewingOutput = lazy(() => import("./pages/workOrder/WipSewingOutput.jsx"));
const WorkOrderStatusMenu = lazy(() => import("./pages/workOrder/WorkOrderStatusMenu"));
const FileManager = lazy(() => import("./pages/file/FileManager.jsx"));
const PurchaseList = lazy(() => import("./pages/purchaseOrder/PurchaseList.jsx"));
const SizeList = lazy(() => import("./pages/size/SizeList.jsx"));
const ColorList = lazy(() => import("./pages/color/ColorList.jsx"));
const LayoutManager = lazy(() => import("./pages/layout/LayoutManager.jsx"));
const LayoutAdmin = lazy(() => import("./pages/layout/LayoutAdmin.jsx"));
const LayoutTvOperator = lazy(() => import("./pages/layout/LayoutTvOperator.jsx"));
const UserList = lazy(() => import("./pages/users/UserList.jsx"));
const TvDashboardDisplay = lazy(() => import("./pages/tv/TvDashboardDisplay.jsx"));
const MenuTv = lazy(() => import("./pages/menu/MenuTv.jsx"));
const TVLineInput = lazy(() => import("./pages/tv/TVLineInput.jsx"));
const MenuManager = lazy(() => import("./pages/menu/MenuManager.jsx"));
const MenuAdmin = lazy(() => import("./pages/menu/MenuAdmin.jsx"));
const DepartmentList = lazy(() => import("./pages/department/DepartmentList.jsx"));
const ProductionLineList = lazy(() => import("./pages/productionLine/ProductionLineList.jsx"));
const ProductList = lazy(() => import("./pages/product/ProductList.jsx"));
const Profile = lazy(() => import("./pages/profile/Profile.jsx"));
const RoleList = lazy(() => import("./pages/role/RoleList.jsx"));
const CategoryList = lazy(() => import("./pages/category/CategoryList.jsx"));
const BuyerList = lazy(() => import("./pages/buyer/BuyerList.jsx"));
const MenuTesting = lazy(() => import("./pages/menu/MenuTesing.jsx"));

function App() {
  return (
      <Suspense fallback={<div className="bg-main h-screen"><LoadingComponent/></div>}>
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
                      <Route element={<RequireAuth allowedRoles={[ROLES.ROLE_MANAGER]}/>}>
                          <Route path="/manager" element={<LayoutManager/>}>
                              <Route index element={<MenuManager/>}/>
                              <Route path="users" element={<UserList/>}/>
                              <Route path="tv-menu">
                                  <Route index element={<MenuTv/>}/>
                                  <Route path=":name" element={<TVLineInput/>}/>
                              </Route>
                              <Route path="products" element={<ProductList/>}/>
                              <Route path="profile" element={<Profile/>}/>
                              <Route path="tv">
                                  <Route index element={<MenuTvViewer/>}/>
                                  <Route path=":name" element={<TvDashboardDisplay/>}/>
                              </Route>
                              <Route path="production-status">
                                  <Route index element={<WorkOrderStatusMenu />}/>
                                  <Route path="sewing-output" element={<WipSewingOutput />}/>
                              </Route>
                              <Route path="work-orders" element={<WorkOrderList/>}/>
                              <Route path="qr-scan" element={<QrScan/>} />
                              <Route path="qr-generator" element={<QrGenerator/>} />
                          </Route>
                      </Route>

                      <Route element={<RequireAuth allowedRoles={[ROLES.ROLE_ADMIN]}/>}>
                          <Route path="/admin" element={<LayoutAdmin/>}>
                              <Route index element={<MenuAdmin/>}/>
                              <Route path="departments" element={<DepartmentList/>}/>
                              <Route path="production-lines" element={<ProductionLineList/>}/>
                              <Route path="tv-menu">
                                  <Route index element={<MenuTv/>}/>
                                  <Route path=":name" element={<TVLineInput/>}/>
                              </Route>
                              <Route path="products" element={<ProductList/>}/>
                              <Route path="profile" element={<Profile/>}/>
                              <Route path="users" element={<UserList/>}/>
                              <Route path="roles" element={<RoleList/>}/>
                              <Route path="categories" element={<CategoryList/>}/>
                              <Route path="sizes" element={<SizeList/>} />
                              <Route path="colors" element={<ColorList/>} />
                              <Route path="purchase-orders" element={<PurchaseList/>}/>
                              <Route path="buyers">
                                  <Route index element={<BuyerList/>}/>
                                  <Route path=":id/file-manager" element={<FileManager/>}/>
                              </Route>
                              <Route path="tv">
                                  <Route index element={<MenuTvViewer/>}/>
                                  <Route path=":name" element={<TvDashboardDisplay/>}/>
                              </Route>
                              <Route path="production-status">
                                  <Route index element={<WorkOrderStatusMenu />}/>
                                  <Route path="sewing-output" element={<WipSewingOutput />}/>
                              </Route>
                              <Route path="materials" element={<MaterialList/>}/>
                              <Route path="work-orders" element={<WorkOrderList/>}/>
                              <Route path="defect-types" element={<DefectTypeList/>} />
                              <Route path="qr-scan" element={<QrScan/>} />
                              <Route path="qr-generator" element={<QrGenerator/>} />
                          </Route>
                      </Route>

                      <Route element={<RequireAuth allowedRoles={[ROLES.ROLE_VIEWER]}/>}>
                          <Route path="/tv" element={<LayoutTvOperator/>}>
                              <Route index element={<MenuTvViewer/>}/>
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
