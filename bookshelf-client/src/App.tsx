import "./App.css";
import "font-awesome/css/font-awesome.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-notifications/lib/notifications.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { store } from "./store/store";
import Header from "./features/header/components/Header";
import Routes from "./routes/Routes";

const persistor = persistStore(store);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <div className="App">
            <header>
              <Header />
            </header>
            <div className="main">
              <Routes />
            </div>
          </div>
        </Router>
      </PersistGate>
      {/* {notification &&
          <div className="position-absolute bottom-0 end-0">
            <Toast>
              <Toast.Header closeButton={false}>
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto">Notification</strong>
                <small>{notification.createdAt}</small>
              </Toast.Header>
              <Toast.Body>{notification.message}</Toast.Body>
            </Toast>
          </div>
          } */}
    </Provider>
  );
}

export default App;
