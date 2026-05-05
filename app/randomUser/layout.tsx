export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col rounded-lg border-4 p-4 size-full p-4 border-pink-500">
      <p>Random User Layout</p>
      {children}
    </div>
  );
}
