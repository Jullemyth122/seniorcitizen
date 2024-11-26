import { Fragment } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AdminFormProvider } from './context/AdminFormContext.jsx'
import { SCFormProvider } from './context/ScFormContext.jsx'

createRoot(document.getElementById('root')).render(
  <Fragment>
    <AdminFormProvider>
      <SCFormProvider>
      <App />
      </SCFormProvider>
    </AdminFormProvider>
  </Fragment>,
)
