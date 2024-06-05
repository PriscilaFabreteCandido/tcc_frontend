
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ConfigProvider } from 'antd'
import ptBR from "antd/lib/locale/pt_BR";
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store from './store/store.tsx'
import { persistStore } from 'redux-persist'

const config = {
  token: {
    colorPrimary: "#FA7305",
    colorSecondary: "#E5EDEA",
    colorSuccess: "#6EC936",
    colorInfo: "#45bfd6",
    colorWarning: "#f3ab15",
    colorHelp: "#001529",
    colorDanger: "#DC2626",
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    fontSizeIcon: 18,
    fontFamilyCode: "monospace",
  },
};


let persistor = persistStore(store)

ReactDOM.createRoot(document.getElementById('root')!).render(

  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConfigProvider locale={ptBR} theme={config}>
        <App />
      </ConfigProvider>
    </PersistGate>
  </Provider>

)
