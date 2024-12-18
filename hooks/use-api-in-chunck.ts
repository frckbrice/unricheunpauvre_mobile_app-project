import React, { useCallback, useRef, useState } from "react";

// Updated useApiOps hook for chunk-based fetching
export const useChunkedApiOps = <T>(
    fetchFn: (page: number, pageSize: number) => Promise<T[]>,
    initialPage = 1,
    initialPageSize = 10,
    total = 0
) => {
    const [data, setData] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(total);
    const [hasMore, setHasMore] = useState(true);
    const abortController = useRef<AbortController | null>(null);

    /**
     * here we face a problem where the fetch All pubs is not yet set. it impose the setting of the 
     * page and pageSize parameters.
     */

    const fetchData = useCallback(async (currentPage: number) => {

        // Cancel previous request if exists
        abortController.current?.abort();
        abortController.current = new AbortController();

        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const result = await fetchFn(currentPage, initialPageSize);

            console.log("\n\n from useChunkedApiOps file: ", result)

            if (result?.length === 0) {
                setHasMore(false);
                return;
            }

            setData(prevData =>
                currentPage === 1
                    ? result
                    : [...prevData, ...result]
            );

            setTotalPages(result.length);
            // setPage(result.currentPage);
            setPage(currentPage);
            // setHasMore(result.currentPage < result.totalPages);
            setHasMore(currentPage < totalPages);

        } catch (error) {
            console.error('Chunk fetch error:', error);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [fetchFn, initialPageSize, isLoading, hasMore]);

    const loadMore = useCallback(() => {
        if (hasMore && !isLoading) {
            fetchData(page + 1);
        }
    }, [fetchData, page, hasMore, isLoading]);

    const refresh = useCallback(() => {
        // setData([]);
        // setPage(1);
        // setHasMore(true);
        // fetchData(1);
        console.log("\n\n refreshing by loading more data")
        loadMore();
    }, [fetchData]);

    // Initial fetch
    React.useEffect(() => {
        fetchData(1);
    }, [fetchData]);

    return {
        data,
        isLoading,
        hasMore,
        loadMore,
        refresh,
        totalPages
    };
};