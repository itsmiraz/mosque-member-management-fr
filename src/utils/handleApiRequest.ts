/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
type ApiRequestParams = {
    payload?: any | undefined;
    requestFunction: any;
    onSuccess: (response: any) => void;
    onError: (error: any) => void;
    onFinally?: () => void;
  };
  
  export const handleApiRequest = async ({
    payload,
    requestFunction,
    onSuccess,
    onError,
    onFinally = () => {},
  }: ApiRequestParams) => {
    try {
      const response = await requestFunction(payload).unwrap();
      if (response.success) {
        onSuccess(response);
      } else {
        toast.error(response.message || "Request failed.");
      }
    } catch (err: any) {
      onError(err);
    } finally {
      onFinally();
    }
  };
  