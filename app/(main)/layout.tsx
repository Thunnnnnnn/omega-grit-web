import NavBar from "../components/NavBar";
import Header from "../components/Header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <div className="flex min-h-[calc(100vh-80px)]">
        <NavBar />
        {children}
      </div>
    </div>
  );
}
