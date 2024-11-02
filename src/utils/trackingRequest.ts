import axios from "axios";

export const trackingRequest = async (trackingCode: string) => {
  const { data: response } = await axios.get(
    `${process.env.EXPO_PUBLIC_TRACKING_API}/${trackingCode}`
  );

  return response;
};
