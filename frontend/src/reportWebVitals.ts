/**
 * Optional web vitals reporting (CLS, FID, FCP, LCP, TTFB). Pass a callback to receive metrics.
 */
import { ReportHandler } from 'web-vitals';

/**
 * Starts reporting web vitals to the given callback when provided.
 * @param onPerfEntry - Optional callback to receive metric entries
 */
const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
