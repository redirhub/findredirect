export async function checkRedirects(urlList, setProgress, toast) {
  const results = [];
  const totalUrls = urlList.length;

  for (let i = 0; i < totalUrls; i++) {
    try {
      const response = await fetch("/api/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlList[i] }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch redirect data for ${urlList[i]}`);
      }

      const data = await response.json();
      const lastItem = data[data.length - 1];
      
      results.push({
        url: urlList[i],
        chainNumber: data.filter(item => /^30\d/.test(item.http_code)).length,
        statusCode: lastItem.http_code || lastItem.error_no,
        finalUrl: lastItem.url || urlList[i],
        totalTime: data.reduce((sum, item) => sum + (item.alltime || 0), 0),
        chain: data,
        error_msg: lastItem.error_msg,
      });
    } catch (error) {
      results.push({
        url: urlList[i],
        chainNumber: 0,
        statusCode: 0,
        finalUrl: urlList[i],
        totalTime: 0,
        chain: [],
        error_msg: error.message,
      });

      toast({
        title: "Error",
        description: `Failed to check ${urlList[i]}: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setProgress(((i + 1) / totalUrls) * 100);
    }
  }

  return results;
}