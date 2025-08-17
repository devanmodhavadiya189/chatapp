import { Switch, Route } from "wouter";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <Switch>
  <Route path="/login" component={Login} />
  <Route path="/signup" component={Signup} />
  <Route path="/about" component={About} />
  <ProtectedRoute path="/" component={Home} />
  <ProtectedRoute path="/chat" component={Chat} />
  <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;