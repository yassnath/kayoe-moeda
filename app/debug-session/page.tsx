// app/debug-session/page.tsx
import { auth } from "@/auth";

export default async function DebugSessionPage() {
  const session = await auth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white border rounded-xl shadow-sm p-6 max-w-xl w-full">
        <h1 className="text-lg font-semibold mb-4">Debug Session</h1>

        {!session && (
          <p className="text-sm text-red-500">Belum login.</p>
        )}

        {session && (
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">ID:</span> {(session.user as any).id}</p>
            <p><span className="font-medium">Username:</span> {(session.user as any).username}</p>
            <p><span className="font-medium">Email:</span> {session.user?.email ?? "-"}</p>
            <p><span className="font-medium">Role:</span> {(session.user as any).role}</p>

            <pre className="mt-4 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
{JSON.stringify(session, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
