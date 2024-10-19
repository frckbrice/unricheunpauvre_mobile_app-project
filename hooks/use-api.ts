
// import libs
import { useEffect, useState } from "react";

const useApiOps = <T>(fn: Function): T | T[] | any => {
    const [data, setData] = useState<T | T[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        fn()
            .then((res: any) => {
                console.log("\n\n from use api ops", res)
                if (res)
                    return setData(res);
                console.log("from upapiops: no data")
            })
            .catch((error: any) => {
                console.error("Error", error.message)
                setData([]);
            })
            .finally(() => setIsLoading(false));
    }

    useEffect(() => {
        fetchData()
    }, []);

    // called when refresh the screen from home screen
    const refetch = () => fetchData()

    return { isLoading, data, refetch };
}

export default useApiOps;
