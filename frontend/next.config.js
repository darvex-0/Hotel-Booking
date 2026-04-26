const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['antd', '@ant-design/icons', 'rc-pagination', 'rc-picker', 'rc-util', 'rc-tooltip', 'rc-table', 'rc-select', 'rc-tree', 'rc-menu'],
  publicRuntimeConfig: {
    // Will be available on both server and client
    API_BASE_URL: process.env.API_BASE_URL
  }
};

module.exports = nextConfig;
