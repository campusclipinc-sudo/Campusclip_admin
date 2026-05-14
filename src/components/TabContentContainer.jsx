import React, { useState } from "react";

/**
 * Common Tab Content Container Component
 * 
 * @param {Object} props
 * @param {string} props.activeTab - Currently active tab key
 * @param {Object} props.tabsConfig - Configuration for each tab
 * @param {Function} props.tabsConfig[key].fetchFn - Function to fetch data (returns a query object)
 * @param {Function} props.tabsConfig[key].renderContent - Function to render content (receives { data, isLoading, pagination, onPageChange })
 * @param {Object} props.tabsConfig[key].params - Optional params to pass to fetchFn
 * @param {boolean} props.tabsConfig[key].enablePagination - Whether to enable pagination (default: false)
 */
const TabContentContainer = ({ activeTab, tabsConfig = {} }) => {
  const [pageIndices, setPageIndices] = useState({});

  const getPageIndex = (tabKey) => pageIndices[tabKey] || 0;
  const setPageIndex = (tabKey, index) => {
    setPageIndices((prev) => ({ ...prev, [tabKey]: index }));
  };

  const activeConfig = tabsConfig[activeTab];

  if (!activeConfig) {
    return <div className="text-center py-4">No content configured for this tab.</div>;
  }

  const { fetchFn, renderContent, params = {}, enablePagination = false } = activeConfig;

  // Build params with pagination if enabled
  const queryParams = enablePagination
    ? {
        ...params,
        page: getPageIndex(activeTab) + 1,
        limit: params.limit || 10,
      }
    : params;

  // Fetch data using the provided function
  const queryResult = fetchFn ? fetchFn(queryParams) : null;

  // Extract data, loading state, and pagination
  const data = queryResult?.data?.data || queryResult?.data || null;
  const isLoading = queryResult?.isLoading || queryResult?.isPending || false;
  const pagination = data?.pagination || null;

  // Handle page change
  const handlePageChange = (newPageIndex) => {
    setPageIndex(activeTab, newPageIndex);
  };

  // Render content using the provided render function
  return renderContent({
    data,
    isLoading,
    pagination,
    onPageChange: handlePageChange,
    pageIndex: getPageIndex(activeTab),
  });
};

export default TabContentContainer;

