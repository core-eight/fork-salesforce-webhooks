import { getRandomName } from "./common.js";
import createRemoteSiteTemplate from "../../resources/templates/soap/metadata/CreateRemoteSite.xml.handlebars";
import deleteRemoteSiteTemplate from "../../resources/templates/soap/metadata/DeleteRemoteSite.xml.handlebars";

export const getCreateRemoteSiteBody = (authToken, endpointUrl) => {
  const name = getRandomName("Endpoint");
  const body = createRemoteSiteTemplate({
    authToken,
    endpointUrl,
    name,
  });
  return {
    body,
    name,
  };
};

export const getDeleteRemoteSiteBody = (authToken, name) => {
  const body = deleteRemoteSiteTemplate({
    authToken,
    name,
  });
  return {
    body,
  };
};
