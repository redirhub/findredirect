const BATCH_SIZE = 10;

// Helper function to process a single URL result
function processUrlResult(urlData, originalUrl) {
  const lastItem = urlData[urlData.length - 1];
  const firstItem = urlData[0];

  return {
    url: originalUrl,
    chainNumber: urlData.filter(item => /^30\d/.test(item.http_code)).length,
    statusCode: firstItem.http_code || firstItem.error_no,
    finalUrl: lastItem.url || originalUrl,
    totalTime: urlData.filter(item => /^30\d/.test(item.http_code)).map(item => item.alltime).reduce((sum, item) => sum + (item || 0), 0),
    chain: urlData,
    error_msg: firstItem.error_msg,
  };
}

export async function checkRedirects(urlList, setProgress, toast) {
  const results = [];
  const totalUrls = urlList.length;

  // Split URLs into batches of 10
  const batches = [];
  for (let i = 0; i < urlList.length; i += BATCH_SIZE) {
    batches.push(urlList.slice(i, i + BATCH_SIZE));
  }

  let processedCount = 0;

  for (const batch of batches) {
    try {
      // Make batch API call
      const response = await fetch("/api/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: batch }),
      });

      if (!response.ok) {
        throw new Error(`Batch request failed with status ${response.status}`);
      }

      const batchData = await response.json();

      // Process each result in the batch
      batchData.forEach((urlData, index) => {
        const originalUrl = batch[index];
        results.push(processUrlResult(urlData, originalUrl));
        processedCount++;
        setProgress((processedCount / totalUrls) * 100);
      });

    } catch (error) {
      // If batch fails, add error results for all URLs in the batch
      batch.forEach(url => {
        results.push({
          url: url,
          chainNumber: 0,
          statusCode: 0,
          finalUrl: url,
          totalTime: 0,
          chain: [],
          error_msg: error.message,
        });
        processedCount++;
        setProgress((processedCount / totalUrls) * 100);
      });

      toast({
        title: "Batch Error",
        description: `Failed to check batch: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  return results;
}