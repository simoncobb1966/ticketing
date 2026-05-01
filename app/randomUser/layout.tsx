export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <div className="h-full rounded-lg p-5 m-5 border-4 border-solid border-red-500">
    <div className="h-[calc(100dvh_-_32px)] rounded-lg p-5 m-5 border-4 border-pink-500 overflow-hidden">
      <p>Random User Layout</p>
      {children}
    </div>
  );
}
