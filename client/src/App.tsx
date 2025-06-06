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
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import AccountManagement from "./pages/AccountManagement";
import ChangePassword from "./pages/ChangePassword";
import Profile from "./pages/Profile";
import RoleManagement from "./pages/RoleManagement";
import NotFound from "./pages/NotFound";



export default function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />

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
