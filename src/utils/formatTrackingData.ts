const formatAddress = (address: any) => {
  let formattedAddress = "";

  if (address?.city) {
    formattedAddress += address.city;
  }

  if (address?.state) {
    formattedAddress += `-${address.state}`;
  }

  if (address?.type) {
    formattedAddress += ` (${address.type})`;
  }

  return formattedAddress;
};

const formatDate = (date: string, time: string) => {
  const formattedDate = date.split("-").reverse().join("/");

  return `${formattedDate} às ${time}`;
};

export const formatTrackingData = (data: any) => {
  const lastEvent = data.events.at(-1);

  const trackingData = {
    code: data.code,
    packageType: data.packageType,
    delivered: data.delivered,
    updatedAt: formatDate(lastEvent.dateUpdate, lastEvent.timeUpdate),
    location: formatAddress(lastEvent.location),
    destination: formatAddress(lastEvent.destination),
    status: lastEvent.status,
  };

  return trackingData;
};
