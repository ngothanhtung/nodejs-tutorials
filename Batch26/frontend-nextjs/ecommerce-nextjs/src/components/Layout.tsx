import NavigationBar from './NavigationBar';
import Footer from './Footer';
import SideBar from './SideBar';

type Props = {
  children: React.ReactNode | JSX.Element;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <NavigationBar />
      <div style={{ display: 'flex' }}>
        <div style={{ minWidth: 200 }}>
          <SideBar />
        </div>
        <div style={{ flex: 1 }}>
          <main style={{ minHeight: '50vh', backgroundColor: 'yellow' }}>{children}</main>
        </div>
      </div>

      <Footer />
    </>
  );
}
