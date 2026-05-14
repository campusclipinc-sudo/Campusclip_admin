import React from "react";
import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import PagesRoutes from "./routes/PagesRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { setAuthToken } from "./libs/HttpClients";
import { ThemeProvider } from "./context/ThemeContext";
import "./scss/layout.scss";



const queryClient = new QueryClient();

const handleOnBeforeLift = () => {
  if (
    store.getState().user?.accessToken !== undefined &&
    store.getState().user?.accessToken !== null
  ) {
    setAuthToken(store.getState().user.accessToken);
  }
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={handleOnBeforeLift}
      >
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ThemeProvider>
              <PagesRoutes />
              <ToastContainer />
            </ThemeProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
