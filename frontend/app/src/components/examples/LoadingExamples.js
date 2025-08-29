import React, { useState } from "react";
import Loading, {
  LoadingButton,
  LoadingOverlay,
  PageLoading,
  SearchLoading,
  CardLoading,
  TableLoading,
  useLoading,
} from "../Loading";

// Example component showing different loading states
const LoadingExamples = () => {
  const [searchLoading, setSearchLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const { loading: asyncLoading, withLoading } = useLoading();

  // Simulate search operation
  const handleSearch = async () => {
    setSearchLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSearchLoading(false);
  };

  // Simulate data loading
  const handleLoadData = async () => {
    setDataLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setDataLoading(false);
  };

  // Simulate page loading
  const handlePageLoad = async () => {
    setPageLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setPageLoading(false);
  };

  // Simulate async operation with hook
  const handleAsyncOperation = () => {
    withLoading(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Async operation completed");
    });
  };

  if (pageLoading) {
    return <PageLoading message="Loading dashboard..." />;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Loading Components Examples
      </h1>

      {/* Basic Loading Types */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">
          Basic Loading Types
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center space-y-2">
            <Loading type="default" size="medium" />
            <p className="text-sm text-gray-600">Default</p>
          </div>
          <div className="text-center space-y-2">
            <Loading type="spinner" size="medium" />
            <p className="text-sm text-gray-600">Spinner</p>
          </div>
          <div className="text-center space-y-2">
            <Loading type="dots" size="medium" />
            <p className="text-sm text-gray-600">Dots</p>
          </div>
          <div className="text-center space-y-2">
            <Loading type="pulse" size="medium" />
            <p className="text-sm text-gray-600">Pulse</p>
          </div>
        </div>
      </section>

      {/* Medical/Search Themed */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">Themed Loaders</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center space-y-2">
            <Loading
              type="search"
              size="large"
              message="Searching patients..."
            />
          </div>
          <div className="text-center space-y-2">
            <Loading
              type="medical"
              size="large"
              message="Processing medical data..."
            />
          </div>
        </div>
      </section>

      {/* Interactive Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">
          Interactive Examples
        </h2>

        {/* Search Example */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Search Loading</h3>
          <div className="flex space-x-4 mb-4">
            <input
              type="text"
              placeholder="Search patients..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <LoadingButton
              loading={searchLoading}
              onClick={handleSearch}
              loadingText="Searching..."
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Search
            </LoadingButton>
          </div>
          {searchLoading && (
            <SearchLoading message="Searching for patients..." />
          )}
        </div>

        {/* Data Loading with Overlay */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            Data Loading with Overlay
          </h3>
          <LoadingOverlay
            loading={dataLoading}
            message="Loading patient data..."
            type="medical"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-100 p-4 rounded">Patient 1</div>
                <div className="bg-gray-100 p-4 rounded">Patient 2</div>
                <div className="bg-gray-100 p-4 rounded">Patient 3</div>
              </div>
              <LoadingButton
                loading={dataLoading}
                onClick={handleLoadData}
                loadingText="Loading..."
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Load Data
              </LoadingButton>
            </div>
          </LoadingOverlay>
        </div>

        {/* Async Hook Example */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Async Hook Example</h3>
          <LoadingButton
            loading={asyncLoading}
            onClick={handleAsyncOperation}
            loadingText="Processing..."
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Run Async Operation
          </LoadingButton>
        </div>

        {/* Page Loading Example */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Full Page Loading</h3>
          <LoadingButton
            onClick={handlePageLoad}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Simulate Page Load
          </LoadingButton>
        </div>
      </section>

      {/* Skeleton Loading Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">
          Skeleton Loading
        </h2>

        {/* Card Skeleton */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Card Loading</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CardLoading />
            <CardLoading />
            <CardLoading />
          </div>
        </div>

        {/* Table Skeleton */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Table Loading</h3>
          <TableLoading rows={5} columns={4} />
        </div>

        {/* Content Skeleton */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Content Loading</h3>
          <Loading type="skeleton" />
        </div>
      </section>

      {/* Size Variations */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">
          Size Variations
        </h2>
        <div className="flex items-center space-x-8">
          <div className="text-center space-y-2">
            <Loading type="spinner" size="small" />
            <p className="text-sm text-gray-600">Small</p>
          </div>
          <div className="text-center space-y-2">
            <Loading type="spinner" size="medium" />
            <p className="text-sm text-gray-600">Medium</p>
          </div>
          <div className="text-center space-y-2">
            <Loading type="spinner" size="large" />
            <p className="text-sm text-gray-600">Large</p>
          </div>
          <div className="text-center space-y-2">
            <Loading type="spinner" size="xl" />
            <p className="text-sm text-gray-600">Extra Large</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoadingExamples;
