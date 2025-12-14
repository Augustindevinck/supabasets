"use client";
import DashboardLayout from "@/components/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout pageTitle="Home">
      <section className="p-8 flex justify-center w-full">
        <div className="w-full grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Dashboard content */}
        </div>
      </section>
    </DashboardLayout>
  );
}
