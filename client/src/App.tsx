import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// components
import ProtectedRoutes from "./components/global/ProtectedRoutes";

// pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";



export default function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />

					<Route element={<ProtectedRoutes />}>
						<Route path="/dashboard" element={<Dashboard />} />
					</Route>

					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
		</>
	)
}
