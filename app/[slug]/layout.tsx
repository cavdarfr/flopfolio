export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            {children}
        </div>
    );
}
