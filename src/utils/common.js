import { randomBytes } from "crypto";

export const getRandomName = (rawName) => {
  const maxLength = 40;
  const namePrefix = `core8_${rawName}_`;
  const randomComponentLength = Math.floor(
    Math.max(0, maxLength - namePrefix.length) / 2,
  );
  const randomComponent = randomBytes(randomComponentLength).toString("hex");
  return `${namePrefix}${randomComponent}`;
};

export const escapeXml = (unsafe) => {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

export const wasSuccessfulSoapRequest = (responseBody) => {
  return !/<success>false<\/success>/.test(responseBody);
};
