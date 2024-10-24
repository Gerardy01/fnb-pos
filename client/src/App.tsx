import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// components
import ProtectedRoutes from "./components/global/ProtectedRoutes";
import CommonLayout from "./components/global/CommonLayout";

// pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
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
							<Route path="/account-management" element={<Dashboard />} />
							<Route path="/role-management" element={<Dashboard />} />
							<Route path="/organization-settings" element={<Dashboard />} />
						</Route>

						<Route path="/pos" element={<POS />} />
					</Route>

					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
		</>
	)
}
