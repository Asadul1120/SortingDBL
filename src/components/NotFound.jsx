function NotFound() {
  return (
    <div className="bg-gray-900 text-white py-16 min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold mb-2">404</h1>
        <h2 className="text-2xl mb-4">Page Not Found</h2>
        <p className="text-lg mb-6">
          Sorry, the page you are looking for does not exist.
        </p>
        <a
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
}

export default NotFound;
