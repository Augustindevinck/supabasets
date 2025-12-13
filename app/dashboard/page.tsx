import ButtonAccount from "@/components/ButtonAccount";

export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Dashboard() {
  return (
    <main className="min-h-screen bg-base-100">
      <header className="border-b border-base-200">
        <div className="max-w-4xl mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">Dashboard</h1>
            <p className="text-base-content/60 mt-2">Bienvenue dans votre espace personnel</p>
          </div>
          <ButtonAccount />
        </div>
      </header>
      
      <section className="max-w-4xl mx-auto px-8 py-12">
        {/* Your dashboard content goes here */}
      </section>
    </main>
  );
}
