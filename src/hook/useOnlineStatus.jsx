import { useState, useEffect } from "react";

export default function useOnlineStatus(
  url = "https://sec-mega.site",
  interval = 3000
) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkConnection = async () => {
      try {
        const controller = new AbortController();

        const timeout = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(url, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (mounted) {
          setIsOnline(res.ok);
        }
      } catch (err) {
        if (mounted) {
          setIsOnline(false);
        }
      }
    };

    checkConnection();

    const id = setInterval(checkConnection, interval);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [url, interval]);

  return isOnline;
}