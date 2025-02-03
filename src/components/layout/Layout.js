import Image from "next/image";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                {/* Logo */}
                <Image
                  src="/images/Logo.png"
                  alt="BARANGkaliLupa Logo"
                  width={32}
                  height={32}
                  // Optional: add styling if needed
                  className="object-contain"
                />
                <h1 className="text-2xl font-bold text-blue-600">
                  BARANGkaliLupa
                </h1>
              </div>
            </div>

            {/* App Version or Additional Info */}
            <div className="text-sm text-gray-500">Beta Version</div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-500">
            © 2025 BARANGkaliLupa.
          </div>
          <div className="text-center text-sm text-gray-500">
            Created by Hasbi
          </div>
        </div>
      </footer>
    </div>
  );
}
