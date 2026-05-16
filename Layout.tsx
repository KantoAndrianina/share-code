import ToastStack from '../ToastStack'

// ...

export default function Layout() {
  return (
    <div className={s.shell}>
      <Header />
      <ToastStack />
      <div className={s.main}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}