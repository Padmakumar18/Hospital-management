function ErrorPage() {
  return (
    <div className="App">
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <h2 className="text-2xl font-semibold mt-4">Oops! Page Not Found</h2>
        <p className="text-gray-600 mt-2">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <a
          href="/auth"
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
        >
          Go to Auth Page
        </a>
      </div>
    </div>
  );
}

export default ErrorPage;
