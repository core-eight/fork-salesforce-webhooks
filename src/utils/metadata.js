import { getRandomName, escapeXml } from "./common.js";
import createRemoteSiteTemplate from "../../resources/templates/soap/metadata/CreateRemoteSite.xml.handlebars";
import deleteRemoteSiteTemplate from "../../resources/templates/soap/metadata/DeleteRemoteSite.xml.handlebars";

export const getCreateRemoteSiteBody = (authToken, endpointUrl) => {
  const name = getRandomName("Endpoint");
  const body = createRemoteSiteTemplate({
    authToken,
    endpointUrl: escapeXml(endpointUrl),
    name: escapeXml(name),
  });
  return {
    body,
    name,
  };
};

export const getDeleteRemoteSiteBody = (authToken, name) => {
  const body = deleteRemoteSiteTemplate({
    authToken,
    name: escapeXml(name),
  });
  return {
    body,
  };
};
