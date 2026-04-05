'use client';

import Header from '@/components/ui/Header';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function NotFound() {
  const router = useRouter();
  const { user } = useAuth();

  const getHomeForRole = (role?: string) => {
    if (!role) return '/';
    switch (role) {
      case 'Admin':
        return '/admin/dashboard';
      case 'AdminWarehouse':
        return '/admin/dashboard';
      case 'AdminCompany':
        return '/company/small-collection';
      case 'Collector':
        return '/collection-point/dashboard';
      case 'RecyclingCompany':
        return '/recycle/package';
      default:
        return '/';
    }
  };

  const roleHome = getHomeForRole(user?.role);

  return (
    <>
      <Header title="Ewise" href="/" profileHref="/profile" />
      <main className="relative min-h-[calc(100dvh-3.5rem)] overflow-hidden bg-linear-to-br from-primary-50 via-white to-background-50 px-4 py-10 sm:min-h-[calc(100dvh-4rem)] sm:py-14">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary-100 blur-3xl" />
          <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-primary-200 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-full w-full max-w-5xl items-center justify-center">
          <div className="grid w-full overflow-hidden rounded-4xl border border-white/70 bg-white/90 shadow-[0_24px_80px_rgba(232,90,79,0.16)] backdrop-blur md:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col justify-center gap-6 p-8 sm:p-10 lg:p-14">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
                <AlertTriangle size={16} />
                Trang không tồn tại
              </div>

              <div className="space-y-4">
                <div className="text-6xl font-black tracking-tight text-primary-600 sm:text-7xl lg:text-8xl">
                  404
                </div>
                <h1 className="max-w-lg text-3xl font-bold text-gray-900 sm:text-4xl">
                  Bạn đã đi lạc khỏi khu vực đang hiển thị.
                </h1>
                <p className="max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
                  Trang bạn vừa mở không còn tồn tại, đã được đổi địa chỉ, hoặc bạn chưa có quyền truy cập.
                  Hãy quay lại trang trước hoặc trở về trang chủ để tiếp tục.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 transition-transform hover:-translate-y-0.5 hover:bg-gray-800"
                >
                  <ArrowLeft size={16} />
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={() => router.push(roleHome)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-200 bg-white px-5 py-3 text-sm font-semibold text-primary-700 shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-primary-50"
                >
                  <Home size={16} />
                  Về trang chủ
                </button>
              </div>
            </div>

            <div className="flex items-stretch border-t border-primary-100 bg-linear-to-br from-primary-600 via-primary-500 to-primary-700 p-8 text-white md:border-l md:border-t-0 md:p-10 lg:p-14">
              <div className="flex w-full flex-col justify-between gap-8 rounded-[1.75rem] border border-white/20 bg-white/10 p-6 shadow-2xl shadow-primary-900/10 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="text-sm font-medium uppercase tracking-[0.3em] text-white/70">
                    Ewise
                  </div>
                  <div className="text-2xl font-bold leading-tight sm:text-3xl">
                    Giao diện quen thuộc, chỉ thiếu đúng trang bạn cần.
                  </div>
                  <p className="max-w-md text-sm leading-6 text-white/85 sm:text-base">
                    Mọi thứ vẫn giữ đúng phong cách của hệ thống: tông primary, card bo tròn, và bố cục rõ ràng.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/60">Hành động nhanh</div>
                    <div className="mt-2 text-sm font-medium">Quay lại hoặc về trang chủ</div>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/60">Trạng thái</div>
                    <div className="mt-2 text-sm font-medium">404 - Not Found</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}