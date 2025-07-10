import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// utils
import { PageAccessPermissionEnum } from "./utils/enums";

// components
import ProtectedRoutes from "./components/global/ProtectedRoutes";
import CommonLayout from "./components/global/CommonLayout";
import PermissionProtectedRoutes from "./components/global/PermissionProtectedRoutes";

// pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ForgotPasswordChange from "./pages/ForgotPasswordChange";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import AccountManagement from "./pages/AccountManagement";
import OutletManagement from "./pages/OutletManagement";
import ChangePassword from "./pages/ChangePassword";
import Profile from "./pages/Profile";
import RoleManagement from "./pages/RoleManagement";
import TableGroupManagement from "./pages/TableGroupManagement";
import TableManagement from "./pages/TableManagement";
import GratuityManagement from "./pages/GratuityManagement";
import SalesTypeManagement from "./pages/SalesTypeManagement";
import NotFound from "./pages/NotFound";



export default function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />
					<Route path="/forgot-password/change" element={<ForgotPasswordChange />} />

					<Route element={<ProtectedRoutes />}>
						<Route element={<CommonLayout />}>
							<Route path="/dashboard" element={<Dashboard />} />
							
							<Route element={<PermissionProtectedRoutes requiredPermission={[PageAccessPermissionEnum.ACCOUNT_MANAGEMENT]} />}>
								<Route path="/account-management" element={<AccountManagement />} />
								<Route path="/account-management/:accountId" element={<AccountManagement />} />
							</Route>

							<Route element={<PermissionProtectedRoutes requiredPermission={[PageAccessPermissionEnum.ROLE_MANAGEMENT]} />}>
								<Route path="/role-management" element={<RoleManagement />} />
								<Route path="/role-management/:roleId" element={<RoleManagement />} />
							</Route>
							
							<Route element={<PermissionProtectedRoutes requiredPermission={[PageAccessPermissionEnum.ORGANIZATION_SETTINGS]} />}>
								<Route path="/organization-settings" element={<Dashboard />} />
							</Route>

							<Route element={<PermissionProtectedRoutes requiredPermission={[PageAccessPermissionEnum.OUTLET_MANAGEMENT]} />}>
								<Route path="/outlet" element={<OutletManagement />} />
								<Route path="/outlet/:outletId" element={<OutletManagement />} />
							</Route>

							<Route element={<PermissionProtectedRoutes requiredPermission={[PageAccessPermissionEnum.TABLE_MANAGEMENT]} />}>
								<Route path="/table" element={<TableManagement />} />
								<Route path="/table/:tableId" element={<TableManagement />} />

								<Route path="/table-group" element={<TableGroupManagement />} />
								<Route path="/table-group/:tableGroupId" element={<TableGroupManagement />} />
							</Route>

							<Route element={<PermissionProtectedRoutes requiredPermission={[PageAccessPermissionEnum.SALES_TYPE_MANAGEMENT]} />}>
								<Route path="/sales-type" element={<SalesTypeManagement />} />
								<Route path="/sales-type/:salesTypeId" element={<SalesTypeManagement />} />
							</Route>

							<Route element={<PermissionProtectedRoutes requiredPermission={[PageAccessPermissionEnum.GRATUITY_MANAGEMENT]} />}>
								<Route path="/gratuity" element={<GratuityManagement />} />
								<Route path="/gratuity/:gratuityId" element={<GratuityManagement />} />
							</Route>
						</Route>

						<Route element={<PermissionProtectedRoutes pageLoad requiredPermission={[PageAccessPermissionEnum.POS]} />}>
							<Route path="/pos" element={<POS />} />
						</Route>

						<Route element={<PermissionProtectedRoutes requiredPermission={[PageAccessPermissionEnum.ACCOUNT_MANAGEMENT]} />}>
							<Route path="/dashboard/profile" element={<Profile />} />
						</Route>

						<Route path="/dashboard/change-password" element={<ChangePassword />} />

					</Route>

					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
		</>
	)
}
